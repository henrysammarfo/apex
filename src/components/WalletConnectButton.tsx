import { useAccount, useConnect, useDisconnect, useChainId } from "wagmi";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Wallet } from "lucide-react";
import { hashKeyTestnet } from "@/lib/hashkeyChain";

function shortAddr(a: string) {
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

export function WalletConnectButton() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const wrongChain = isConnected && chainId !== hashKeyTestnet.id;

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="font-mono text-[11px] gap-2 h-9">
            <Wallet className="w-3.5 h-3.5" />
            {shortAddr(address)}
            {wrongChain && <span className="text-destructive text-[10px]">wrong network</span>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {wrongChain && (
            <DropdownMenuItem disabled className="text-destructive text-xs">
              Switch to HashKey Testnet (133) in your wallet
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => disconnect()}>Disconnect</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  const injected = connectors.find((c) => c.id === "injected" || c.type === "injected") ?? connectors[0];

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-9 text-xs"
      disabled={isPending || !injected}
      onClick={() => injected && connect({ connector: injected, chainId: hashKeyTestnet.id })}
    >
      {isPending ? "Connecting…" : "Connect wallet"}
    </Button>
  );
}
