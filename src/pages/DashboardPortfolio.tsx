import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { motion } from 'framer-motion';
import { Wallet, CheckCircle2, AlertTriangle, TrendingUp, ArrowUpRight } from 'lucide-react';
import PerformanceChart from '@/components/PerformanceChart';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const holdings = [
  { asset: 'Tokenized US Treasury', ticker: 'tUSTB', allocation: 35, value: 4340000, apy: 5.2, status: 'stable', change: '+2.1%' },
  { asset: 'Real Estate Fund', ticker: 'rREF', allocation: 25, value: 3100000, apy: 7.8, status: 'stable', change: '+4.3%' },
  { asset: 'Corporate Bond Pool', ticker: 'cBOND', allocation: 20, value: 2480000, apy: 6.1, status: 'drift', change: '-0.8%' },
  { asset: 'Gold-backed Token', ticker: 'gGLD', allocation: 12, value: 1490000, apy: 3.4, status: 'stable', change: '+1.2%' },
  { asset: 'Cash Reserve', ticker: 'USDC', allocation: 8, value: 990000, apy: 4.9, status: 'stable', change: '+0.1%' },
];

const pieColors = [
  'hsl(153, 62%, 60%)',
  'hsl(153, 62%, 48%)',
  'hsl(153, 62%, 36%)',
  'hsl(153, 42%, 30%)',
  'hsl(153, 30%, 22%)',
];

const Portfolio = () => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 flex items-center border-b border-border px-4 shrink-0">
          <SidebarTrigger className="text-muted-foreground" />
          <div className="h-5 w-px bg-border mx-3" />
          <Wallet className="w-4 h-4 text-primary mr-2" />
          <h1 className="font-inter font-bold text-foreground text-sm">Portfolio</h1>
        </header>
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
                      <Pie data={holdings} dataKey="allocation" nameKey="ticker" cx="50%" cy="50%" innerRadius={55} outerRadius={85} strokeWidth={0}>
                        {holdings.map((_, i) => (
                          <Cell key={i} fill={pieColors[i]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ background: 'hsl(160,33%,5%)', border: '1px solid hsl(0,0%,100%,0.1)', borderRadius: 8, fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-2">
                  {holdings.map((h, i) => (
                    <div key={h.ticker} className="flex items-center justify-between">
                      <span className="flex items-center gap-2 font-inter text-[12px] text-muted-foreground">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: pieColors[i] }} />
                        {h.ticker}
                      </span>
                      <span className="font-inter text-[12px] text-foreground font-medium">{h.allocation}%</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Detailed Holdings */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 liquid-glass rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border">
                  <h3 className="font-inter font-bold text-foreground text-[15px]">Holdings Detail</h3>
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
                        <tr key={h.ticker} className="border-b border-border/50 hover:bg-foreground/[0.02] transition-colors">
                          <td className="px-5 py-3.5">
                            <p className="font-inter font-medium text-foreground text-[13px]">{h.asset}</p>
                            <p className="font-inter text-[11px] text-muted-foreground">{h.ticker}</p>
                          </td>
                          <td className="px-5 py-3.5 font-inter font-medium text-foreground text-[13px]">${(h.value / 1e6).toFixed(2)}M</td>
                          <td className="px-5 py-3.5 font-inter text-primary text-[13px]">{h.apy}%</td>
                          <td className="px-5 py-3.5">
                            <span className={`flex items-center gap-1 font-inter text-[12px] ${h.change.startsWith('+') ? 'text-primary' : 'text-destructive'}`}>
                              {h.change.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
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
  </SidebarProvider>
);

export default Portfolio;
