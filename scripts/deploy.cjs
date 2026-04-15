/**
 * Deploy modes:
 * - Full stack (default): MockRWA x3 + faucets + vault + registry + rails
 * - USDC only: one fixed-supply mock USDC + 24h faucet
 *
 * Usage:
 *   npx hardhat run scripts/deploy.cjs --network hashkeyTestnet
 *   (PowerShell) $env:DEPLOY_MODE="usdc_only"; npx hardhat run scripts/deploy.cjs --network hashkeyTestnet
 *
 * Env:
 *   PRIVATE_KEY
 *   optional APEX_AGENT_ADDRESS (defaults to deployer)
 *   optional SEED_VAULT=1
 *   optional DEPLOY_MODE=usdc_only
 */
const hre = require("hardhat");

const WAD = 10n ** 18n;
const MAX_SUPPLY = 10_000_000n * WAD;
const FAUCET_RESERVE = 1_000_000n * WAD;
const CLAIM_PER_24H = 100n * WAD;
const SEED_EACH = 1000n * WAD;

async function deployTokenAndFaucet(deployer, symbolName, symbol) {
  const MockRWA = await hre.ethers.getContractFactory("MockRWA");
  const token = await MockRWA.deploy(symbolName, symbol, MAX_SUPPLY, deployer.address);
  await token.waitForDeployment();
  const tokenAddr = await token.getAddress();

  const Faucet = await hre.ethers.getContractFactory("DemoFaucet24h");
  const faucet = await Faucet.deploy(tokenAddr, CLAIM_PER_24H, deployer.address);
  await faucet.waitForDeployment();
  const faucetAddr = await faucet.getAddress();

  await (await token.transfer(faucetAddr, FAUCET_RESERVE)).wait();

  return { token, tokenAddr, faucet, faucetAddr };
}

