/**
 * APEX production pipeline: Monitor → (optional) OpenAI Decision → (optional) on-chain Execution,
 * with Supabase audit trail, Telegram alerts, and execution cooldown / caps.
 *
 * Env: see agent/config/env.mjs and .env.example
 *
 * Usage: node agent/pipeline.mjs
 */
import "dotenv/config";
import { ethers } from "ethers";
import { loadAgentEnv, requireVault } from "./config/env.mjs";
import { buildPortfolioSnapshot, parseFeedMap } from "./core/portfolioSnapshot.mjs";
import { executeRebalanceWithAudit } from "./core/executionCore.mjs";
import { createSupabaseRepo } from "./services/supabaseRepo.mjs";
import { createTelegramNotifier } from "./services/telegram.mjs";
import { decide } from "./decisionAgent.mjs";
import { logger } from "./lib/logger.mjs";

function secondsSince(iso) {
  if (!iso) return Infinity;
  return (Date.now() - new Date(iso).getTime()) / 1000;
}

function computeAmountWei(snap, assetAddr, amountPct, maxPct) {
  const row = snap.assets.find((a) => a.token.toLowerCase() === assetAddr.toLowerCase());
  if (!row) throw new Error("Decision asset not in vault snapshot");
  const bal = BigInt(row.balance);
  if (bal === 0n) throw new Error("Zero balance for asset");
  let pct = Math.floor(Number(amountPct) || 0);
  if (pct <= 0) pct = Math.min(maxPct, 10);
  pct = Math.min(maxPct, Math.max(1, pct));
  return (bal * BigInt(pct)) / 100n;
}

async function maybeAutoExecute(env, snap, tg, repo) {
  if (!env.PIPELINE_AUTO_EXECUTE) return;
  if (!env.PRIVATE_KEY) throw new Error("PIPELINE_AUTO_EXECUTE requires PRIVATE_KEY");
  if (!env.OPENAI_API_KEY) throw new Error("PIPELINE_AUTO_EXECUTE requires OPENAI_API_KEY");
  if (!env.DECISION_LOG_CONTRACT) throw new Error("PIPELINE_AUTO_EXECUTE requires DECISION_LOG_CONTRACT");

  const state = repo ? await repo.getPipelineState() : null;
  const since = secondsSince(state?.last_execution_at);
  if (since < env.MIN_SECONDS_BETWEEN_EXECUTIONS) {
    logger.info("pipeline.cooldown_skip", { since, min: env.MIN_SECONDS_BETWEEN_EXECUTIONS });
    return;
  }

  let d;
  try {
    d = await decide(snap);
  } catch (e) {
    logger.error("pipeline.decision_failed", { message: e.message });
    await tg.send(`<b>APEX Decision error</b>\n<code>${String(e.message).slice(0, 500)}</code>`);
    return;
  }
  if (d.action === "hold") {
    logger.info("pipeline.decision_hold", { confidence: d.confidence });
    if (repo) {
      await repo.insertDecision({
        portfolioId: snap.vault,
        assetAddress: null,
        decisionType: "hold",
        direction: null,
        amountPct: null,
        confidence: d.confidence,
        reasoning: d.reasoning,
        reasoningHash: ethers.keccak256(ethers.toUtf8Bytes(d.reasoning)),
        openaiModel: env.OPENAI_MODEL,
        status: "skipped",
      });
    }
    await tg.send(`<b>APEX Decision</b> hold (conf ${d.confidence})`);
    return;
  }

  if (d.confidence < env.MIN_DECISION_CONFIDENCE) {
    logger.warn("pipeline.below_confidence", { confidence: d.confidence, min: env.MIN_DECISION_CONFIDENCE });
    await tg.send(`<b>APEX Decision</b> below min confidence (${d.confidence} &lt; ${env.MIN_DECISION_CONFIDENCE}). No execution.`);
    return;
  }

  const token = ethers.getAddress(d.asset);
  const isIncrease = d.direction === "increase";
  const amountWei = computeAmountWei(snap, token, d.amountPct ?? 0, env.MAX_REBALANCE_PCT_OF_BALANCE);
  if (amountWei === 0n) {
    logger.warn("pipeline.zero_amount_skip");
    return;
  }

  const portfolioIdBytes32 = ethers.keccak256(ethers.toUtf8Bytes(snap.vault));
  const reasoningHashHex = ethers.keccak256(ethers.toUtf8Bytes(d.reasoning));

  let rowId = null;
  if (repo) {
    rowId = await repo.insertDecision({
      portfolioId: snap.vault,
      assetAddress: token,
      decisionType: "rebalance",
      direction: d.direction,
      amountPct: d.amountPct ?? null,
      confidence: d.confidence,
      reasoning: d.reasoning,
      reasoningHash: reasoningHashHex,
      openaiModel: env.OPENAI_MODEL,
      status: "pending",
    });
  }

  const provider = new ethers.JsonRpcProvider(env.HASHKEY_TESTNET_RPC);
  const wallet = new ethers.Wallet(env.PRIVATE_KEY, provider);
  const vault = new ethers.Contract(snap.vault, ["function agent() view returns (address)"], provider);
  const agentOnChain = await vault.agent();
  if (agentOnChain.toLowerCase() !== wallet.address.toLowerCase()) {
    throw new Error(`PRIVATE_KEY wallet ${wallet.address} is not vault agent ${agentOnChain}`);
  }

  const result = await executeRebalanceWithAudit({
    wallet,
    vaultAddress: snap.vault,
    decisionLogAddress: env.DECISION_LOG_CONTRACT,
    portfolioId: portfolioIdBytes32,
    token,
    isIncrease,
    amountWei,
    confidence: d.confidence,
    reasoning: d.reasoning,
  });

  if (rowId && repo) await repo.updateDecisionTx(rowId, result.rebalanceTxHash, "confirmed");
  if (repo) await repo.touchPipelineExecution(result.rebalanceTxHash);

  await tg.send(
    `<b>APEX Executed</b>\nTX: <code>${result.rebalanceTxHash}</code>\nLog: <code>${result.logTxHash}</code>`
  );
  logger.info("pipeline.execution_complete", result);
}

