import { ArrowRight, Droplets } from 'lucide-react';
import { Link } from 'react-router-dom';

const Faucet = () => {
  const faucetUrl =
    (import.meta.env.VITE_PUBLIC_USDC_FAUCET_URL as string | undefined)?.trim() || '#';
  const tokenAddress =
    (import.meta.env.VITE_PUBLIC_USDC_TOKEN_ADDRESS as string | undefined)?.trim() ||
    '0x1d82f5Da580b43b708617A8947Eeab0D38152077';
  const faucetAddress =
    (import.meta.env.VITE_PUBLIC_USDC_FAUCET_ADDRESS as string | undefined)?.trim() ||
    '0x355880a1b0848eB0e7064A22F365a68E30AdC7D7';

  return (
    <div className="min-h-screen bg-background text-foreground px-6 md:px-10 py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Faucet</p>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-2">APEX Testnet USDC Claim</h1>
          <p className="text-sm text-muted-foreground mt-3">
            APEX uses a testnet USDC-first flow for deposits and demos. Claim testnet USDC and keep a small HSK
            balance for gas.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card/50 p-5 space-y-3">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Droplets className="w-5 h-5 text-primary" />
            Claim Tokens
          </h2>
          <ol className="list-decimal list-inside space-y-1.5 text-sm text-muted-foreground">
            <li>Connect the same wallet you will use in APEX dashboard.</li>
            <li>Claim testnet USDC from faucet.</li>
            <li>Confirm you also have HSK for gas transactions.</li>
          </ol>
          <a
            href={faucetUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Open USDC Faucet
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="rounded-xl border border-border bg-card/50 p-5 text-sm text-muted-foreground">
          <p>
            End-users only need testnet USDC + HSK gas. APEX mock RWA tokens are used inside vault operations for live
            autonomous portfolio behavior.
          </p>
          <div className="mt-3 space-y-1">
            <p className="font-mono text-xs break-all">USDC Token: {tokenAddress}</p>
            <p className="font-mono text-xs break-all">USDC Faucet: {faucetAddress}</p>
          </div>
        </div>

        <Link to="/" className="text-sm text-primary hover:underline">
          Back to landing page
        </Link>
      </div>
    </div>
  );
};

export default Faucet;
