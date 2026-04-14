import { supabase } from "@/lib/supabaseClient";

export interface LiveAgentLog {
  id: string;
  action: string;
  details: Record<string, unknown> | null;
  created_at: string;
}

export interface LiveDecisionRow {
  id: string;
  decision_type: string;
  direction: string | null;
  amount_pct: number | null;
  confidence: number | null;
  tx_hash: string | null;
  status: string;
  executed_at: string;
  asset_address: string | null;
}

function requireVaultAddress() {
  const v = import.meta.env.VITE_PUBLIC_VAULT_ADDRESS;
  if (!v || !/^0x[a-fA-F0-9]{40}$/.test(v)) return null;
  return v;
}

export async function fetchAgentLogs(limit = 50): Promise<LiveAgentLog[]> {
  const vault = requireVaultAddress();
  if (!vault) return [];
  const { data, error } = await supabase
    .from("agent_logs")
    .select("id,action,details,created_at,portfolio_id")
    .eq("portfolio_id", vault)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as LiveAgentLog[];
}

export async function fetchDecisions(limit = 50): Promise<LiveDecisionRow[]> {
  const vault = requireVaultAddress();
  if (!vault) return [];
  const { data, error } = await supabase
    .from("decisions")
    .select("id,decision_type,direction,amount_pct,confidence,tx_hash,status,executed_at,asset_address,portfolio_id")
    .eq("portfolio_id", vault)
    .order("executed_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as LiveDecisionRow[];
}

export async function fetchTelegramChannelForVault() {
  const vault = requireVaultAddress();
  if (!vault) return null;
  const { data, error } = await supabase
    .from("notification_channels")
    .select("id,channel_target,enabled")
    .eq("portfolio_id", vault)
    .eq("channel_type", "telegram")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertTelegramChannelForVault(chatId: string, userId?: string) {
  const vault = requireVaultAddress();
  if (!vault) throw new Error("VITE_PUBLIC_VAULT_ADDRESS missing");
  const payload = {
    portfolio_id: vault,
    user_id: userId ?? null,
    channel_type: "telegram",
    channel_target: chatId,
    enabled: true,
    metadata: { source: "dashboard-settings" },
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabase
    .from("notification_channels")
    .upsert(payload, { onConflict: "portfolio_id,channel_type,channel_target" });
  if (error) throw error;
}

