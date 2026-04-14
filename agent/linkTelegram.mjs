/**
 * Link a Telegram chat ID to a specific portfolio/vault for alert isolation.
 *
 * Usage (PowerShell):
 *   $env:LINK_PORTFOLIO_ID="0xVaultAddress"
 *   $env:LINK_TELEGRAM_CHAT_ID="6689707513"
 *   npm run agent:link-telegram
 */
import "dotenv/config";
import { loadAgentEnv, requireVault } from "./config/env.mjs";
import { createSupabaseRepo } from "./services/supabaseRepo.mjs";

async function main() {
  const env = loadAgentEnv();
  const repo = createSupabaseRepo(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  if (!repo) throw new Error("Supabase is required (SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY)");

  const portfolioId = requireVault(process.env.LINK_PORTFOLIO_ID || env.VAULT_CONTRACT);
  const chatId = (process.env.LINK_TELEGRAM_CHAT_ID || "").trim();
  const userId = (process.env.LINK_USER_ID || "").trim() || null;
  if (!chatId) throw new Error("Set LINK_TELEGRAM_CHAT_ID");

  const ok = await repo.upsertNotificationChannel({
    portfolioId,
    userId,
    channelType: "telegram",
    channelTarget: chatId,
    metadata: { source: "manual-link-cli" },
    enabled: true,
  });
  if (!ok) throw new Error("Failed to upsert notification channel");

  console.log(
    JSON.stringify(
      {
        ok: true,
        portfolioId,
        channelType: "telegram",
        channelTarget: chatId,
        userId,
      },
      null,
      2
    )
  );
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});