async function deployUsdcOnly(deployer) {
  const usdcName = process.env.USDC_NAME || "Mock Testnet USDC";
  const usdcSymbol = process.env.USDC_SYMBOL || "mUSDC";
  const usdc = await deployTokenAndFaucet(deployer, usdcName, usdcSymbol);

  console.log("Mock USDC:", usdc.tokenAddr);
  console.log("Faucet24h USDC:", usdc.faucetAddr);
  console.log(`USDC fixed supply: ${MAX_SUPPLY / WAD} (whole tokens); faucet pool: ${FAUCET_RESERVE / WAD}; claim / 24h: ${CLAIM_PER_24H / WAD}.`);
  console.log("\nAdd to .env / .env.local:");
  console.log(`MOCK_USDC=${usdc.tokenAddr}`);
  console.log(`FAUCET_USDC=${usdc.faucetAddr}`);
  return;
}

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const owner = deployer.address;
  const agentAddr = process.env.APEX_AGENT_ADDRESS || owner;
  const seed = process.env.SEED_VAULT !== "0";
  const mode = (process.env.DEPLOY_MODE || "full").toLowerCase();

  console.log("Deployer:", owner);
  console.log("Agent:", agentAddr);
  console.log("Deploy mode:", mode);

  if (mode === "usdc_only") {
    await deployUsdcOnly(deployer);
    return;
  }

  const silver = await deployTokenAndFaucet(deployer, "Mock Silver RWA", "mSILV");
  const mmf = await deployTokenAndFaucet(deployer, "Mock MMF RWA", "mMMF");
  const sec = await deployTokenAndFaucet(deployer, "Mock Securities RWA", "mSEC");

  console.log("MockRWA Silver:", silver.tokenAddr);
  console.log("Faucet24h Silver:", silver.faucetAddr);
  console.log("MockRWA MMF:", mmf.tokenAddr);
  console.log("Faucet24h MMF:", mmf.faucetAddr);
  console.log("MockRWA Securities:", sec.tokenAddr);
  console.log("Faucet24h Securities:", sec.faucetAddr);

  const PortfolioVault = await hre.ethers.getContractFactory("PortfolioVault");
  const vault = await PortfolioVault.deploy(owner, agentAddr);
  await vault.waitForDeployment();
  const vaultAddr = await vault.getAddress();
  console.log("PortfolioVault:", vaultAddr);

  const DecisionLog = await hre.ethers.getContractFactory("DecisionLog");
  const decisionLog = await DecisionLog.deploy(owner, agentAddr);
  await decisionLog.waitForDeployment();
  const decisionLogAddr = await decisionLog.getAddress();
  console.log("DecisionLog:", decisionLogAddr);

  const AgentRegistry = await hre.ethers.getContractFactory("AgentRegistry");
  const registry = await AgentRegistry.deploy(owner);
  await registry.waitForDeployment();
  const registryAddr = await registry.getAddress();
  console.log("AgentRegistry:", registryAddr);

  const ApexIdentityRegistry = await hre.ethers.getContractFactory("ApexIdentityRegistry");
  const identity = await ApexIdentityRegistry.deploy(owner);
  await identity.waitForDeployment();
  const identityAddr = await identity.getAddress();
  console.log("ApexIdentityRegistry:", identityAddr);

  const ApexSettlementRouter = await hre.ethers.getContractFactory("ApexSettlementRouter");
  const settlement = await ApexSettlementRouter.deploy(owner);
  await settlement.waitForDeployment();
  const settlementAddr = await settlement.getAddress();
  console.log("ApexSettlementRouter:", settlementAddr);

  if (seed) {
    for (const t of [silver.token, mmf.token, sec.token]) {
      await (await t.approve(vaultAddr, SEED_EACH)).wait();
    }

    const cfgSilver = { targetPctBps: 3000, driftThresholdBps: 500, active: true };
    const cfgMmf = { targetPctBps: 5000, driftThresholdBps: 500, active: true };
    const cfgSec = { targetPctBps: 2000, driftThresholdBps: 500, active: true };

    await (await vault.addAsset(silver.tokenAddr, cfgSilver)).wait();
    await (await vault.addAsset(mmf.tokenAddr, cfgMmf)).wait();
    await (await vault.addAsset(sec.tokenAddr, cfgSec)).wait();

    await (await vault.deposit(silver.tokenAddr, SEED_EACH)).wait();
    await (await vault.deposit(mmf.tokenAddr, SEED_EACH)).wait();
    await (await vault.deposit(sec.tokenAddr, SEED_EACH)).wait();

    await (await registry.setAgentAuthorization(agentAddr, true)).wait();
    await (await identity.setVerifier(agentAddr, true)).wait();
    await (await settlement.setOperator(agentAddr, true)).wait();

    console.log("Seeded vault with 1000 units each; targets 30% / 50% / 20%.");
    console.log(`Each token fixed supply: ${MAX_SUPPLY / WAD} (whole tokens); faucet pool per token: ${FAUCET_RESERVE / WAD}; claim / 24h: ${CLAIM_PER_24H / WAD}.`);
  }

  console.log("\nAdd to .env for agents / frontend:");
  console.log(`VAULT_CONTRACT=${vaultAddr}`);
  console.log(`DECISION_LOG_CONTRACT=${decisionLogAddr}`);
  console.log(`AGENT_REGISTRY_CONTRACT=${registryAddr}`);
  console.log(`IDENTITY_REGISTRY_CONTRACT=${identityAddr}`);
  console.log(`SETTLEMENT_ROUTER_CONTRACT=${settlementAddr}`);
  console.log(`MOCK_SILVER=${silver.tokenAddr}`);
  console.log(`MOCK_MMF=${mmf.tokenAddr}`);
  console.log(`MOCK_SEC=${sec.tokenAddr}`);
  console.log(`FAUCET_SILVER=${silver.faucetAddr}`);
  console.log(`FAUCET_MMF=${mmf.faucetAddr}`);
  console.log(`FAUCET_SEC=${sec.faucetAddr}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
