/**
 * On-chain portfolio snapshot: vault assets, targets, drift vs balance- or oracle-weighted weights.
 */
import { ethers } from "ethers";
import { VAULT_ABI, ERC20_ABI, AGGREGATOR_V3_ABI } from "../lib/abis.mjs";

export function absDiffBps(a, b) {
  return a > b ? a - b : b - a;
}

export function parseFeedMap(raw) {
  if (!raw || !String(raw).trim()) return new Map();
  const obj = JSON.parse(raw);
  const m = new Map();
  for (const [k, v] of Object.entries(obj)) {
    m.set(ethers.getAddress(k), ethers.getAddress(v));
  }
  return m;
}

export async function readOraclePrice(provider, feedAddress) {
  const feed = new ethers.Contract(feedAddress, AGGREGATOR_V3_ABI, provider);
  const [, answer,, updatedAt] = await feed.latestRoundData();
  if (answer <= 0n) return null;
  let dec = 8;
  try {
    dec = Number(await feed.decimals());
  } catch {
    /* proxy may omit decimals */
  }
  return { price: BigInt(answer), decimals: dec, updatedAt: Number(updatedAt) };
}

/**
 * @param {import('ethers').JsonRpcProvider} provider
 * @param {string} vaultAddr checksummed vault
 * @param {Map<string,string>} feedMap token -> feed
 * @param {boolean} useOracle
 */
export async function buildPortfolioSnapshot(provider, vaultAddr, feedMap, useOracle) {
  const vault = new ethers.Contract(vaultAddr, VAULT_ABI, provider);
  const n = Number(await vault.assetsLength());
  const rows = [];
  let sumVal = 0n;

  for (let i = 0; i < n; i++) {
    const token = ethers.getAddress(await vault.assetAt(i));
    const cfg = await vault.assetConfigs(token);
    const erc20 = new ethers.Contract(token, ERC20_ABI, provider);
    const bal = await erc20.balanceOf(vaultAddr);
    let sym = token.slice(0, 10);
    try {
      sym = await erc20.symbol();
    } catch {
      /* non-standard token */
    }

    let weight = bal;
    let priceInfo = null;
    if (useOracle && feedMap.has(token)) {
      priceInfo = await readOraclePrice(provider, feedMap.get(token));
      if (priceInfo) {
        weight = bal * priceInfo.price;
      }
    }

    sumVal += weight;
    rows.push({
      token,
      symbol: sym,
      balance: bal.toString(),
      targetPctBps: Number(cfg.targetPctBps),
      driftThresholdBps: Number(cfg.driftThresholdBps),
      active: cfg.active,
      weight: weight.toString(),
      feed: feedMap.get(token) || null,
      priceUpdatedAt: priceInfo?.updatedAt ?? null,
    });
  }

  const pctBps = [];
  if (sumVal === 0n) {
    for (let i = 0; i < rows.length; i++) pctBps.push(0);
  } else {
    for (const r of rows) {
      const w = BigInt(r.weight);
      pctBps.push(Number((w * 10_000n) / sumVal));
    }
  }

  const drifts = [];
  let rebalanceNeeded = false;
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    if (!r.active) continue;
    const cur = pctBps[i];
    const drift = absDiffBps(cur, r.targetPctBps);
    const hit = drift > r.driftThresholdBps;
    if (hit) rebalanceNeeded = true;
    drifts.push({
      token: r.token,
      symbol: r.symbol,
      currentPctBps: cur,
      targetPctBps: r.targetPctBps,
      driftBps: drift,
      thresholdBps: r.driftThresholdBps,
      rebalanceCandidate: hit,
    });
  }

  const [onChainTokens, onChainPct] = await vault.getCurrentAllocations();
  return {
    vault: vaultAddr,
    timestamp: new Date().toISOString(),
    mode: useOracle ? "oracle_value_weighted" : "balance_only",
    assets: rows,
    valuePctBps: pctBps,
    drifts,
    rebalanceNeeded,
    onChain: {
      tokens: onChainTokens,
      pctBps: onChainPct.map((p) => Number(p)),
    },
  };
}
