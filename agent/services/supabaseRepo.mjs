import { createClient } from "@supabase/supabase-js";
import { jsonSafe } from "../lib/jsonSafe.mjs";
import { logger } from "../lib/logger.mjs";

export function createSupabaseRepo(url, serviceRoleKey) {
  if (!url || !serviceRoleKey) return null;
  const db = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return {
    async insertAgentLog(portfolioId, action, details) {
      const { error } = await db.from("agent_logs").insert({
        portfolio_id: portfolioId,
        action,
        details: jsonSafe(details),
      });
      if (error) logger.error("supabase.agent_logs insert failed", { error: error.message });
      return !error;
    },

    async insertDecision(row) {
      const { data, error } = await db
        .from("decisions")
        .insert({
          portfolio_id: row.portfolioId,
          asset_address: row.assetAddress,
          decision_type: row.decisionType,
          direction: row.direction,
          amount_pct: row.amountPct,
          confidence: row.confidence,
          reasoning: row.reasoning,
          reasoning_hash: row.reasoningHash,
          chainlink_price: row.chainlinkPrice ?? null,
          tx_hash: row.txHash ?? null,
          openai_model: row.openaiModel ?? null,
          status: row.status ?? "pending",
        })
        .select("id")
        .single();
      if (error) {
        logger.error("supabase.decisions insert failed", { error: error.message });
        return null;
      }
      return data?.id ?? null;
    },

    async updateDecisionTx(id, txHash, status) {
      const { error } = await db.from("decisions").update({ tx_hash: txHash, status }).eq("id", id);
      if (error) logger.error("supabase.decisions update failed", { error: error.message });
      return !error;
    },

    async upsertPortfolio(row) {
      const { error } = await db.from("portfolios").upsert(
        {
          vault_address: row.vaultAddress,
          owner_wallet: row.ownerWallet,
          nexaid_hash: row.nexaidHash ?? null,
          assets: row.assets ?? null,
          thresholds: row.thresholds ?? null,
          hsp_config: row.hspConfig ?? null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "vault_address" }
      );
      if (error) logger.error("supabase.portfolios upsert failed", { error: error.message });
      return !error;
    },

    async getPipelineState() {
      const { data, error } = await db.from("pipeline_state").select("*").eq("id", 1).maybeSingle();
      if (error) {
        logger.warn("supabase.pipeline_state read failed", { error: error.message });
        return null;
      }
      return data;
    },

    async touchPipelineExecution(txHash) {
      const { error } = await db.from("pipeline_state").upsert({
        id: 1,
        last_execution_at: new Date().toISOString(),
        last_tx_hash: txHash,
        updated_at: new Date().toISOString(),
      });
      if (error) logger.error("supabase.pipeline_state upsert failed", { error: error.message });
      return !error;
    },

    async getNotificationTargets(portfolioId, channelType = "telegram") {
      const { data, error } = await db
        .from("notification_channels")
        .select("channel_target")
        .eq("portfolio_id", portfolioId)
        .eq("channel_type", channelType)
        .eq("enabled", true);
      if (error) {
        logger.error("supabase.notification_channels read failed", { error: error.message });
        return [];
      }
      return (data ?? [])
        .map((r) => r.channel_target)
        .filter((v) => typeof v === "string" && v.trim().length > 0);
    },

    async upsertNotificationChannel({ portfolioId, userId, channelType = "telegram", channelTarget, metadata = null, enabled = true }) {
      const { error } = await db.from("notification_channels").upsert(
        {
          portfolio_id: portfolioId,
          user_id: userId ?? null,
          channel_type: channelType,
          channel_target: channelTarget,
          metadata,
          enabled,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "portfolio_id,channel_type,channel_target" }
      );
      if (error) logger.error("supabase.notification_channels upsert failed", { error: error.message });
      return !error;
    },
  };
}
