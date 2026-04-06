import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, CheckCircle2, AlertTriangle, TrendingUp, ArrowUpRight, X, ExternalLink, BarChart3, Clock, ArrowDownRight } from 'lucide-react';
import PerformanceChart from '@/components/PerformanceChart';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const holdings = [
  {
    asset: 'Tokenized US Treasury', ticker: 'tUSTB', allocation: 35, value: 4340000, apy: 5.2, status: 'stable', change: '+2.1%',
    description: 'Short-duration U.S. Treasury bonds tokenized on HashKey Chain. Backed 1:1 by Fidelity custodied assets.',
    maturity: '2025-12-15', issuer: 'Apex Treasury LLC', chain: 'HashKey L2', contract: '0x4a2e...8f31',
    history: [
      { date: 'Jan', value: 3800 }, { date: 'Feb', value: 3900 }, { date: 'Mar', value: 4050 },
      { date: 'Apr', value: 4100 }, { date: 'May', value: 4200 }, { date: 'Jun', value: 4340 },
    ],
    yieldHistory: [
      { date: 'Jan', apy: 4.8 }, { date: 'Feb', apy: 5.0 }, { date: 'Mar', apy: 5.1 },
      { date: 'Apr', apy: 5.0 }, { date: 'May', apy: 5.3 }, { date: 'Jun', apy: 5.2 },
    ],
  },
  {
    asset: 'Real Estate Fund', ticker: 'rREF', allocation: 25, value: 3100000, apy: 7.8, status: 'stable', change: '+4.3%',
    description: 'Diversified commercial real estate fund covering Grade A properties across APAC markets.',
    maturity: 'Open-ended', issuer: 'Apex Realty DAO', chain: 'HashKey L2', contract: '0x7b1c...2d44',
    history: [
      { date: 'Jan', value: 2700 }, { date: 'Feb', value: 2800 }, { date: 'Mar', value: 2900 },
      { date: 'Apr', value: 2950 }, { date: 'May', value: 3020 }, { date: 'Jun', value: 3100 },
    ],
    yieldHistory: [
      { date: 'Jan', apy: 7.2 }, { date: 'Feb', apy: 7.5 }, { date: 'Mar', apy: 7.6 },
      { date: 'Apr', apy: 7.9 }, { date: 'May', apy: 7.7 }, { date: 'Jun', apy: 7.8 },
    ],
  },
  {
    asset: 'Corporate Bond Pool', ticker: 'cBOND', allocation: 20, value: 2480000, apy: 6.1, status: 'drift', change: '-0.8%',
    description: 'Investment-grade corporate bonds from Fortune 500 issuers. Currently experiencing price drift.',
    maturity: '2026-06-30', issuer: 'Apex Credit Pool', chain: 'HashKey L2', contract: '0x3e9a...7c12',
    history: [
      { date: 'Jan', value: 2600 }, { date: 'Feb', value: 2550 }, { date: 'Mar', value: 2520 },
      { date: 'Apr', value: 2500 }, { date: 'May', value: 2490 }, { date: 'Jun', value: 2480 },
    ],
    yieldHistory: [
      { date: 'Jan', apy: 6.0 }, { date: 'Feb', apy: 6.2 }, { date: 'Mar', apy: 6.3 },
      { date: 'Apr', apy: 6.1 }, { date: 'May', apy: 6.0 }, { date: 'Jun', apy: 6.1 },
    ],
  },
  {
    asset: 'Gold-backed Token', ticker: 'gGLD', allocation: 12, value: 1490000, apy: 3.4, status: 'stable', change: '+1.2%',
    description: 'LBMA-certified gold reserves tokenized for on-chain portfolio hedging.',
    maturity: 'Perpetual', issuer: 'Apex Gold Vault', chain: 'HashKey L2', contract: '0x8d5f...1a93',
    history: [
      { date: 'Jan', value: 1400 }, { date: 'Feb', value: 1420 }, { date: 'Mar', value: 1440 },
      { date: 'Apr', value: 1460 }, { date: 'May', value: 1475 }, { date: 'Jun', value: 1490 },
    ],
    yieldHistory: [
      { date: 'Jan', apy: 3.2 }, { date: 'Feb', apy: 3.3 }, { date: 'Mar', apy: 3.4 },
      { date: 'Apr', apy: 3.5 }, { date: 'May', apy: 3.3 }, { date: 'Jun', apy: 3.4 },
    ],
  },
  {
    asset: 'Cash Reserve', ticker: 'USDC', allocation: 8, value: 990000, apy: 4.9, status: 'stable', change: '+0.1%',
    description: 'Circle USDC stablecoin reserves for liquidity and rebalance operations.',
    maturity: 'On-demand', issuer: 'Circle', chain: 'HashKey L2', contract: '0x1f4b...e621',
    history: [
      { date: 'Jan', value: 980 }, { date: 'Feb', value: 985 }, { date: 'Mar', value: 988 },
      { date: 'Apr', value: 990 }, { date: 'May', value: 989 }, { date: 'Jun', value: 990 },
    ],
    yieldHistory: [
      { date: 'Jan', apy: 4.8 }, { date: 'Feb', apy: 4.9 }, { date: 'Mar', apy: 4.9 },
      { date: 'Apr', apy: 5.0 }, { date: 'May', apy: 4.9 }, { date: 'Jun', apy: 4.9 },
    ],
  },
];

