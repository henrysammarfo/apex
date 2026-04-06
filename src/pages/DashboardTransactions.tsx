import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, CheckCircle2, Clock, ExternalLink, X, Copy, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const transactions = [
  { hash: '0x7a3f...c291', fullHash: '0x7a3fc29183b4e1d5a6f2890ce4d7b3a1f8e62c291', type: 'Rebalance', from: 'cBOND', to: 'tUSTB', amount: '$99,200', gas: '0.08 Gwei', time: '5 min ago', status: 'confirmed', block: '#4,291,037', timestamp: '2025-01-15 14:32:18 UTC', network: 'HashKey L2', confirmations: 128, nonce: 47, gasUsed: '42,318', slippage: '0.02%' },
  { hash: '0x2b1e...a8f4', fullHash: '0x2b1ea8f4d7c3e5b6a9012f3d8c4e7b1a5f6d2a8f4', type: 'Rebalance', from: 'gGLD', to: 'rREF', amount: '$45,600', gas: '0.09 Gwei', time: '2 hr ago', status: 'confirmed', block: '#4,290,998', timestamp: '2025-01-15 12:45:03 UTC', network: 'HashKey L2', confirmations: 312, nonce: 46, gasUsed: '38,291', slippage: '0.01%' },
  { hash: '0x9c2d...f871', fullHash: '0x9c2df871e4a3b5c6d7f8012e3a4b5c6d7e8f9a871', type: 'Rebalance', from: 'USDC', to: 'tUSTB', amount: '$120,000', gas: '0.07 Gwei', time: '8 hr ago', status: 'confirmed', block: '#4,290,812', timestamp: '2025-01-15 06:12:44 UTC', network: 'HashKey L2', confirmations: 894, nonce: 45, gasUsed: '35,102', slippage: '0.03%' },
  { hash: '0x4e7b...3a12', fullHash: '0x4e7b3a12f5d6e7c8b9a0123d4e5f6a7b8c9d3a12', type: 'Yield', from: 'Vault', to: '4 wallets', amount: '$1,847', gas: '0.12 Gwei', time: '12 min ago', status: 'confirmed', block: '#4,291,042', timestamp: '2025-01-15 14:25:06 UTC', network: 'HashKey L2', confirmations: 148, nonce: 48, gasUsed: '78,432', slippage: 'N/A' },
  { hash: '0x1f8c...d923', fullHash: '0x1f8cd923a4b5c6d7e8f90123a4b5c6d7e8f9d923', type: 'Yield', from: 'Vault', to: '4 wallets', amount: '$1,623', gas: '0.11 Gwei', time: '6 hr ago', status: 'confirmed', block: '#4,290,900', timestamp: '2025-01-15 08:45:22 UTC', network: 'HashKey L2', confirmations: 621, nonce: 44, gasUsed: '76,891', slippage: 'N/A' },
  { hash: '0x6a9d...b441', fullHash: '0x6a9db441c3d4e5f6a7b80912c3d4e5f6a7b8b441', type: 'Rebalance', from: 'rREF', to: 'cBOND', amount: '$67,300', gas: '0.08 Gwei', time: '1 day ago', status: 'confirmed', block: '#4,290,200', timestamp: '2025-01-14 09:30:12 UTC', network: 'HashKey L2', confirmations: 2104, nonce: 43, gasUsed: '41,203', slippage: '0.01%' },
  { hash: '0x3c5e...7f82', fullHash: '0x3c5e7f82d4e5f6a7b8c90123d4e5f6a7b8c97f82', type: 'Yield', from: 'Vault', to: '4 wallets', amount: '$1,512', gas: '0.10 Gwei', time: '1 day ago', status: 'confirmed', block: '#4,290,150', timestamp: '2025-01-14 08:00:45 UTC', network: 'HashKey L2', confirmations: 2291, nonce: 42, gasUsed: '74,512', slippage: 'N/A' },
  { hash: '0x8b2a...e194', fullHash: '0x8b2ae194f5a6b7c8d9e01234f5a6b7c8d9e0e194', type: 'Rebalance', from: 'tUSTB', to: 'gGLD', amount: '$33,100', gas: '0.07 Gwei', time: '2 days ago', status: 'confirmed', block: '#4,289,800', timestamp: '2025-01-13 15:20:33 UTC', network: 'HashKey L2', confirmations: 4312, nonce: 41, gasUsed: '36,778', slippage: '0.02%' },
];

const Transactions = () => {
  const [selectedTx, setSelectedTx] = useState<typeof transactions[0] | null>(null);
  const [copied, setCopied] = useState(false);

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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Total TXs (7d)', value: '23' },
                  { label: 'Total Volume', value: '$1.2M' },
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
                <div className="px-5 py-4 border-b border-border">
                  <h3 className="font-inter font-bold text-foreground text-[15px]">Transaction History</h3>
                  <p className="font-inter text-[11px] text-muted-foreground mt-0.5">Click any transaction to view full details</p>
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
                      {transactions.map((tx) => (
                        <tr key={tx.hash} onClick={() => setSelectedTx(tx)} className="border-b border-border/50 hover:bg-foreground/[0.04] transition-colors cursor-pointer group">
                          <td className="px-4 py-3.5">
                            <span className="flex items-center gap-1 font-inter text-[12px] text-primary font-mono group-hover:underline">
                              {tx.hash}
                              <ExternalLink className="w-3 h-3 text-muted-foreground" />
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={`font-inter text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full ${
                              tx.type === 'Rebalance' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'
                            }`}>{tx.type}</span>
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
                      ))}
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
                  <span className={`font-inter text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full ${
                    selectedTx.type === 'Rebalance' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'
                  }`}>{selectedTx.type}</span>
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
