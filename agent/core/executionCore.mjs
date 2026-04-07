import { ethers } from "ethers";
import { VAULT_ABI, DECISION_LOG_ABI } from "../lib/abis.mjs";

/**
 * @param {import('ethers').Wallet} wallet Must be vault `agent`
 * @param {object} p
 */
export async function executeRebalanceWithAudit({ wallet, vaultAddress, decisionLogAddress, portfolioId, token, isIncrease, amountWei, confidence, reasoning }) {
  const vault = new ethers.Contract(vaultAddress, VAULT_ABI, wallet);
  const decisionLog = new ethers.Contract(decisionLogAddress, DECISION_LOG_ABI, wallet);
  const reasoningHash = ethers.keccak256(ethers.toUtf8Bytes(reasoning));
  const conf = Math.min(100, Math.max(0, Math.floor(confidence)));

  const tx1 = await vault.executeRebalance(token, isIncrease, amountWei);
  const r1 = await tx1.wait();
  const tx2 = await decisionLog.logDecision(portfolioId, token, "rebalance", isIncrease, amountWei, conf, reasoningHash);
  const r2 = await tx2.wait();

  return {
    rebalanceTxHash: tx1.hash,
    logTxHash: tx2.hash,
    rebalanceBlock: r1?.blockNumber,
    logBlock: r2?.blockNumber,
  };
}
