import { logger } from "../lib/logger.mjs";

/**
 * @param {string | undefined} token
 * @param {string | undefined} chatId
 */
export function createTelegramNotifier(token, chatId) {
  if (!token || !chatId) {
    return {
      enabled: false,
      async send() {
        /* no-op */
      },
      async sendTo() {
        /* no-op */
      },
    };
  }

  const base = `https://api.telegram.org/bot${token}/sendMessage`;
  async function post(chatTarget, text, opts = {}) {
    try {
      const res = await fetch(base, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatTarget,
          text: text.slice(0, 4000),
          parse_mode: opts.parseMode || "HTML",
          disable_web_page_preview: true,
        }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        logger.warn("telegram send failed", { status: res.status, body: j, chatTarget });
      }
    } catch (e) {
      logger.warn("telegram network error", { message: e.message, chatTarget });
    }
  }

  return {
    enabled: true,
    /**
     * @param {string} text
     * @param {object} [opts]
     */
    async send(text, opts = {}) {
      await post(chatId, text, opts);
    },
    async sendTo(chatTarget, text, opts = {}) {
      await post(chatTarget, text, opts);
    },
  };
}