async function tick(env, provider, vault, feedMap, useOracle, repo, tg) {
  const snap = await buildPortfolioSnapshot(provider, vault, feedMap, useOracle);
  const action = snap.rebalanceNeeded ? "REBALANCE_NEEDED" : "MONITOR_TICK";
  logger.info("pipeline.tick", { action, vault });

  await repo?.insertAgentLog(snap.vault, action, snap);

  if (snap.rebalanceNeeded) {
    const lines = snap.drifts
      .filter((x) => x.rebalanceCandidate)
      .map((x) => `${x.symbol}: drift ${(x.driftBps / 100).toFixed(2)}%`)
      .join("\n");
    await tg.send(`<b>APEX Monitor</b> rebalance needed\n${lines}`);
    await maybeAutoExecute(env, snap, tg, repo);
  }
}

async function main() {
  process.env.LOG_LEVEL = process.env.LOG_LEVEL || "info";
  const env = loadAgentEnv();
  const vault = requireVault(env.VAULT_CONTRACT);

  const useOracle = env.USE_ORACLE_PRICING;
  let feedMap = new Map();
  if (useOracle) feedMap = parseFeedMap(env.TOKEN_PRICE_FEEDS_JSON);

  const provider = new ethers.JsonRpcProvider(env.HASHKEY_TESTNET_RPC);
  const repo = createSupabaseRepo(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  const tg = createTelegramNotifier(env.TELEGRAM_BOT_TOKEN, env.TELEGRAM_CHAT_ID);

  logger.info("pipeline.start", {
    vault,
    intervalSec: env.MONITOR_INTERVAL_SEC,
    oracle: useOracle,
    autoExecute: env.PIPELINE_AUTO_EXECUTE,
    supabase: Boolean(repo),
    telegram: tg.enabled,
  });

  await tg.send("<b>APEX Pipeline</b> started");

  await tick(env, provider, vault, feedMap, useOracle, repo, tg);
  const id = setInterval(() => {
    tick(env, provider, vault, feedMap, useOracle, repo, tg).catch((e) => logger.error("pipeline.tick_error", { message: e.message, stack: e.stack }));
  }, env.MONITOR_INTERVAL_SEC * 1000);

  const shutdown = async () => {
    clearInterval(id);
    logger.info("pipeline.shutdown");
    await tg.send("<b>APEX Pipeline</b> stopping");
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

const isMain = process.argv[1]?.replace(/\\/g, "/").includes("pipeline");
if (isMain) {
  main().catch((e) => {
    logger.error("pipeline.fatal", { message: e.message, stack: e.stack });
    process.exit(1);
  });
}
