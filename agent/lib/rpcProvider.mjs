import { ethers } from "ethers";
import { logger } from "./logger.mjs";

/**
 * Build RPC candidate list from env.
 * Supports:
 * - HASHKEY_TESTNET_RPCS="url1,url2,url3"
 * - HASHKEY_TESTNET_RPC (single)
 */
export function rpcCandidates(singleRpc) {
  const raw = process.env.HASHKEY_TESTNET_RPCS || "";
  const list = raw
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
  if (singleRpc && !list.includes(singleRpc)) list.unshift(singleRpc);
  return list.length ? list : ["https://testnet.hsk.xyz"];
}

async function probeRpcUrl(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: "POST",
      signal: controller.signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_chainId",
        params: [],
        id: 1,
      }),
    });
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    const j = await res.json().catch(() => ({}));
    if (!j?.result) return { ok: false, error: "No chainId result" };
    return { ok: true, chainId: j.result };
  } catch (e) {
    return { ok: false, error: e?.message || String(e) };
  } finally {
    clearTimeout(t);
  }
}

export async function selectHealthyRpcUrl(singleRpc) {
  const urls = rpcCandidates(singleRpc);
  let lastErr = null;
  for (const url of urls) {
    const r = await probeRpcUrl(url);
    if (r.ok) {
      logger.info("rpc.connected", { url, chainId: r.chainId });
      return url;
    }
    lastErr = new Error(r.error);
    logger.warn("rpc.unhealthy", { url, message: r.error });
  }
  throw new Error(`No healthy RPC endpoint. Last error: ${lastErr?.message || "unknown"}`);
}

/** Try endpoints in order and return first healthy provider (single static provider, no noisy retries). */
export async function createHealthyProvider(singleRpc) {
  const url = await selectHealthyRpcUrl(singleRpc);
  const provider = new ethers.JsonRpcProvider(url, { chainId: 133, name: "hashkey-testnet" }, { staticNetwork: true });
  return provider;
}

