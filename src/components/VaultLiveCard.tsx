import { useAccount, useReadContract } from "wagmi";
import { hashKeyTestnet } from "@/lib/hashkeyChain";
import { portfolioVaultReadAbi } from "@/lib/vaultAbi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Link2 } from "lucide-react";

function vaultAddress(): `0x${string}` | undefined {
  const v = import.meta.env.VITE_PUBLIC_VAULT_ADDRESS;
  if (typeof v === "string" && /^0x[a-fA-F0-9]{40}$/.test(v.trim())) {
    return v.trim() as `0x${string}`;
  }
  return undefined;
}

export function VaultLiveCard() {
  const vault = vaultAddress();
  const { isConnected } = useAccount();

  const { data, isPending, isError, error } = useReadContract({
    address: vault,
    abi: portfolioVaultReadAbi,
    functionName: "getCurrentAllocations",
    chainId: hashKeyTestnet.id,
    query: {
      enabled: Boolean(vault) && isConnected,
    },
  });

  if (!vault) {
    return (
      <Card className="border-dashed border-border/60 bg-secondary/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Link2 className="w-4 h-4" />
            On-chain vault
          </CardTitle>
          <CardDescription>
            Set <code className="text-[11px]">VITE_PUBLIC_VAULT_ADDRESS</code> in{" "}
            <code className="text-[11px]">.env</code> after deploy to load live allocations.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!isConnected) {
    return (
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">On-chain vault</CardTitle>
          <CardDescription>Connect a wallet on HashKey testnet (133) to read your vault.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isPending) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Vault allocations</CardTitle>
          <CardDescription>Loading from chain…</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="border-destructive/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2 text-destructive">
            <AlertCircle className="w-4 h-4" />
            Vault read failed
          </CardTitle>
          <CardDescription className="font-mono text-[11px] break-all">{error?.message}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const [tokens, pctBps] = data ?? [[], []];
  const rows = (tokens as readonly `0x${string}`[]).map((t, i) => ({
    token: t,
    pct: Number(pctBps[i] ?? 0n) / 100,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Live vault weights</CardTitle>
        <CardDescription className="font-mono text-[11px] break-all">{vault}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {rows.length === 0 ? (
          <p className="text-xs text-muted-foreground">No assets configured in this vault.</p>
        ) : (
          rows.map((r) => (
            <div key={r.token} className="flex justify-between text-xs font-inter">
              <span className="font-mono text-muted-foreground">{r.token.slice(0, 10)}…</span>
              <span className="font-medium">{r.pct.toFixed(2)}%</span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
