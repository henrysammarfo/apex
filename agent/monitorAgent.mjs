/**
 * Monitor-only process (no OpenAI / execution). For full stack use agent/pipeline.mjs.
 */
import "dotenv/config";
import { ethers } from "ethers";
import { loadAgentEnv, requireVault } from "./config/env.mjs";
import { buildPortfolioSnapshot, parseFeedMap } from "./core/portfolioSnapshot.mjs";
import { createSupabaseRepo } from "./services/supabaseRepo.mjs";
import { logger } from "./lib/logger.mjs";
import { createHealthyProvider, rpcCandidates } from "./lib/rpcProvider.mjs";

async function tick(env, provider, vault, feedMap, useOracle, repo) {
  const snap = await buildPortfolioSnapshot(provider, vault, feedMap, useOracle, {
    maxStalenessSec: env.ORACLE_MAX_STALENESS_SEC,
  });
  const action = snap.rebalanceNeeded ? "REBALANCE_NEEDED" : "MONITOR_TICK";
  logger.info("monitor.tick", { action, vault });
  if (repo) await repo.insertAgentLog(snap.vault, action, snap);
  for (const d of snap.drifts) {
    logger.info("monitor.drift", {
      symbol: d.symbol,
      token: d.token,
      currentPct: d.currentPctBps / 100,
      targetPct: d.targetPctBps / 100,
      driftPct: d.driftBps / 100,
      candidate: d.rebalanceCandidate,
    });
  }
  return snap;
}

async function main() {
  const env = loadAgentEnv();
  const vault = requireVault(env.VAULT_CONTRACT);

  const useOracle = env.USE_ORACLE_PRICING;
  let feedMap = new Map();
  if (useOracle) feedMap = parseFeedMap(env.TOKEN_PRICE_FEEDS_JSON);

  const provider = await createHealthyProvider(env.HASHKEY_TESTNET_RPC);
  const repo = createSupabaseRepo(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  logger.info("monitor.start", {
    vault,
    intervalSec: env.MONITOR_INTERVAL_SEC,
    oracle: useOracle,
    supabase: Boolean(repo),
    rpcCandidates: rpcCandidates(env.HASHKEY_TESTNET_RPC),
  });

  await tick(env, provider, vault, feedMap, useOracle, repo);
  setInterval(() => {
    tick(env, provider, vault, feedMap, useOracle, repo).catch((e) =>
      logger.error("monitor.tick_error", { message: e.message, stack: e.stack })
    );
  }, env.MONITOR_INTERVAL_SEC * 1000);
}

const isMain = process.argv[1]?.replace(/\\/g, "/").includes("monitorAgent");
if (isMain) {
  main().catch((e) => {
    logger.error("monitor.fatal", { message: e.message, stack: e.stack });
    process.exit(1);
  });
}

export { tick };
