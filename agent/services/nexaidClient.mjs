/**
 * NexaID — URL builders and verification helpers. Full flow uses the Chrome extension + GitBook API;
 * keep server-side checks aligned with https://nexaid.gitbook.io/nexaid/
 */

/**
 * @param {{ verifyBaseUrl?: string, templateId?: string, walletAddress: string, redirectUri?: string }} p
 */
export function buildNexaIdVerificationUrl(p) {
  if (!p.templateId) return null;
  const base = (p.verifyBaseUrl || "https://verify.nexaid.io").replace(/\/$/, "");
  const u = new URL(`${base}/start`);
  u.searchParams.set("templateId", p.templateId);
  u.searchParams.set("wallet", p.walletAddress);
  if (p.redirectUri) u.searchParams.set("redirect_uri", p.redirectUri);
  return u.toString();
}

/**
 * @param {string | undefined} attestationHex 0x-prefixed bytes from NexaID callback (when integrated)
 * @returns {boolean}
 */
export function isValidAttestationHex(attestationHex) {
  if (!attestationHex || !attestationHex.startsWith("0x") || attestationHex.length < 10) return false;
  return /^0x[0-9a-fA-F]+$/.test(attestationHex);
}