const pieColors = [
  'hsl(153, 62%, 60%)',
  'hsl(153, 62%, 48%)',
  'hsl(153, 62%, 36%)',
  'hsl(153, 42%, 30%)',
  'hsl(153, 30%, 22%)',
];

const Portfolio = () => {
  const [selectedAsset, setSelectedAsset] = useState<typeof holdings[0] | null>(null);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader title="Portfolio" />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-[1400px] mx-auto space-y-6">
              <PerformanceChart />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Allocation Pie */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="liquid-glass rounded-xl p-5">
                  <h3 className="font-inter font-bold text-foreground text-[15px] mb-4">Allocation</h3>
                  <div className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={holdings} dataKey="allocation" nameKey="ticker" cx="50%" cy="50%" innerRadius={55} outerRadius={85} strokeWidth={0} className="cursor-pointer"
                          onClick={(_, i) => setSelectedAsset(holdings[i])}>
                          {holdings.map((_, i) => (
                            <Cell key={i} fill={pieColors[i]} className="hover:opacity-80 transition-opacity" />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ background: 'hsl(160,33%,5%)', border: '1px solid hsl(0,0%,100%,0.1)', borderRadius: 8, fontSize: 11 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 mt-2">
                    {holdings.map((h, i) => (
                      <button key={h.ticker} onClick={() => setSelectedAsset(h)} className="flex items-center justify-between w-full hover:bg-foreground/[0.03] rounded-lg px-2 py-1 transition-colors">
                        <span className="flex items-center gap-2 font-inter text-[12px] text-muted-foreground">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ background: pieColors[i] }} />
                          {h.ticker}
                        </span>
                        <span className="font-inter text-[12px] text-foreground font-medium">{h.allocation}%</span>
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Detailed Holdings */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 liquid-glass rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-border">
                    <h3 className="font-inter font-bold text-foreground text-[15px]">Holdings Detail</h3>
                    <p className="font-inter text-[11px] text-muted-foreground mt-0.5">Click any asset to view details</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          {['Asset', 'Value', 'APY', '30d Change', 'Status'].map(h => (
                            <th key={h} className="text-left px-5 py-3 font-inter text-[10px] text-muted-foreground uppercase tracking-widest first:text-left last:text-right">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {holdings.map((h) => (
                          <tr key={h.ticker} onClick={() => setSelectedAsset(h)} className="border-b border-border/50 hover:bg-foreground/[0.04] transition-colors cursor-pointer group">
                            <td className="px-5 py-3.5">
                              <p className="font-inter font-medium text-foreground text-[13px] group-hover:text-primary transition-colors">{h.asset}</p>
                              <p className="font-inter text-[11px] text-muted-foreground">{h.ticker}</p>
                            </td>
                            <td className="px-5 py-3.5 font-inter font-medium text-foreground text-[13px]">${(h.value / 1e6).toFixed(2)}M</td>
                            <td className="px-5 py-3.5 font-inter text-primary text-[13px]">{h.apy}%</td>
                            <td className="px-5 py-3.5">
                              <span className={`flex items-center gap-1 font-inter text-[12px] ${h.change.startsWith('+') ? 'text-primary' : 'text-destructive'}`}>
                                {h.change.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {h.change}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              {h.status === 'stable' ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-inter text-primary bg-primary/10 rounded-full px-2 py-0.5">
                                  <CheckCircle2 className="w-3 h-3" /> Stable
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-inter text-accent bg-accent/10 rounded-full px-2 py-0.5">
                                  <AlertTriangle className="w-3 h-3" /> Drift
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Asset Detail Modal */}
      <AnimatePresence>
        {selectedAsset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedAsset(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="liquid-glass rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto border border-border"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="font-inter font-bold text-foreground text-lg">{selectedAsset.asset}</h2>
                  <p className="font-inter text-[12px] text-muted-foreground mt-0.5">{selectedAsset.ticker} · {selectedAsset.chain}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedAsset(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-6 space-y-6">
                {/* Description */}
                <p className="font-inter text-[13px] text-muted-foreground leading-relaxed">{selectedAsset.description}</p>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Value', val: `$${(selectedAsset.value / 1e6).toFixed(2)}M` },
                    { label: 'APY', val: `${selectedAsset.apy}%` },
                    { label: 'Allocation', val: `${selectedAsset.allocation}%` },
                    { label: '30d Change', val: selectedAsset.change },
                  ].map(m => (
                    <div key={m.label} className="bg-secondary/30 rounded-lg p-3">
                      <p className="font-inter text-[10px] text-muted-foreground uppercase tracking-widest">{m.label}</p>
                      <p className="font-inter font-bold text-foreground text-[16px] mt-1">{m.val}</p>
                    </div>
                  ))}
                </div>

                {/* Value Chart */}
                <div>
                  <h4 className="font-inter font-bold text-foreground text-[13px] mb-3 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary/60" /> Value History ($K)
                  </h4>
                  <div className="h-[160px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={selectedAsset.history}>
                        <defs>
                          <linearGradient id="valGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(153,62%,60%)" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="hsl(153,62%,60%)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,100%,0.05)" />
                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(0,0%,70%)' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: 'hsl(0,0%,70%)' }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: 'hsl(160,33%,5%)', border: '1px solid hsl(0,0%,100%,0.1)', borderRadius: 8, fontSize: 11 }} />
                        <Area type="monotone" dataKey="value" stroke="hsl(153,62%,60%)" fill="url(#valGrad)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Asset Details */}
                <div className="space-y-3">
                  <h4 className="font-inter font-bold text-foreground text-[13px]">Asset Details</h4>
                  {[
                    { label: 'Issuer', val: selectedAsset.issuer },
                    { label: 'Chain', val: selectedAsset.chain },
                    { label: 'Maturity', val: selectedAsset.maturity },
                    { label: 'Status', val: selectedAsset.status === 'stable' ? 'Stable' : 'Drift Detected' },
                    { label: 'Contract', val: selectedAsset.contract },
                  ].map(d => (
                    <div key={d.label} className="flex items-center justify-between py-2 border-b border-border/30">
                      <span className="font-inter text-[12px] text-muted-foreground">{d.label}</span>
                      <span className="font-inter text-[12px] text-foreground font-medium flex items-center gap-1">
                        {d.val}
                        {d.label === 'Contract' && <ExternalLink className="w-3 h-3 text-primary cursor-pointer" />}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SidebarProvider>
  );
};

export default Portfolio;
