import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { motion } from 'framer-motion';
import { Bot, Clock, CheckCircle2, AlertTriangle, Info, Zap } from 'lucide-react';

const logs = [
  { time: '2 min ago', agent: 'Monitor', event: 'Price drift detected on cBOND (+1.2% above threshold)', type: 'warning', detail: 'cBOND price: $102.34 | Target: $101.10 | Threshold: ±1.0%' },
  { time: '5 min ago', agent: 'Decision', event: 'Rebalance approved: sell 0.8% cBOND → buy tUSTB', type: 'success', detail: 'Confidence: 92% | Risk delta: -0.04 | Expected slippage: 0.02%' },
  { time: '5 min ago', agent: 'Execution', event: 'TX submitted: 0x7a3f...c291 (confirmed in 1.8s)', type: 'success', detail: 'Gas: 0.08 Gwei | Block: #4,291,037 | Chain: HSK L2' },
  { time: '12 min ago', agent: 'Settlement', event: 'Yield disbursement: $1,847.32 via HSP to 4 recipients', type: 'success', detail: 'Recipients: 4 institutional wallets | Currency: USDC | KYC: verified' },
  { time: '1 hr ago', agent: 'Monitor', event: 'All assets within allocation thresholds', type: 'info', detail: 'Max drift: 0.3% (gGLD) | Min drift: 0.01% (USDC)' },
  { time: '2 hr ago', agent: 'Execution', event: 'TX submitted: 0x2b1e...a8f4 (confirmed in 2.1s)', type: 'success', detail: 'Gas: 0.09 Gwei | Block: #4,290,998 | Chain: HSK L2' },
  { time: '3 hr ago', agent: 'Decision', event: 'No rebalance needed — portfolio within tolerance', type: 'info', detail: 'All 5 assets within ±0.5% of target allocation' },
  { time: '4 hr ago', agent: 'Monitor', event: 'Chainlink feed refresh completed for 12 assets', type: 'info', detail: 'Latency: 340ms avg | All feeds healthy' },
  { time: '6 hr ago', agent: 'Settlement', event: 'Yield disbursement: $1,623.18 via HSP to 4 recipients', type: 'success', detail: 'Recipients: 4 institutional wallets | Currency: USDC' },
  { time: '8 hr ago', agent: 'Execution', event: 'TX submitted: 0x9c2d...f871 (confirmed in 1.5s)', type: 'success', detail: 'Gas: 0.07 Gwei | Block: #4,290,812 | Chain: HSK L2' },
];

const agentColors: Record<string, string> = {
  Monitor: 'text-accent',
  Decision: 'text-primary',
  Execution: 'text-primary',
  Settlement: 'text-accent',
};

const typeIcons: Record<string, typeof CheckCircle2> = {
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
};

const AgentActivity = () => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 flex items-center border-b border-border px-4 shrink-0">
          <SidebarTrigger className="text-muted-foreground" />
          <div className="h-5 w-px bg-border mx-3" />
          <Bot className="w-4 h-4 text-primary mr-2" />
          <h1 className="font-inter font-bold text-foreground text-sm">Agent Activity</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[900px] mx-auto space-y-6">
            {/* Agent Status */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Monitor', 'Decision', 'Execution', 'Settlement'].map((agent, i) => (
                <motion.div
                  key={agent}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="liquid-glass rounded-xl p-4 text-center"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <p className="font-inter font-bold text-foreground text-[13px]">{agent}</p>
                  <span className="flex items-center justify-center gap-1 text-[10px] font-inter text-primary mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Active
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Activity Log */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="liquid-glass rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h3 className="font-inter font-bold text-foreground text-[15px]">Activity Log</h3>
              </div>
              <div className="divide-y divide-border/50">
                {logs.map((log, i) => {
                  const Icon = typeIcons[log.type] || Info;
                  return (
                    <div key={i} className="px-5 py-4 hover:bg-foreground/[0.02] transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 ${log.type === 'warning' ? 'text-destructive' : log.type === 'success' ? 'text-primary' : 'text-muted-foreground'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`font-inter text-[10px] uppercase tracking-widest font-bold ${agentColors[log.agent] || 'text-muted-foreground'}`}>
                              {log.agent}
                            </span>
                            <span className="flex items-center gap-1 font-inter text-[10px] text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {log.time}
                            </span>
                          </div>
                          <p className="font-inter text-[13px] text-foreground leading-relaxed">{log.event}</p>
                          <p className="font-inter text-[11px] text-muted-foreground mt-1">{log.detail}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  </SidebarProvider>
);

export default AgentActivity;
