/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PUBLIC_RPC_URL?: string;
  /** Deployed PortfolioVault address (0x…) for live dashboard reads */
  readonly VITE_PUBLIC_VAULT_ADDRESS?: string;
  /** Optional — https://cloud.walletconnect.com */
  readonly VITE_WALLETCONNECT_PROJECT_ID?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_PUBLIC_USDC_FAUCET_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
