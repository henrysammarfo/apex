import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, ShieldCheck, Bell, Sliders, Key } from 'lucide-react';

const settingGroups = [
  {
    icon: Sliders,
    title: 'Agent Configuration',
    description: 'Configure thresholds, intervals, and behavior for each autonomous agent.',
    settings: [
      { label: 'Monitor Interval', value: '60s', desc: 'How often the Monitor Agent checks price feeds' },
      { label: 'Drift Threshold', value: '±1.0%', desc: 'Allocation drift before triggering rebalance' },
      { label: 'Confidence Floor', value: '85%', desc: 'Minimum Decision Agent confidence to execute' },
      { label: 'Max Slippage', value: '0.5%', desc: 'Maximum acceptable slippage for execution' },
    ],
  },
  {
    icon: ShieldCheck,
    title: 'Risk Parameters',
    description: 'Set portfolio-wide risk limits and exposure caps.',
    settings: [
      { label: 'Max Single Asset', value: '40%', desc: 'Maximum allocation to any single asset' },
      { label: 'Min Cash Reserve', value: '5%', desc: 'Minimum USDC cash reserve maintained' },
      { label: 'Daily Loss Limit', value: '2.0%', desc: 'Maximum daily portfolio drawdown' },
      { label: 'Rebalance Cooldown', value: '15 min', desc: 'Minimum time between rebalances' },
    ],
  },
  {
    icon: Bell,
    title: 'Notifications',
    description: 'Configure alerts for portfolio events and agent actions.',
    settings: [
      { label: 'Rebalance Alerts', value: 'Enabled', desc: 'Notify on every rebalance execution' },
      { label: 'Drift Warnings', value: 'Enabled', desc: 'Alert when assets approach drift threshold' },
      { label: 'Settlement Reports', value: 'Daily', desc: 'Yield settlement summary frequency' },
      { label: 'Risk Alerts', value: 'Immediate', desc: 'Notify on risk parameter breaches' },
    ],
  },
  {
    icon: Key,
    title: 'Integrations',
    description: 'Manage connected services and API keys.',
    settings: [
      { label: 'Chainlink Feeds', value: 'Connected', desc: '12 price feeds active on HashKey Chain' },
      { label: 'OpenAI API', value: 'Connected', desc: 'GPT-4o for Decision Agent reasoning' },
      { label: 'HSP Settlement', value: 'Connected', desc: 'Cross-border yield distribution' },
      { label: 'NexaID KYC', value: 'Connected', desc: 'Institutional identity verification' },
    ],
  },
];

const DashboardSettings = () => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 flex items-center border-b border-border px-4 shrink-0">
          <SidebarTrigger className="text-muted-foreground" />
          <div className="h-5 w-px bg-border mx-3" />
          <SettingsIcon className="w-4 h-4 text-primary mr-2" />
          <h1 className="font-inter font-bold text-foreground text-sm">Settings</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[900px] mx-auto space-y-6">
            {settingGroups.map((group, gi) => (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: gi * 0.1 }}
                className="liquid-glass rounded-xl overflow-hidden"
              >
                <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <group.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-inter font-bold text-foreground text-[15px]">{group.title}</h3>
                    <p className="font-inter text-[11px] text-muted-foreground">{group.description}</p>
                  </div>
                </div>
                <div className="divide-y divide-border/50">
                  {group.settings.map((s) => (
                    <div key={s.label} className="px-5 py-4 flex items-center justify-between hover:bg-foreground/[0.02] transition-colors">
                      <div>
                        <p className="font-inter text-[13px] text-foreground font-medium">{s.label}</p>
                        <p className="font-inter text-[11px] text-muted-foreground">{s.desc}</p>
                      </div>
                      <span className="font-inter text-[13px] text-primary font-mono bg-primary/10 rounded-md px-3 py-1">
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </div>
  </SidebarProvider>
);

export default DashboardSettings;
