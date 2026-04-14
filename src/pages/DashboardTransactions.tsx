import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, CheckCircle2, Clock, ExternalLink, X, Copy, ArrowRight, Download, Plus, Minus, RefreshCw, Banknote } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNowStrict } from 'date-fns';
import { fetchDecisions } from '@/lib/liveOps';

type TxType = 'Rebalance' | 'Yield' | 'Deposit' | 'Withdrawal';

interface Transaction {
  hash: string;
  fullHash: string;
  type: TxType;
  from: string;
  to: string;
  amount: string;
  gas: string;
  time: string;
  status: string;
  block: string;
  timestamp: string;
  network: string;
  confirmations: number;
  nonce: number;
  gasUsed: string;
  slippage: string;
  hspRef?: string;
}

const fallbackTransactions: Transaction[] = [
  { hash: '0xd4e1...7f92', fullHash: '0xd4e17f92a3b4c5d6e7f8012a3b4c5d6e7f8a7f92', type: 'Deposit', from: 'Wallet', to: 'APEX Vault', amount: '$50,000', gas: '0.08 Gwei', time: '3 min ago', status: 'confirmed', block: '#4,291,103', timestamp: '2026-04-06 14:38:22 UTC', network: 'HashKey L2', confirmations: 42, nonce: 49, gasUsed: '52,118', slippage: 'N/A' },
  { hash: '0x7a3f...c291', fullHash: '0x7a3fc29183b4e1d5a6f2890ce4d7b3a1f8e62c291', type: 'Rebalance', from: 'cBOND', to: 'tUSTB', amount: '$99,200', gas: '0.08 Gwei', time: '5 min ago', status: 'confirmed', block: '#4,291,037', timestamp: '2026-04-06 14:32:18 UTC', network: 'HashKey L2', confirmations: 128, nonce: 47, gasUsed: '42,318', slippage: '0.02%' },
  { hash: '0x4e7b...3a12', fullHash: '0x4e7b3a12f5d6e7c8b9a0123d4e5f6a7b8c9d3a12', type: 'Yield', from: 'Vault', to: '4 wallets', amount: '$1,847', gas: '0.12 Gwei', time: '12 min ago', status: 'confirmed', block: '#4,291,042', timestamp: '2026-04-06 14:25:06 UTC', network: 'HashKey L2', confirmations: 148, nonce: 48, gasUsed: '78,432', slippage: 'N/A', hspRef: 'HSP-2026-04-0892' },
  { hash: '0xa8c3...2e51', fullHash: '0xa8c32e51d7e8f9a0b1234c5d6e7f8a9b0c1d2e51', type: 'Withdrawal', from: 'APEX Vault', to: 'HSP Settlement', amount: '$3,470', gas: '0.10 Gwei', time: '1 hr ago', status: 'confirmed', block: '#4,290,980', timestamp: '2026-04-06 13:35:41 UTC', network: 'HashKey L2', confirmations: 290, nonce: 46, gasUsed: '68,102', slippage: 'N/A', hspRef: 'HSP-2026-04-0891' },
  { hash: '0x2b1e...a8f4', fullHash: '0x2b1ea8f4d7c3e5b6a9012f3d8c4e7b1a5f6d2a8f4', type: 'Rebalance', from: 'gGLD', to: 'rREF', amount: '$45,600', gas: '0.09 Gwei', time: '2 hr ago', status: 'confirmed', block: '#4,290,998', timestamp: '2026-04-06 12:45:03 UTC', network: 'HashKey L2', confirmations: 312, nonce: 45, gasUsed: '38,291', slippage: '0.01%' },
  { hash: '0x9c2d...f871', fullHash: '0x9c2df871e4a3b5c6d7f8012e3a4b5c6d7e8f9a871', type: 'Rebalance', from: 'USDC', to: 'tUSTB', amount: '$120,000', gas: '0.07 Gwei', time: '8 hr ago', status: 'confirmed', block: '#4,290,812', timestamp: '2026-04-06 06:12:44 UTC', network: 'HashKey L2', confirmations: 894, nonce: 44, gasUsed: '35,102', slippage: '0.03%' },
  { hash: '0x1f8c...d923', fullHash: '0x1f8cd923a4b5c6d7e8f90123a4b5c6d7e8f9d923', type: 'Yield', from: 'Vault', to: '4 wallets', amount: '$1,623', gas: '0.11 Gwei', time: '6 hr ago', status: 'confirmed', block: '#4,290,900', timestamp: '2026-04-06 08:45:22 UTC', network: 'HashKey L2', confirmations: 621, nonce: 43, gasUsed: '76,891', slippage: 'N/A', hspRef: 'HSP-2026-04-0890' },
  { hash: '0xb7f2...1c84', fullHash: '0xb7f21c84e5f6a7b8c9d0123e4f5a6b7c8d9e1c84', type: 'Deposit', from: 'Wallet', to: 'APEX Vault', amount: '$200,000', gas: '0.07 Gwei', time: '1 day ago', status: 'confirmed', block: '#4,290,100', timestamp: '2026-04-05 10:22:15 UTC', network: 'HashKey L2', confirmations: 2540, nonce: 42, gasUsed: '54,320', slippage: 'N/A' },
  { hash: '0x6a9d...b441', fullHash: '0x6a9db441c3d4e5f6a7b80912c3d4e5f6a7b8b441', type: 'Rebalance', from: 'rREF', to: 'cBOND', amount: '$67,300', gas: '0.08 Gwei', time: '1 day ago', status: 'confirmed', block: '#4,290,200', timestamp: '2026-04-05 09:30:12 UTC', network: 'HashKey L2', confirmations: 2104, nonce: 41, gasUsed: '41,203', slippage: '0.01%' },
  { hash: '0x5e3a...9d72', fullHash: '0x5e3a9d72f6a7b8c9d0e1234f5a6b7c8d9e0f9d72', type: 'Withdrawal', from: 'APEX Vault', to: 'Wallet', amount: '$10,000', gas: '0.09 Gwei', time: '2 days ago', status: 'confirmed', block: '#4,289,600', timestamp: '2026-04-04 16:10:33 UTC', network: 'HashKey L2', confirmations: 5120, nonce: 40, gasUsed: '45,891', slippage: 'N/A' },
  { hash: '0x3c5e...7f82', fullHash: '0x3c5e7f82d4e5f6a7b8c90123d4e5f6a7b8c97f82', type: 'Yield', from: 'Vault', to: '4 wallets', amount: '$1,512', gas: '0.10 Gwei', time: '2 days ago', status: 'confirmed', block: '#4,289,500', timestamp: '2026-04-04 08:00:45 UTC', network: 'HashKey L2', confirmations: 5291, nonce: 39, gasUsed: '74,512', slippage: 'N/A', hspRef: 'HSP-2026-04-0889' },
];

