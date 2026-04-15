import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { motion, AnimatePresence } from 'framer-motion';
import PerformanceChart from '@/components/PerformanceChart';
import { useNavigate } from 'react-router-dom';
import OnboardingTour, { useOnboarding } from '@/components/OnboardingTour';
import {
  TrendingUp,
  DollarSign,
  BarChart3,
  ShieldCheck,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Plus,
  Minus,
  Settings,
  Wallet,
} from 'lucide-react';
import { AgentIcon } from '@/components/icons/DashboardIcons';
import { Button } from '@/components/ui/button';
import { VaultLiveCard } from '@/components/VaultLiveCard';
import { useQuery } from '@tanstack/react-query';
import { fetchAgentLogs, fetchDecisions } from '@/lib/liveOps';
import { useAccount, useReadContract } from 'wagmi';
import { hashKeyTestnet } from '@/lib/hashkeyChain';
import { portfolioVaultReadAbi } from '@/lib/vaultAbi';

const fallbackKpis = [
  { label: 'Total AUM', value: '$12.4M', change: '+3.2%', up: true, icon: DollarSign, link: '/dashboard/portfolio' },
  { label: 'Daily Yield', value: '$1,847', change: '+12.1%', up: true, icon: TrendingUp, link: '/dashboard/transactions' },
  { label: 'Risk Score', value: '0.34', change: '-0.08', up: true, icon: ShieldCheck, link: '/dashboard/settings' },
  { label: 'Rebalances (24h)', value: '7', change: '+2', up: true, icon: BarChart3, link: '/dashboard/agents' },
];

const fallbackHoldings = [
  { asset: 'Tokenized US Treasury', ticker: 'tUSTB', allocation: 35, value: '$4.34M', apy: '5.2%', status: 'stable' },
  { asset: 'Real Estate Fund', ticker: 'rREF', allocation: 25, value: '$3.10M', apy: '7.8%', status: 'stable' },
  { asset: 'Corporate Bond Pool', ticker: 'cBOND', allocation: 20, value: '$2.48M', apy: '6.1%', status: 'drift' },
  { asset: 'Gold-backed Token', ticker: 'gGLD', allocation: 12, value: '$1.49M', apy: '3.4%', status: 'stable' },
  { asset: 'Cash Reserve', ticker: 'USDC', allocation: 8, value: '$0.99M', apy: '4.9%', status: 'stable' },
];

