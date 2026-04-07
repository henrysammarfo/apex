/**
 * Manual execution — same on-chain path as pipeline (vault agent wallet required).
 *
 * Env: PRIVATE_KEY, HASHKEY_TESTNET_RPC, VAULT_CONTRACT, DECISION_LOG_CONTRACT
 *      EXEC_ASSET, EXEC_DIRECTION (increase|reduce), EXEC_AMOUNT (wei), EXEC_CONFIDENCE, EXEC_REASONING
 *      EXEC_DRY_RUN=1 — no broadcast
 *      PORTFOLIO_ID optional bytes32 hex; default keccak256(vault)
 */
import "dotenv/config";
import { ethers } from "ethers";
import { loadAgentEnv, requireVault } from "./config/env.mjs";
import { executeRebalanceWithAudit } from "./core/executionCore.mjs";
import { logger } from "./lib/logger.mjs";

async function main() {
  const env = loadAgentEnv();
  const pk = env.PRIVATE_KEY;
  const vaultAddr = requireVault(env.VAULT_CONTRACT);
  const logAddr = env.DECISION_LOG_CONTRACT;
  const asset = process.env.EXEC_ASSET;
  const dir = (process.env.EXEC_DIRECTION || "").toLowerCase();
  const amount = process.env.EXEC_AMOUNT;
  const confidence = Number(process.env.EXEC_CONFIDENCE ?? "80");
  const reasoning = process.env.EXEC_REASONING || "execution-agent-manual";

  if (!pk || !logAddr || !asset || !amount || (dir !== "increase" && dir !== "reduce")) {
    logger.error("execution.missing_env");
    console.error(
      "Required: PRIVATE_KEY, VAULT_CONTRACT, DECISION_LOG_CONTRACT, EXEC_ASSET, EXEC_DIRECTION=increase|reduce, EXEC_AMOUNT"
    );
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(env.HASHKEY_TESTNET_RPC);
  const wallet = new ethers.Wallet(pk, provider);
  const vault = new ethers.Contract(vaultAddr, ["function agent() view returns (address)"], provider);
  const agentOnChain = await vault.agent();
  if (agentOnChain.toLowerCase() !== wallet.address.toLowerCase()) {
    throw new Error(`Wallet ${wallet.address} is not vault agent ${agentOnChain}`);
  }

  const token = ethers.getAddress(asset);
  const isIncrease = dir === "increase";
  const amountWei = BigInt(amount);
  const portfolioId =
    process.env.PORTFOLIO_ID && process.env.PORTFOLIO_ID.startsWith("0x")
      ? process.env.PORTFOLIO_ID
      : ethers.keccak256(ethers.toUtf8Bytes(vaultAddr));

  logger.info("execution.prepare", { from: wallet.address, token, isIncrease, amountWei: amountWei.toString() });

  if (process.env.EXEC_DRY_RUN === "1") {
    logger.info("execution.dry_run");
    return;
  }

  const result = await executeRebalanceWithAudit({
    wallet,
    vaultAddress: vaultAddr,
    decisionLogAddress: logAddr,
    portfolioId,
    token,
    isIncrease,
    amountWei,
    confidence,
    reasoning,
  });
  logger.info("execution.done", result);
  console.log(JSON.stringify(result, null, 2));
}

main().catch((e) => {
  logger.error("execution.fatal", { message: e.message });
  process.exit(1);
});
