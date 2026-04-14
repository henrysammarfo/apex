/**
 * One-shot smoke test for full APEX backend path (no long-running loops, no frontend).
 *
 * Checks:
 * - env parse
 * - RPC connectivity + vault snapshot
 * - OpenAI decision
 * - Supabase write path (agent_logs)
 * - Telegram send path
 *
 * Does NOT execute on-chain rebalance txs.
 */
import "dotenv/config";
import { loadAgentEnv, requireVault } from "./config/env.mjs";
import { createHealthyProvider, rpcCandidates } from "./lib/rpcProvider.mjs";
import { buildPortfolioSnapshot, parseFeedMap } from "./core/portfolioSnapshot.mjs";
import { createSupabaseRepo } from "./services/supabaseRepo.mjs";
import { createTelegramNotifier } from "./services/telegram.mjs";
import { decide } from "./decisionAgent.mjs";

async function main() {
  const env = loadAgentEnv();
  const vault = requireVault(env.VAULT_CONTRACT);

  const useOracle = env.USE_ORACLE_PRICING;
  const feedMap = useOracle ? parseFeedMap(env.TOKEN_PRICE_FEEDS_JSON) : new Map();

  const provider = await createHealthyProvider(env.HASHKEY_TESTNET_RPC);
  const repo = createSupabaseRepo(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  const tg = createTelegramNotifier(env.TELEGRAM_BOT_TOKEN, env.TELEGRAM_CHAT_ID);

  const snap = await buildPortfolioSnapshot(provider, vault, feedMap, useOracle);
  const decision = await decide(snap);

  let dbOk = null;
  if (repo) {
    dbOk = await repo.insertAgentLog(snap.vault, "SMOKE_TEST", {
      ts: new Date().toISOString(),
      rebalanceNeeded: snap.rebalanceNeeded,
      assets: snap.assets.length,
    });
  }

  if (tg.enabled) {
    await tg.send(
      `<b>APEX Smoke</b> ok\nvault: <code>${vault}</code>\nrebalanceNeeded: <b>${snap.rebalanceNeeded}</b>\ndecision: <b>${decision.action}</b>`
    );
  }

  const out = {
    ok: true,
    rpcCandidates: rpcCandidates(env.HASHKEY_TESTNET_RPC),
    vault,
    mode: snap.mode,
    assets: snap.assets.length,
    rebalanceNeeded: snap.rebalanceNeeded,
    decision: {
      action: decision.action,
      direction: decision.direction ?? null,
      confidence: decision.confidence,
      asset: decision.asset ?? null,
    },
    supabaseEnabled: Boolean(repo),
    supabaseWriteOk: dbOk,
    telegramEnabled: tg.enabled,
  };

  console.log(JSON.stringify(out, null, 2));
}

main().catch((e) => {
  console.error(
    JSON.stringify(
      {
        ok: false,
        error: e.message,
        stack: e.stack,
      },
      null,
      2
    )
  );
  process.exit(1);
});

