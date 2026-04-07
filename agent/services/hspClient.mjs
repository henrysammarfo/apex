import { logger } from "../lib/logger.mjs";

/**
 * HashKey Settlement Protocol — HTTP client. Paths and payloads must match merchant PDF
 * (hashfans.io/assets/merchant-docs-all-in-one.pdf). This layer handles auth, timeouts, and errors only.
 */
export class HSPClient {
  /**
   * @param {{ baseUrl: string, apiKey: string, merchantId: string, createPath: string, timeoutMs?: number }} cfg
   */
  constructor(cfg) {
    this.baseUrl = cfg.baseUrl.replace(/\/$/, "");
    this.apiKey = cfg.apiKey;
    this.merchantId = cfg.merchantId;
    this.createPath = cfg.createPath.startsWith("/") ? cfg.createPath : `/${cfg.createPath}`;
    this.timeoutMs = cfg.timeoutMs ?? 30_000;
  }

  /**
   * @param {Record<string, unknown>} body Merchant-specific JSON (amount, currency, beneficiary, etc.)
   * @returns {Promise<{ ok: boolean, referenceId?: string, raw?: unknown, error?: string }>}
   */
  async createPaymentRequest(body) {
    const url = `${this.baseUrl}${this.createPath}`;
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const res = await fetch(url, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
          "X-Merchant-Id": this.merchantId,
        },
        body: JSON.stringify({ merchantId: this.merchantId, ...body }),
      });
      const raw = await res.json().catch(() => ({}));
      if (!res.ok) {
        logger.warn("hsp.createPaymentRequest http error", { status: res.status, raw });
        return { ok: false, error: `HTTP ${res.status}`, raw };
      }
      const referenceId =
        raw.referenceId ?? raw.reference_id ?? raw.id ?? raw.paymentId ?? raw.data?.referenceId;
      return { ok: true, referenceId: referenceId != null ? String(referenceId) : undefined, raw };
    } catch (e) {
      const message = e.name === "AbortError" ? "timeout" : e.message;
      logger.error("hsp.createPaymentRequest failed", { message });
      return { ok: false, error: message };
    } finally {
      clearTimeout(t);
    }
  }
}
