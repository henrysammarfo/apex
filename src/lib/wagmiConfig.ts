import { createConfig, http } from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";
import { hashKeyTestnet } from "./hashkeyChain";

const rpc =
  typeof import.meta.env.VITE_PUBLIC_RPC_URL === "string" && import.meta.env.VITE_PUBLIC_RPC_URL.trim()
    ? import.meta.env.VITE_PUBLIC_RPC_URL.trim()
    : "https://testnet.hsk.xyz";

const connectors = [injected({ shimDisconnect: true })];

const wcId =
  typeof import.meta.env.VITE_WALLETCONNECT_PROJECT_ID === "string"
    ? import.meta.env.VITE_WALLETCONNECT_PROJECT_ID.trim()
    : "";
if (wcId) {
  connectors.push(
    walletConnect({
      projectId: wcId,
    })
  );
}

export const wagmiConfig = createConfig({
  chains: [hashKeyTestnet],
  connectors,
  transports: {
    [hashKeyTestnet.id]: http(rpc),
  },
  ssr: false,
});
