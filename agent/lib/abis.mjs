/** Minimal ABIs for off-chain agents (no Hardhat artifacts required). */

export const VAULT_ABI = [
  "function assetsLength() view returns (uint256)",
  "function assetAt(uint256 index) view returns (address)",
  "function assetConfigs(address token) view returns (uint256 targetPctBps, uint256 driftThresholdBps, bool active)",
  "function getCurrentAllocations() view returns (address[] tokens, uint256[] pctBps)",
  "function executeRebalance(address token, bool isIncrease, uint256 amount)",
];

export const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

export const AGGREGATOR_V3_ABI = [
  "function latestRoundData() view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)",
  "function decimals() view returns (uint8)",
];

export const DECISION_LOG_ABI = [
  "function logDecision(bytes32 portfolioId, address asset, string decisionType, bool isIncrease, uint256 amount, uint8 confidence, bytes32 reasoningHash)",
];
