import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Clock, CheckCircle2, AlertTriangle, Info, Zap, X, ExternalLink, Activity, Settings } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNowStrict } from 'date-fns';
import { fetchAgentLogs } from '@/lib/liveOps';

type AgentName = 'Monitor' | 'Decision' | 'Execution' | 'Settlement';

const agentDetails: Record<AgentName, { description: string; tasks: string[]; uptime: string; lastAction: string; metrics: { label: string; value: string }[] }> = {
  Monitor: {
    description: 'Continuously monitors price feeds from Chainlink oracles across 12 RWA assets on HashKey Chain. Detects allocation drift and triggers alerts.',
    tasks: ['Price feed polling (60s intervals)', 'Drift threshold detection (±1.0%)', 'Feed health monitoring', 'Latency tracking'],
    uptime: '99.97%', lastAction: '2 min ago',
    metrics: [{ label: 'Feeds Active', value: '12' }, { label: 'Avg Latency', value: '340ms' }, { label: 'Alerts (24h)', value: '3' }, { label: 'Checks (24h)', value: '1,440' }],
  },
  Decision: {
    description: 'AI-powered decision engine using GPT-4o reasoning to evaluate rebalance opportunities. Assesses risk, confidence, and expected outcomes before approving actions.',
    tasks: ['Risk-adjusted rebalance evaluation', 'Confidence scoring (min 85%)', 'Slippage prediction', 'Multi-asset correlation analysis'],
    uptime: '99.99%', lastAction: '5 min ago',
    metrics: [{ label: 'Decisions (24h)', value: '7' }, { label: 'Avg Confidence', value: '91%' }, { label: 'Approval Rate', value: '85%' }, { label: 'Avg Response', value: '1.2s' }],
  },
  Execution: {
    description: 'Handles on-chain transaction submission and confirmation on HashKey L2. Optimizes gas usage and monitors settlement status.',
    tasks: ['Transaction building & signing', 'Gas optimization', 'Confirmation tracking', 'Retry logic on failures'],
    uptime: '99.95%', lastAction: '5 min ago',
    metrics: [{ label: 'TXs (24h)', value: '7' }, { label: 'Avg Gas', value: '0.08 Gwei' }, { label: 'Avg Confirm', value: '1.8s' }, { label: 'Success Rate', value: '100%' }],
  },
  Settlement: {
    description: 'Manages yield distribution via Apex Settlement Router with identity/eligibility checks from Apex Identity Registry.',
    tasks: ['Yield calculation & aggregation', 'Settlement route execution', 'Identity verification checks', 'Recipient route validation'],
    uptime: '99.98%', lastAction: '12 min ago',
    metrics: [{ label: 'Settled (24h)', value: '$3,470' }, { label: 'Recipients', value: '4' }, { label: 'Settlements', value: '2' }, { label: 'KYC Status', value: 'Verified' }],
  },
};

const fallbackLogs = [
  { time: '2 min ago', agent: 'Monitor' as AgentName, event: 'Price drift detected on cBOND (+1.2% above threshold)', type: 'warning', detail: 'cBOND price: $102.34 | Target: $101.10 | Threshold: ±1.0%', txHash: '' },
  { time: '5 min ago', agent: 'Decision' as AgentName, event: 'Rebalance approved: sell 0.8% cBOND → buy tUSTB', type: 'success', detail: 'Confidence: 92% | Risk delta: -0.04 | Expected slippage: 0.02%', txHash: '' },
  { time: '5 min ago', agent: 'Execution' as AgentName, event: 'TX submitted: 0x7a3f...c291 (confirmed in 1.8s)', type: 'success', detail: 'Gas: 0.08 Gwei | Block: #4,291,037 | Chain: HSK L2', txHash: '0x7a3f...c291' },
  { time: '12 min ago', agent: 'Settlement' as AgentName, event: 'Yield disbursement: $1,847.32 via Apex Settlement Router to 4 recipients', type: 'success', detail: 'Recipients: 4 institutional wallets | Currency: USDC | Identity: verified', txHash: '0x4e7b...3a12' },
  { time: '1 hr ago', agent: 'Monitor' as AgentName, event: 'All assets within allocation thresholds', type: 'info', detail: 'Max drift: 0.3% (gGLD) | Min drift: 0.01% (USDC)', txHash: '' },
  { time: '2 hr ago', agent: 'Execution' as AgentName, event: 'TX submitted: 0x2b1e...a8f4 (confirmed in 2.1s)', type: 'success', detail: 'Gas: 0.09 Gwei | Block: #4,290,998 | Chain: HSK L2', txHash: '0x2b1e...a8f4' },
  { time: '3 hr ago', agent: 'Decision' as AgentName, event: 'No rebalance needed — portfolio within tolerance', type: 'info', detail: 'All 5 assets within ±0.5% of target allocation', txHash: '' },
  { time: '4 hr ago', agent: 'Monitor' as AgentName, event: 'Chainlink feed refresh completed for 12 assets', type: 'info', detail: 'Latency: 340ms avg | All feeds healthy', txHash: '' },
  { time: '6 hr ago', agent: 'Settlement' as AgentName, event: 'Yield disbursement: $1,623.18 via Apex Settlement Router to 4 recipients', type: 'success', detail: 'Recipients: 4 institutional wallets | Currency: USDC', txHash: '0x1f8c...d923' },
  { time: '8 hr ago', agent: 'Execution' as AgentName, event: 'TX submitted: 0x9c2d...f871 (confirmed in 1.5s)', type: 'success', detail: 'Gas: 0.07 Gwei | Block: #4,290,812 | Chain: HSK L2', txHash: '0x9c2d...f871' },
];