const typeConfig: Record<TxType, { icon: typeof Plus; color: string; bg: string }> = {
  Deposit: { icon: Plus, color: 'text-primary', bg: 'bg-primary/10' },
  Withdrawal: { icon: Minus, color: 'text-accent', bg: 'bg-accent/10' },
  Rebalance: { icon: RefreshCw, color: 'text-primary', bg: 'bg-primary/10' },
  Yield: { icon: Banknote, color: 'text-accent', bg: 'bg-accent/10' },
};

const [filterOptions] = [['All', 'Deposit', 'Withdrawal', 'Rebalance', 'Yield'] as const];

const Transactions = () => {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState<string>('All');
  const { data: liveDecisions } = useQuery({
    queryKey: ['live-decisions'],
    queryFn: () => fetchDecisions(100),
    refetchInterval: 15000,
  });

  const transactions: Transaction[] = (liveDecisions && liveDecisions.length > 0)
    ? liveDecisions.map((d) => {
      const hash = d.tx_hash || d.id;
      const shortHash = hash.startsWith('0x') && hash.length > 12 ? `${hash.slice(0, 6)}...${hash.slice(-4)}` : hash.slice(0, 10);
      const txType: TxType = d.decision_type === 'rebalance' ? 'Rebalance' : 'Yield';
      return {
        hash: shortHash,
        fullHash: hash,
        type: txType,
        from: d.direction === 'increase' ? 'Owner Wallet' : 'Vault',
        to: d.direction === 'increase' ? 'APEX Vault' : 'Owner Wallet',
        amount: d.amount_pct != null ? `${Number(d.amount_pct).toFixed(2)}%` : 'N/A',
        gas: 'Live',
        time: `${formatDistanceToNowStrict(new Date(d.executed_at))} ago`,
        status: d.status || 'confirmed',
        block: '-',
        timestamp: new Date(d.executed_at).toISOString(),
        network: 'HashKey L2',
        confirmations: 0,
        nonce: 0,
        gasUsed: '-',
        slippage: 'N/A',
      };
    })
    : fallbackTransactions;

  const filtered = filter === 'All' ? transactions : transactions.filter(t => t.type === filter);

  const totalDeposits = transactions.filter(t => t.type === 'Deposit').reduce((s, t) => s + Number(t.amount.replace(/[^0-9]/g, '')), 0);
  const totalWithdrawals = transactions.filter(t => t.type === 'Withdrawal').reduce((s, t) => s + Number(t.amount.replace(/[^0-9]/g, '')), 0);

  const exportCSV = () => {
    const headers = ['TX Hash', 'Type', 'From', 'To', 'Amount', 'Gas', 'Block', 'Timestamp', 'Status', 'Confirmations', 'Nonce', 'Gas Used', 'Slippage', 'HSP Ref'];
    const rows = filtered.map(tx => [tx.fullHash, tx.type, tx.from, tx.to, tx.amount, tx.gas, tx.block, tx.timestamp, tx.status, tx.confirmations, tx.nonce, tx.gasUsed, tx.slippage, tx.hspRef || '']);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `apex-transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader title="Transactions" />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-[1200px] mx-auto">
              {/* Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total TXs (7d)', value: String(transactions.length) },
                  { label: 'Total Deposits', value: `$${(totalDeposits / 1000).toFixed(0)}K` },
                  { label: 'Total Withdrawals', value: `$${(totalWithdrawals / 1000).toFixed(1)}K` },
                  { label: 'Avg Gas', value: '0.09 Gwei' },
                ].map((s, i) => (
                  <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="liquid-glass rounded-xl p-5">
                    <p className="font-inter text-[11px] text-muted-foreground uppercase tracking-widest mb-1">{s.label}</p>
                    <p className="font-inter font-extrabold text-foreground text-[24px]">{s.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Table */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="liquid-glass rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-inter font-bold text-foreground text-[15px]">Transaction History</h3>
                    <p className="font-inter text-[11px] text-muted-foreground mt-0.5">Click any transaction to view full details</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Filter pills */}
                    <div className="flex gap-1">
                      {filterOptions.map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={`font-inter text-[10px] px-2.5 py-1 rounded-full transition-colors ${
                          filter === f ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]'
                        }`}>{f}</button>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" onClick={exportCSV} className="font-inter text-[12px] gap-1.5">
                      <Download className="w-3.5 h-3.5" /> Export
                    </Button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        {['TX Hash', 'Type', 'Route', 'Amount', 'Gas', 'Block', 'Time', 'Status'].map(h => (
                          <th key={h} className="text-left px-4 py-3 font-inter text-[10px] text-muted-foreground uppercase tracking-widest whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((tx) => {
                        const cfg = typeConfig[tx.type];
                        return (
                          <tr key={tx.hash} onClick={() => setSelectedTx(tx)} className="border-b border-border/50 hover:bg-foreground/[0.04] transition-colors cursor-pointer group">
                            <td className="px-4 py-3.5">
                              <span className="flex items-center gap-1 font-inter text-[12px] text-primary font-mono group-hover:underline">
                                {tx.hash}
                                <ExternalLink className="w-3 h-3 text-muted-foreground" />
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className={`inline-flex items-center gap-1 font-inter text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                                <cfg.icon className="w-3 h-3" />
                                {tx.type}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 font-inter text-[12px] text-foreground">
                              <span className="flex items-center gap-1">{tx.from} <ArrowRight className="w-3 h-3 text-muted-foreground" /> {tx.to}</span>
                            </td>
                            <td className="px-4 py-3.5 font-inter text-[12px] text-foreground font-medium">{tx.amount}</td>
                            <td className="px-4 py-3.5 font-inter text-[11px] text-muted-foreground">{tx.gas}</td>
                            <td className="px-4 py-3.5 font-inter text-[11px] text-muted-foreground font-mono">{tx.block}</td>
                            <td className="px-4 py-3.5">
                              <span className="flex items-center gap-1 font-inter text-[11px] text-muted-foreground">
                                <Clock className="w-3 h-3" /> {tx.time}
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="inline-flex items-center gap-1 text-[10px] font-inter text-primary bg-primary/10 rounded-full px-2 py-0.5">
                                <CheckCircle2 className="w-3 h-3" /> {tx.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>
          </main>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      <AnimatePresence>
        {selectedTx && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4" onClick={() => setSelectedTx(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()} className="liquid-glass rounded-2xl w-full max-w-lg border border-border">
              <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="font-inter font-bold text-foreground text-[15px]">Transaction Details</h2>
                  <p className="font-inter text-[11px] text-muted-foreground mt-0.5">{selectedTx.timestamp}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedTx(null)}><X className="w-5 h-5 text-muted-foreground" /></Button>
              </div>
              <div className="p-6 space-y-4">
                {/* Type & Status */}
                <div className="flex items-center gap-3">
                  {(() => {
                    const cfg = typeConfig[selectedTx.type];
                    return (
                      <span className={`inline-flex items-center gap-1 font-inter text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
                        <cfg.icon className="w-3 h-3" />
                        {selectedTx.type}
                      </span>
                    );
                  })()}
                  <span className="inline-flex items-center gap-1 text-[10px] font-inter text-primary bg-primary/10 rounded-full px-2.5 py-1">
                    <CheckCircle2 className="w-3 h-3" /> Confirmed
                  </span>
                </div>

                {/* Route */}
                <div className="bg-secondary/30 rounded-lg p-4 flex items-center justify-center gap-4">
                  <div className="text-center">
                    <p className="font-inter font-bold text-foreground text-[14px]">{selectedTx.from}</p>
                    <p className="font-inter text-[10px] text-muted-foreground">Source</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-primary" />
                  <div className="text-center">
                    <p className="font-inter font-bold text-foreground text-[14px]">{selectedTx.to}</p>
                    <p className="font-inter text-[10px] text-muted-foreground">Destination</p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="space-y-2.5">
                  {[
                    { label: 'TX Hash', val: selectedTx.hash, copyable: true },
                    { label: 'Amount', val: selectedTx.amount },
                    { label: 'Network', val: selectedTx.network },
                    { label: 'Block', val: selectedTx.block },
                    { label: 'Confirmations', val: String(selectedTx.confirmations) },
                    { label: 'Gas Used', val: selectedTx.gasUsed },
                    { label: 'Gas Price', val: selectedTx.gas },
                    { label: 'Nonce', val: String(selectedTx.nonce) },
                    ...(selectedTx.slippage !== 'N/A' ? [{ label: 'Slippage', val: selectedTx.slippage }] : []),
                    ...(selectedTx.hspRef ? [{ label: 'HSP Reference', val: selectedTx.hspRef }] : []),
                  ].map(d => (
                    <div key={d.label} className="flex items-center justify-between py-1.5 border-b border-border/20">
                      <span className="font-inter text-[12px] text-muted-foreground">{d.label}</span>
                      <span className="font-inter text-[12px] text-foreground font-medium flex items-center gap-1.5">
                        {d.label === 'TX Hash' ? <span className="font-mono text-primary">{d.val}</span> : d.val}
                        {'copyable' in d && (
                          <button onClick={() => handleCopy(selectedTx.fullHash)} className="text-muted-foreground hover:text-foreground transition-colors">
                            <Copy className="w-3 h-3" />
                          </button>
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                {copied && <p className="text-[11px] text-primary font-inter text-center">Hash copied!</p>}

                <Button variant="outline" className="w-full font-inter text-[12px] gap-2 mt-2">
                  <ExternalLink className="w-3.5 h-3.5" /> View on Explorer
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SidebarProvider>
  );
};

export default Transactions;
