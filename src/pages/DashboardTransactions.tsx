import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { motion } from 'framer-motion';
import { Activity, CheckCircle2, Clock, ExternalLink } from 'lucide-react';

const transactions = [
  { hash: '0x7a3f...c291', type: 'Rebalance', from: 'cBOND', to: 'tUSTB', amount: '$99,200', gas: '0.08 Gwei', time: '5 min ago', status: 'confirmed', block: '#4,291,037' },
  { hash: '0x2b1e...a8f4', type: 'Rebalance', from: 'gGLD', to: 'rREF', amount: '$45,600', gas: '0.09 Gwei', time: '2 hr ago', status: 'confirmed', block: '#4,290,998' },
  { hash: '0x9c2d...f871', type: 'Rebalance', from: 'USDC', to: 'tUSTB', amount: '$120,000', gas: '0.07 Gwei', time: '8 hr ago', status: 'confirmed', block: '#4,290,812' },
  { hash: '0x4e7b...3a12', type: 'Yield', from: 'Vault', to: '4 wallets', amount: '$1,847', gas: '0.12 Gwei', time: '12 min ago', status: 'confirmed', block: '#4,291,042' },
  { hash: '0x1f8c...d923', type: 'Yield', from: 'Vault', to: '4 wallets', amount: '$1,623', gas: '0.11 Gwei', time: '6 hr ago', status: 'confirmed', block: '#4,290,900' },
  { hash: '0x6a9d...b441', type: 'Rebalance', from: 'rREF', to: 'cBOND', amount: '$67,300', gas: '0.08 Gwei', time: '1 day ago', status: 'confirmed', block: '#4,290,200' },
  { hash: '0x3c5e...7f82', type: 'Yield', from: 'Vault', to: '4 wallets', amount: '$1,512', gas: '0.10 Gwei', time: '1 day ago', status: 'confirmed', block: '#4,290,150' },
  { hash: '0x8b2a...e194', type: 'Rebalance', from: 'tUSTB', to: 'gGLD', amount: '$33,100', gas: '0.07 Gwei', time: '2 days ago', status: 'confirmed', block: '#4,289,800' },
];

const Transactions = () => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 flex items-center border-b border-border px-4 shrink-0">
          <SidebarTrigger className="text-muted-foreground" />
          <div className="h-5 w-px bg-border mx-3" />
          <Activity className="w-4 h-4 text-primary mr-2" />
          <h1 className="font-inter font-bold text-foreground text-sm">Transactions</h1>
        </header>
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
                      <tr key={tx.hash} className="border-b border-border/50 hover:bg-foreground/[0.02] transition-colors">
                        <td className="px-4 py-3.5">
                          <span className="flex items-center gap-1 font-inter text-[12px] text-primary font-mono cursor-pointer hover:underline">
                            {tx.hash}
                            <ExternalLink className="w-3 h-3 text-muted-foreground" />
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`font-inter text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full ${
                            tx.type === 'Rebalance' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'
                          }`}>{tx.type}</span>
                        </td>
                        <td className="px-4 py-3.5 font-inter text-[12px] text-foreground">{tx.from} → {tx.to}</td>
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
  </SidebarProvider>
);

export default Transactions;
