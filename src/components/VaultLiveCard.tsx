import { useAccount, useReadContract, useReadContracts } from "wagmi";
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
  const tokenList = tokens as readonly `0x${string}`[];
  const rows = tokenList.map((t, i) => ({
    token: t,
    pct: Number(pctBps[i] ?? 0n) / 100,
  }));

  const { data: metadata } = useReadContracts({
    contracts: tokenList.flatMap((token) => [
      {
        address: token,
        abi: [
          {
            type: "function",
            name: "symbol",
            stateMutability: "view",
            inputs: [],
            outputs: [{ name: "", type: "string" }],
          },
        ] as const,
        functionName: "symbol",
        chainId: hashKeyTestnet.id,
      },
      {
        address: token,
        abi: [
          {
            type: "function",
            name: "name",
            stateMutability: "view",
            inputs: [],
            outputs: [{ name: "", type: "string" }],
          },
        ] as const,
        functionName: "name",
        chainId: hashKeyTestnet.id,
      },
    ]),
    query: {
      enabled: tokenList.length > 0,
    },
  });

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
              <span className="text-muted-foreground">
                {(() => {
                  const idx = tokenList.indexOf(r.token);
                  const symbol = metadata?.[idx * 2]?.result as string | undefined;
                  const name = metadata?.[idx * 2 + 1]?.result as string | undefined;
                  if (symbol || name) {
                    return `${symbol ?? "TOKEN"}${name ? ` (${name})` : ""}`;
                  }
                  return `${r.token.slice(0, 10)}…`;
                })()}
              </span>
              <span className="font-medium">{r.pct.toFixed(2)}%</span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
