/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PUBLIC_RPC_URL?: string;
  /** Deployed PortfolioVault address (0x…) for live dashboard reads */
  readonly VITE_PUBLIC_VAULT_ADDRESS?: string;
  /** Optional — https://cloud.walletconnect.com */
  readonly VITE_WALLETCONNECT_PROJECT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
