/**
 * Validated environment for APEX agents. Fails fast on invalid URLs / addresses when provided.
 */
import { z } from "zod";
import { ethers } from "ethers";

const optionalAddr = z
  .string()
  .optional()
  .transform((s) => (s && s.trim() ? ethers.getAddress(s.trim()) : undefined));

export const AgentEnvSchema = z.object({
  HASHKEY_TESTNET_RPC: z.string().url().default("https://testnet.hsk.xyz"),
  VAULT_CONTRACT: optionalAddr,
  DECISION_LOG_CONTRACT: optionalAddr,
  PRIVATE_KEY: z
    .string()
    .optional()
    .transform((s) => (s && s.trim() ? s.trim() : undefined)),

  MONITOR_INTERVAL_SEC: z.coerce.number().int().min(10).max(3600).default(60),
  USE_ORACLE_PRICING: z.preprocess(
    (v) => (v === undefined || v === "" ? "0" : String(v)),
    z.enum(["0", "1", "true", "false"]).transform((v) => v === "1" || v === "true")
  ),
  TOKEN_PRICE_FEEDS_JSON: z.string().optional().default(""),

  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default("gpt-4o-mini"),

  SUPABASE_URL: z
    .string()
    .optional()
    .transform((s) => (s && s.trim() ? s.trim() : undefined))
    .refine((s) => s === undefined || /^https:\/\//.test(s), "SUPABASE_URL must be https"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  TELEGRAM_BOT_TOKEN: z.string().optional(),
  TELEGRAM_CHAT_ID: z.string().optional(),

  HSP_BASE_URL: z
    .string()
    .optional()
    .transform((s) => (s && s.trim() ? s.trim().replace(/\/$/, "") : undefined))
    .refine((s) => s === undefined || /^https:\/\//.test(s), "HSP_BASE_URL must be https"),
  HSP_API_KEY: z.string().optional(),
  HSP_MERCHANT_ID: z.string().optional(),
  /** Relative path e.g. /api/v1/payments — set from HashKey merchant PDF */
  HSP_CREATE_PAYMENT_PATH: z.string().optional().default("/api/payments"),

  NEXAID_TEMPLATE_ID: z.string().optional(),
  NEXAID_VERIFY_BASE_URL: z.string().url().optional().or(z.literal("").transform(() => undefined)),

  PIPELINE_AUTO_EXECUTE: z.preprocess(
    (v) => (v === undefined || v === "" ? "0" : String(v)),
    z.enum(["0", "1", "true", "false"]).transform((v) => v === "1" || v === "true")
  ),
  MIN_DECISION_CONFIDENCE: z.coerce.number().min(0).max(100).default(72),
  MIN_SECONDS_BETWEEN_EXECUTIONS: z.coerce.number().int().min(60).max(86400).default(600),
  MAX_REBALANCE_PCT_OF_BALANCE: z.coerce.number().min(1).max(100).default(25),

  LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),
});

/** @returns {z.infer<typeof AgentEnvSchema>} */
export function loadAgentEnv() {
  const r = AgentEnvSchema.safeParse(process.env);
  if (!r.success) {
    const msg = r.error.flatten().fieldErrors;
    throw new Error(`Invalid agent environment: ${JSON.stringify(msg)}`);
  }
  const data = r.data;
  if (data.USE_ORACLE_PRICING && !data.TOKEN_PRICE_FEEDS_JSON?.trim()) {
    throw new Error("USE_ORACLE_PRICING requires TOKEN_PRICE_FEEDS_JSON");
  }
  return data;
}

/** @param {string} vault */
export function requireVault(vault) {
  if (!vault) throw new Error("VAULT_CONTRACT is required");
  return ethers.getAddress(vault);
}
