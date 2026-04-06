import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { motion } from 'framer-motion';
import PerformanceChart from '@/components/PerformanceChart';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  ShieldCheck,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from 'lucide-react';

const kpis = [
  { label: 'Total AUM', value: '$12.4M', change: '+3.2%', up: true, icon: DollarSign },
  { label: 'Daily Yield', value: '$1,847', change: '+12.1%', up: true, icon: TrendingUp },
  { label: 'Risk Score', value: '0.34', change: '-0.08', up: true, icon: ShieldCheck },
  { label: 'Rebalances (24h)', value: '7', change: '+2', up: true, icon: BarChart3 },
];

const holdings = [
  { asset: 'Tokenized US Treasury', ticker: 'tUSTB', allocation: 35, value: '$4.34M', apy: '5.2%', status: 'stable' },
  { asset: 'Real Estate Fund', ticker: 'rREF', allocation: 25, value: '$3.10M', apy: '7.8%', status: 'stable' },
  { asset: 'Corporate Bond Pool', ticker: 'cBOND', allocation: 20, value: '$2.48M', apy: '6.1%', status: 'drift' },
  { asset: 'Gold-backed Token', ticker: 'gGLD', allocation: 12, value: '$1.49M', apy: '3.4%', status: 'stable' },
  { asset: 'Cash Reserve', ticker: 'USDC', allocation: 8, value: '$0.99M', apy: '4.9%', status: 'stable' },
];

const agentLogs = [
  { time: '2 min ago', agent: 'Monitor', event: 'Price drift detected on cBOND (+1.2%)', type: 'warning' },
  { time: '5 min ago', agent: 'Decision', event: 'Rebalance approved: sell 0.8% cBOND → buy tUSTB', type: 'success' },
  { time: '5 min ago', agent: 'Execution', event: 'TX submitted: 0x7a3f...c291 (confirmed)', type: 'success' },
  { time: '12 min ago', agent: 'Settlement', event: 'Yield disbursement: $1,847 via HSP', type: 'success' },
  { time: '1 hr ago', agent: 'Monitor', event: 'All assets within allocation thresholds', type: 'info' },
  { time: '2 hr ago', agent: 'Execution', event: 'TX submitted: 0x2b1e...a8f4 (confirmed)', type: 'success' },
];

const allocationColors = [
  'bg-primary',
  'bg-primary/70',
  'bg-primary/50',
  'bg-primary/30',
  'bg-primary/15',
];

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader title="Portfolio Overview" />

          {/* Dashboard Content */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-[1400px] mx-auto space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi, i) => (
                  <motion.div
                    key={kpi.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    className="liquid-glass rounded-xl p-5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-inter text-[11px] text-muted-foreground uppercase tracking-widest">
                        {kpi.label}
                      </span>
                      <kpi.icon className="w-4 h-4 text-primary/60" />
                    </div>
                    <p className="font-inter font-extrabold text-foreground text-[28px] leading-none mb-1">
                      {kpi.value}
                    </p>
                    <div className="flex items-center gap-1">
                      {kpi.up ? (
                        <ArrowUpRight className="w-3.5 h-3.5 text-primary" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5 text-destructive" />
                      )}
                      <span className={`font-inter text-[12px] font-medium ${kpi.up ? 'text-primary' : 'text-destructive'}`}>
                        {kpi.change}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Performance Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
              >
                <PerformanceChart />
              </motion.div>

              {/* Main Grid: Holdings + Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Holdings Table */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="lg:col-span-2 liquid-glass rounded-xl overflow-hidden"
                >
                  <div className="px-5 py-4 border-b border-border">
                    <h3 className="font-inter font-bold text-foreground text-[15px]">Portfolio Holdings</h3>
                  </div>

                  {/* Allocation Bar */}
                  <div className="px-5 pt-4 pb-2">
                    <div className="flex rounded-full overflow-hidden h-2.5 bg-secondary">
                      {holdings.map((h, i) => (
                        <div
                          key={h.ticker}
                          className={`${allocationColors[i]} transition-all duration-700`}
                          style={{ width: `${h.allocation}%` }}
                        />
                      ))}
                    </div>
                    <div className="flex gap-4 mt-2 flex-wrap">
                      {holdings.map((h, i) => (
                        <span key={h.ticker} className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-inter">
                          <span className={`w-2 h-2 rounded-full ${allocationColors[i]}`} />
                          {h.ticker} {h.allocation}%
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left px-5 py-3 font-inter text-[10px] text-muted-foreground uppercase tracking-widest">Asset</th>
                          <th className="text-right px-5 py-3 font-inter text-[10px] text-muted-foreground uppercase tracking-widest">Value</th>
                          <th className="text-right px-5 py-3 font-inter text-[10px] text-muted-foreground uppercase tracking-widest">APY</th>
                          <th className="text-right px-5 py-3 font-inter text-[10px] text-muted-foreground uppercase tracking-widest">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {holdings.map((h) => (
                          <tr key={h.ticker} onClick={() => navigate('/dashboard/portfolio')} className="border-b border-border/50 hover:bg-foreground/[0.04] transition-colors cursor-pointer group">
                            <td className="px-5 py-3.5">
                              <p className="font-inter font-medium text-foreground text-[13px]">{h.asset}</p>
                              <p className="font-inter text-[11px] text-muted-foreground">{h.ticker}</p>
                            </td>
                            <td className="text-right px-5 py-3.5 font-inter font-medium text-foreground text-[13px]">{h.value}</td>
                            <td className="text-right px-5 py-3.5 font-inter text-primary text-[13px]">{h.apy}</td>
                            <td className="text-right px-5 py-3.5">
                              {h.status === 'stable' ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-inter text-primary bg-primary/10 rounded-full px-2 py-0.5">
                                  <CheckCircle2 className="w-3 h-3" /> Stable
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-inter text-yellow-400 bg-yellow-400/10 rounded-full px-2 py-0.5">
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

                {/* Agent Activity */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="liquid-glass rounded-xl overflow-hidden"
                >
                  <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                    <h3 className="font-inter font-bold text-foreground text-[15px]">Agent Activity</h3>
                    <Zap className="w-4 h-4 text-primary/60" />
                  </div>
                  <div className="divide-y divide-border/50">
                    {agentLogs.map((log, i) => (
                      <div key={i} className="px-5 py-3.5 hover:bg-foreground/[0.02] transition-colors">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-inter text-[10px] uppercase tracking-widest font-bold ${
                            log.agent === 'Monitor' ? 'text-blue-400' :
                            log.agent === 'Decision' ? 'text-purple-400' :
                            log.agent === 'Execution' ? 'text-primary' :
                            'text-orange-400'
                          }`}>
                            {log.agent}
                          </span>
                          <span className="flex items-center gap-1 font-inter text-[10px] text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {log.time}
                          </span>
                        </div>
                        <p className="font-inter text-[12px] text-foreground/80 leading-relaxed">{log.event}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
