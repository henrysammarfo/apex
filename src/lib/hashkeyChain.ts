import { defineChain } from "viem";

/** HashKey Chain testnet — https://docs.hsk.xyz/docs/Build-on-HashKey-Chain/network-info */
export const hashKeyTestnet = defineChain({
  id: 133,
  name: "HashKey Chain Testnet",
  nativeCurrency: {
    name: "HSK",
    symbol: "HSK",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://testnet.hsk.xyz"] },
  },
  blockExplorers: {
    default: {
      name: "HashKey Blockscout",
      url: "https://hashkey.blockscout.com",
    },
  },
});
