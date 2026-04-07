/** Read-only ABI for dashboard live vault state */
export const portfolioVaultReadAbi = [
  {
    type: "function",
    name: "getCurrentAllocations",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "tokens", type: "address[]" },
      { name: "pctBps", type: "uint256[]" },
    ],
  },
  {
    type: "function",
    name: "assetsLength",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;
