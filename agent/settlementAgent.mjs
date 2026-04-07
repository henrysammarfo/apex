/**
 * Settlement Agent — creates HSP payment requests (sandbox) for compliant disbursement.
 * Body shape must follow HashKey merchant documentation (hashfans PDF).
 *
 * Env: HSP_BASE_URL, HSP_API_KEY, HSP_MERCHANT_ID, HSP_CREATE_PAYMENT_PATH
 *      HSP_PAYMENT_BODY_JSON — JSON string POST body (minus merchantId, added by client)
 *
 * Usage: node agent/settlementAgent.mjs
 */
import "dotenv/config";
import { loadAgentEnv } from "./config/env.mjs";
import { HSPClient } from "./services/hspClient.mjs";
import { logger } from "./lib/logger.mjs";

async function main() {
  const env = loadAgentEnv();
  if (!env.HSP_BASE_URL || !env.HSP_API_KEY || !env.HSP_MERCHANT_ID) {
    logger.error("settlement.missing_hsp_env");
    process.exit(1);
  }
  const raw = process.env.HSP_PAYMENT_BODY_JSON || "{}";
  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    logger.error("settlement.invalid_HSP_PAYMENT_BODY_JSON");
    process.exit(1);
  }

  const client = new HSPClient({
    baseUrl: env.HSP_BASE_URL,
    apiKey: env.HSP_API_KEY,
    merchantId: env.HSP_MERCHANT_ID,
    createPath: env.HSP_CREATE_PAYMENT_PATH,
  });

  const res = await client.createPaymentRequest(body);
  if (!res.ok) {
    logger.error("settlement.hsp_failed", { error: res.error, raw: res.raw });
    process.exit(1);
  }
  logger.info("settlement.hsp_ok", { referenceId: res.referenceId, raw: res.raw });
  console.log(JSON.stringify({ ok: true, referenceId: res.referenceId }, null, 2));
}

const isMain = process.argv[1]?.replace(/\\/g, "/").includes("settlementAgent");
if (isMain) {
  main().catch((e) => {
    logger.error("settlement.fatal", { message: e.message });
    process.exit(1);
  });
}