const fallbackAgentLogs = [
  { time: '2 min ago', agent: 'Monitor', event: 'Price drift detected on cBOND (+1.2%)', type: 'warning' },
  { time: '5 min ago', agent: 'Decision', event: 'Rebalance approved: sell 0.8% cBOND → buy tUSTB', type: 'success' },
  { time: '5 min ago', agent: 'Execution', event: 'TX submitted: 0x7a3f...c291 (confirmed)', type: 'success' },
  { time: '12 min ago', agent: 'Settlement', event: 'Yield disbursement: $1,847 via Apex Settlement Router', type: 'success' },
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
  const { showOnboarding, completeOnboarding } = useOnboarding();
  const { isConnected } = useAccount();
  const vaultAddress = import.meta.env.VITE_PUBLIC_VAULT_ADDRESS as `0x${string}` | undefined;
  const { data: liveLogs } = useQuery({
    queryKey: ['dashboard-live-logs'],
    queryFn: () => fetchAgentLogs(20),
    refetchInterval: 15000,
  });
  const { data: liveDecisions } = useQuery({
    queryKey: ['dashboard-live-decisions'],
    queryFn: () => fetchDecisions(50),
    refetchInterval: 15000,
  });
  const { data: liveAlloc } = useReadContract({
    address: vaultAddress,
    abi: portfolioVaultReadAbi,
    functionName: 'getCurrentAllocations',
    chainId: hashKeyTestnet.id,
    query: { enabled: Boolean(vaultAddress) && isConnected },
  });

  const decisions24h = (liveDecisions ?? []).filter((d) => {
    const ts = new Date(d.executed_at).getTime();
    return Date.now() - ts <= 24 * 60 * 60 * 1000;
  });
  const kpis = [
    { ...fallbackKpis[0], value: `${(liveAlloc?.[0]?.length ?? 0).toString()} assets`, change: 'Live on-chain', up: true },
    { ...fallbackKpis[1], value: `${decisions24h.length}`, change: 'Decisions (24h)', up: true },
    { ...fallbackKpis[2], value: `${(liveLogs ?? []).length}`, change: 'Agent logs', up: true },
    {
      ...fallbackKpis[3],
      value: `${decisions24h.filter((d) => d.decision_type === 'rebalance').length}`,
      change: 'Rebalances (24h)',
      up: true,
    },
  ];

  const holdings =
    liveAlloc && Array.isArray(liveAlloc[0]) && Array.isArray(liveAlloc[1]) && liveAlloc[0].length > 0
      ? (liveAlloc[0] as readonly `0x${string}`[]).map((token, i) => ({
          asset: `Token ${token.slice(0, 6)}...${token.slice(-4)}`,
          ticker: token.slice(0, 6),
          allocation: Number((liveAlloc[1] as readonly bigint[])[i] ?? 0n) / 100,
          value: 'On-chain',
          apy: 'Live',
          status: 'stable',
        }))
      : fallbackHoldings;

  const agentLogs = (liveLogs ?? []).length
    ? (liveLogs ?? []).slice(0, 6).map((l) => ({
        time: new Date(l.created_at).toLocaleTimeString(),
        agent: l.action.includes('MONITOR') ? 'Monitor' : l.action.includes('REBALANCE') ? 'Execution' : 'Decision',
        event: l.action,
        type: l.action.includes('REBALANCE') ? 'warning' : 'info',
      }))
    : fallbackAgentLogs;
  return (
    <>
    <AnimatePresence>
      {showOnboarding && <OnboardingTour onComplete={completeOnboarding} />}
    </AnimatePresence>
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader title="Portfolio Overview" />

          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-[1400px] mx-auto space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-1">
                  <VaultLiveCard />
                </div>
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button onClick={() => navigate('/dashboard/portfolio?action=deposit')} className="liquid-glass rounded-xl p-5 text-left hover:bg-foreground/[0.04] transition-colors group cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Plus className="w-4.5 h-4.5 text-primary" />
                    </div>
                    <div>
                      <p className="font-inter font-bold text-foreground text-[14px]">Deposit</p>
                      <p className="font-inter text-[11px] text-muted-foreground">Add funds to your vault</p>
                    </div>
                  </div>
                </button>
                <button onClick={() => navigate('/dashboard/portfolio?action=withdraw')} className="liquid-glass rounded-xl p-5 text-left hover:bg-foreground/[0.04] transition-colors group cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                      <Minus className="w-4.5 h-4.5 text-accent" />
                    </div>
                    <div>
                      <p className="font-inter font-bold text-foreground text-[14px]">Withdraw</p>
                      <p className="font-inter text-[11px] text-muted-foreground">Withdraw yield or funds via Apex Settlement Router</p>
                    </div>
                  </div>
                </button>
                <button onClick={() => navigate('/dashboard/settings')} className="liquid-glass rounded-xl p-5 text-left hover:bg-foreground/[0.04] transition-colors group cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-secondary/80 transition-colors">
                      <Settings className="w-4.5 h-4.5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-inter font-bold text-foreground text-[14px]">Configure</p>
                      <p className="font-inter text-[11px] text-muted-foreground">Agent thresholds & risk limits</p>
                    </div>
                  </div>
                </button>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi, i) => (
                  <motion.div
                    key={kpi.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    onClick={() => navigate(kpi.link)}
                    className="liquid-glass rounded-xl p-5 cursor-pointer hover:bg-foreground/[0.03] transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-inter text-[11px] text-muted-foreground uppercase tracking-widest">
                        {kpi.label}
                      </span>
                      <kpi.icon className="w-4 h-4 text-primary/60 group-hover:text-primary transition-colors" />
                    </div>
                    <p className="font-inter font-extrabold text-foreground text-[28px] leading-none mb-1">
                      {kpi.value}
                    </p>
                    <div className="flex items-center gap-1">
                      <ArrowUpRight className="w-3.5 h-3.5 text-primary" />
                      <span className="font-inter text-[12px] font-medium text-primary">
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
                  <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                    <h3 className="font-inter font-bold text-foreground text-[15px]">Portfolio Holdings</h3>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/portfolio')} className="text-primary text-[12px] font-inter gap-1 h-7 px-2">
                      View All <ArrowRight className="w-3 h-3" />
                    </Button>
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
                              <p className="font-inter font-medium text-foreground text-[13px] group-hover:text-primary transition-colors">{h.asset}</p>
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

                {/* Agent Activity */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="liquid-glass rounded-xl overflow-hidden"
                >
                  <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                    <h3 className="font-inter font-bold text-foreground text-[15px]">Agent Activity</h3>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/agents')} className="text-primary text-[12px] font-inter gap-1 h-7 px-2">
                      View All <ArrowRight className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="divide-y divide-border/50">
                    {agentLogs.map((log, i) => (
                      <div key={i} onClick={() => navigate('/dashboard/agents')} className="px-5 py-3.5 hover:bg-foreground/[0.04] transition-colors cursor-pointer">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-inter text-[10px] uppercase tracking-widest font-bold ${
                            log.agent === 'Monitor' ? 'text-accent' :
                            log.agent === 'Decision' ? 'text-primary' :
                            log.agent === 'Execution' ? 'text-primary' :
                            'text-accent'
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
    </>
  );
};

export default Dashboard;