const typeIcons: Record<string, typeof CheckCircle2> = {
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
};

const AgentActivity = () => {
  const [selectedAgent, setSelectedAgent] = useState<AgentName | null>(null);
  const [selectedLog, setSelectedLog] = useState<typeof fallbackLogs[0] | null>(null);
  const { data: liveLogs } = useQuery({
    queryKey: ['live-agent-logs'],
    queryFn: () => fetchAgentLogs(40),
    refetchInterval: 15000,
  });

  const logs = (liveLogs && liveLogs.length > 0)
    ? liveLogs.map((r): typeof fallbackLogs[0] => {
      const details = (r.details ?? {}) as Record<string, unknown>;
      const action = String(r.action || 'MONITOR_TICK');
      const inferredAgent: AgentName =
        action.includes('DECISION') ? 'Decision' :
          action.includes('EXEC') ? 'Execution' :
            action.includes('SETTLE') ? 'Settlement' : 'Monitor';
      const drifts = Array.isArray(details.drifts) ? details.drifts as Array<Record<string, unknown>> : [];
      const driftText = drifts
        .filter((d) => Boolean(d.rebalanceCandidate))
        .map((d) => `${String(d.symbol)} ${(Number(d.driftBps) / 100).toFixed(2)}%`)
        .slice(0, 3)
        .join(', ');
      return {
        time: `${formatDistanceToNowStrict(new Date(r.created_at))} ago`,
        agent: inferredAgent,
        event: action === 'REBALANCE_NEEDED' ? 'Rebalance needed' : action.replaceAll('_', ' '),
        type: action === 'REBALANCE_NEEDED' ? 'warning' : 'info',
        detail: driftText || 'Live pipeline event',
        txHash: typeof details.txHash === 'string' ? details.txHash : '',
      };
    })
    : fallbackLogs;

  const agentInfo = selectedAgent ? agentDetails[selectedAgent] : null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader title="Agent Activity" />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-[900px] mx-auto space-y-6">
              {/* Agent Status Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(['Monitor', 'Decision', 'Execution', 'Settlement'] as AgentName[]).map((agent, i) => (
                  <motion.button
                    key={agent}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => setSelectedAgent(agent)}
                    className="liquid-glass rounded-xl p-4 text-center hover:bg-foreground/[0.04] transition-colors cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2 group-hover:bg-primary/20 transition-colors">
                      <Zap className="w-4 h-4 text-primary" />
                    </div>
                    <p className="font-inter font-bold text-foreground text-[13px]">{agent}</p>
                    <span className="flex items-center justify-center gap-1 text-[10px] font-inter text-primary mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Active
                    </span>
                    <p className="font-inter text-[10px] text-muted-foreground mt-1.5">{agentDetails[agent].uptime} uptime</p>
                  </motion.button>
                ))}
              </div>

              {/* Activity Log */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="liquid-glass rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border">
                  <h3 className="font-inter font-bold text-foreground text-[15px]">Activity Log</h3>
                  <p className="font-inter text-[11px] text-muted-foreground mt-0.5">Click any entry to view details</p>
                </div>
                <div className="divide-y divide-border/50">
                  {logs.map((log, i) => {
                    const Icon = typeIcons[log.type] || Info;
                    return (
                      <button key={i} onClick={() => setSelectedLog(log)} className="w-full text-left px-5 py-4 hover:bg-foreground/[0.04] transition-colors cursor-pointer">
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 ${log.type === 'warning' ? 'text-destructive' : log.type === 'success' ? 'text-primary' : 'text-muted-foreground'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className={`font-inter text-[10px] uppercase tracking-widest font-bold ${
                                log.agent === 'Monitor' ? 'text-accent' : log.agent === 'Decision' ? 'text-primary' :
                                log.agent === 'Execution' ? 'text-primary' : 'text-accent'
                              }`}>{log.agent}</span>
                              <span className="flex items-center gap-1 font-inter text-[10px] text-muted-foreground">
                                <Clock className="w-3 h-3" /> {log.time}
                              </span>
                            </div>
                            <p className="font-inter text-[13px] text-foreground leading-relaxed">{log.event}</p>
                            <p className="font-inter text-[11px] text-muted-foreground mt-1">{log.detail}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </main>
        </div>
      </div>

      {/* Agent Detail Modal */}
      <AnimatePresence>
        {selectedAgent && agentInfo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4" onClick={() => setSelectedAgent(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()} className="liquid-glass rounded-2xl w-full max-w-lg border border-border">
              <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-inter font-bold text-foreground text-lg">{selectedAgent} Agent</h2>
                    <span className="flex items-center gap-1 text-[11px] font-inter text-primary"><span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Active · {agentInfo.uptime} uptime</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedAgent(null)}><X className="w-5 h-5 text-muted-foreground" /></Button>
              </div>
              <div className="p-6 space-y-5">
                <p className="font-inter text-[13px] text-muted-foreground leading-relaxed">{agentInfo.description}</p>
                <div className="grid grid-cols-2 gap-3">
                  {agentInfo.metrics.map(m => (
                    <div key={m.label} className="bg-secondary/30 rounded-lg p-3">
                      <p className="font-inter text-[10px] text-muted-foreground uppercase tracking-widest">{m.label}</p>
                      <p className="font-inter font-bold text-foreground text-[16px] mt-1">{m.value}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="font-inter font-bold text-foreground text-[13px] mb-2 flex items-center gap-2"><Settings className="w-3.5 h-3.5 text-primary/60" /> Responsibilities</h4>
                  <ul className="space-y-1.5">
                    {agentInfo.tasks.map(t => (
                      <li key={t} className="font-inter text-[12px] text-muted-foreground flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-primary" />{t}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="font-inter text-[11px] text-muted-foreground">Last action: {agentInfo.lastAction}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Log Detail Modal */}
      <AnimatePresence>
        {selectedLog && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4" onClick={() => setSelectedLog(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()} className="liquid-glass rounded-2xl w-full max-w-md border border-border">
              <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                <h2 className="font-inter font-bold text-foreground text-[15px]">Event Details</h2>
                <Button variant="ghost" size="icon" onClick={() => setSelectedLog(null)}><X className="w-5 h-5 text-muted-foreground" /></Button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <span className={`font-inter text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full ${
                    selectedLog.agent === 'Monitor' || selectedLog.agent === 'Settlement' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'
                  }`}>{selectedLog.agent}</span>
                  <span className="flex items-center gap-1 font-inter text-[11px] text-muted-foreground"><Clock className="w-3 h-3" />{selectedLog.time}</span>
                </div>
                <p className="font-inter text-[14px] text-foreground leading-relaxed">{selectedLog.event}</p>
                <div className="bg-secondary/30 rounded-lg p-4">
                  <p className="font-inter text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Details</p>
                  <p className="font-inter text-[12px] text-foreground">{selectedLog.detail}</p>
                </div>
                {selectedLog.txHash && (
                  <div className="flex items-center justify-between py-2 border-t border-border/30">
                    <span className="font-inter text-[12px] text-muted-foreground">TX Hash</span>
                    <span className="font-inter text-[12px] text-primary font-mono flex items-center gap-1 cursor-pointer hover:underline">
                      {selectedLog.txHash} <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SidebarProvider>
  );
};

export default AgentActivity;
