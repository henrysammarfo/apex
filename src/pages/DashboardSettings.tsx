import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Bell, Sliders, Key, X, CheckCircle2, Pencil, Sun, Moon, Send } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/hooks/useTheme';

interface Setting {
  label: string;
  value: string;
  desc: string;
  type: 'input' | 'toggle' | 'select';
  options?: string[];
}

interface SettingGroup {
  icon: typeof Sliders;
  title: string;
  description: string;
  settings: Setting[];
}

const initialGroups: SettingGroup[] = [
  {
    icon: Sliders, title: 'Agent Configuration',
    description: 'Configure thresholds, intervals, and behavior for each autonomous agent.',
    settings: [
      { label: 'Monitor Interval', value: '60s', desc: 'How often the Monitor Agent checks price feeds', type: 'select', options: ['15s', '30s', '60s', '120s', '300s'] },
      { label: 'Drift Threshold', value: '±1.0%', desc: 'Allocation drift before triggering rebalance', type: 'select', options: ['±0.5%', '±1.0%', '±1.5%', '±2.0%', '±3.0%'] },
      { label: 'Confidence Floor', value: '85%', desc: 'Minimum Decision Agent confidence to execute', type: 'select', options: ['75%', '80%', '85%', '90%', '95%'] },
      { label: 'Max Slippage', value: '0.5%', desc: 'Maximum acceptable slippage for execution', type: 'select', options: ['0.1%', '0.3%', '0.5%', '1.0%', '2.0%'] },
    ],
  },
  {
    icon: ShieldCheck, title: 'Risk Parameters',
    description: 'Set portfolio-wide risk limits and exposure caps.',
    settings: [
      { label: 'Max Single Asset', value: '40%', desc: 'Maximum allocation to any single asset', type: 'select', options: ['25%', '30%', '35%', '40%', '50%'] },
      { label: 'Min Cash Reserve', value: '5%', desc: 'Minimum USDC cash reserve maintained', type: 'select', options: ['3%', '5%', '8%', '10%', '15%'] },
      { label: 'Daily Loss Limit', value: '2.0%', desc: 'Maximum daily portfolio drawdown', type: 'select', options: ['1.0%', '1.5%', '2.0%', '3.0%', '5.0%'] },
      { label: 'Rebalance Cooldown', value: '15 min', desc: 'Minimum time between rebalances', type: 'select', options: ['5 min', '10 min', '15 min', '30 min', '60 min'] },
    ],
  },
  {
    icon: Bell, title: 'Notifications',
    description: 'Configure alerts for portfolio events and agent actions.',
    settings: [
      { label: 'Rebalance Alerts', value: 'Enabled', desc: 'Notify on every rebalance execution', type: 'toggle' },
      { label: 'Drift Warnings', value: 'Enabled', desc: 'Alert when assets approach drift threshold', type: 'toggle' },
      { label: 'Settlement Reports', value: 'Daily', desc: 'Yield settlement summary frequency', type: 'select', options: ['Disabled', 'Instant', 'Hourly', 'Daily', 'Weekly'] },
      { label: 'Risk Alerts', value: 'Immediate', desc: 'Notify on risk parameter breaches', type: 'select', options: ['Disabled', 'Immediate', 'Batched (5 min)', 'Batched (30 min)'] },
    ],
  },
  {
    icon: Key, title: 'Integrations',
    description: 'Manage connected services and API keys.',
    settings: [
      { label: 'Chainlink Feeds', value: 'Connected', desc: '12 price feeds active on HashKey Chain', type: 'toggle' },
      { label: 'OpenAI API', value: 'Connected', desc: 'GPT-4o for Decision Agent reasoning', type: 'toggle' },
      { label: 'HSP Settlement', value: 'Connected', desc: 'Cross-border yield distribution', type: 'toggle' },
      { label: 'NexaID KYC', value: 'Connected', desc: 'Institutional identity verification', type: 'toggle' },
    ],
  },
];

interface TelegramPref {
  label: string;
  desc: string;
  enabled: boolean;
}

const defaultTelegramPrefs: TelegramPref[] = [
  { label: 'Price Drift Detected', desc: 'Monitor Agent detects allocation drift beyond threshold', enabled: true },
  { label: 'Rebalance Executed', desc: 'Decision Agent approves and executes a portfolio rebalance', enabled: true },
  { label: 'Transaction Confirmed', desc: 'Execution Agent confirms on-chain TX settlement', enabled: true },
  { label: 'Yield Disbursement', desc: 'Settlement Agent completes yield distribution via HSP', enabled: false },
  { label: 'Risk Alert', desc: 'Any risk parameter breach (loss limit, exposure cap)', enabled: true },
  { label: 'Agent Status Change', desc: 'An agent goes offline or encounters an error', enabled: false },
];

const DashboardSettings = () => {
  const [groups, setGroups] = useState(initialGroups);
  const [editModal, setEditModal] = useState<{ groupIdx: number; settingIdx: number } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [saved, setSaved] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [telegramPrefs, setTelegramPrefs] = useState(defaultTelegramPrefs);
  const [telegramEnabled, setTelegramEnabled] = useState(true);
  const [telegramChatId, setTelegramChatId] = useState('');

  const toggleTelegramPref = (index: number) => {
    setTelegramPrefs(prev => prev.map((p, i) => i === index ? { ...p, enabled: !p.enabled } : p));
  };

  const openEdit = (gi: number, si: number) => {
    setEditValue(groups[gi].settings[si].value);
    setEditModal({ groupIdx: gi, settingIdx: si });
  };

  const saveEdit = () => {
    if (!editModal) return;
    const updated = [...groups];
    updated[editModal.groupIdx] = {
      ...updated[editModal.groupIdx],
      settings: updated[editModal.groupIdx].settings.map((s, i) =>
        i === editModal.settingIdx ? { ...s, value: editValue } : s
      ),
    };
    setGroups(updated);
    setEditModal(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleSetting = (gi: number, si: number) => {
    const updated = [...groups];
    const current = updated[gi].settings[si].value;
    updated[gi] = {
      ...updated[gi],
      settings: updated[gi].settings.map((s, i) =>
        i === si ? { ...s, value: current === 'Enabled' || current === 'Connected' ? 'Disabled' : (gi === 3 ? 'Connected' : 'Enabled') } : s
      ),
    };
    setGroups(updated);
  };

  const currentSetting = editModal ? groups[editModal.groupIdx].settings[editModal.settingIdx] : null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader title="Settings" />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-[900px] mx-auto space-y-6">
              {saved && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 bg-primary/10 text-primary rounded-lg px-4 py-2.5 font-inter text-[13px]">
                  <CheckCircle2 className="w-4 h-4" /> Settings saved successfully
                </motion.div>
              )}

              {/* Theme Toggle Card */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="liquid-glass rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    {theme === 'dark' ? <Moon className="w-4 h-4 text-primary" /> : <Sun className="w-4 h-4 text-primary" />}
                  </div>
                  <div>
                    <h3 className="font-inter font-bold text-foreground text-[15px]">Appearance</h3>
                    <p className="font-inter text-[11px] text-muted-foreground">Switch between dark and light themes</p>
                  </div>
                </div>
                <div className="px-5 py-4 flex items-center justify-between">
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="font-inter text-[13px] text-foreground font-medium">Theme</p>
                    <p className="font-inter text-[11px] text-muted-foreground">
                      Currently using <span className="text-primary font-medium">{theme === 'dark' ? 'Dark' : 'Light'}</span> mode
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => theme !== 'light' && toggleTheme()}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-inter transition-colors ${
                        theme === 'light' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5" /> Light
                    </button>
                    <button
                      onClick={() => theme !== 'dark' && toggleTheme()}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-inter transition-colors ${
                        theme === 'dark' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Moon className="w-3.5 h-3.5" /> Dark
                    </button>
                  </div>
                </div>
              </motion.div>

              {groups.map((group, gi) => (
                <motion.div
                  key={group.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (gi + 1) * 0.1 }}
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
                    {group.settings.map((s, si) => (
                      <div key={s.label} className="px-5 py-4 flex items-center justify-between hover:bg-foreground/[0.02] transition-colors">
                        <div className="flex-1 min-w-0 mr-4">
                          <p className="font-inter text-[13px] text-foreground font-medium">{s.label}</p>
                          <p className="font-inter text-[11px] text-muted-foreground">{s.desc}</p>
                        </div>
                        {s.type === 'toggle' ? (
                          <Switch
                            checked={s.value === 'Enabled' || s.value === 'Connected'}
                            onCheckedChange={() => toggleSetting(gi, si)}
                          />
                        ) : (
                          <button
                            onClick={() => openEdit(gi, si)}
                            className="flex items-center gap-2 font-inter text-[13px] text-primary font-mono bg-primary/10 rounded-md px-3 py-1 hover:bg-primary/20 transition-colors cursor-pointer"
                          >
                            {s.value}
                            <Pencil className="w-3 h-3 text-primary/60" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}

              {/* Telegram Notifications */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="liquid-glass rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Send className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-inter font-bold text-foreground text-[15px]">Telegram Alerts</h3>
                    <p className="font-inter text-[11px] text-muted-foreground">Receive real-time agent notifications via Telegram Bot</p>
                  </div>
                  <Switch checked={telegramEnabled} onCheckedChange={setTelegramEnabled} />
                </div>
                {telegramEnabled && (
                  <>
                    <div className="px-5 py-3 border-b border-border/50">
                      <Label className="text-foreground text-[10px] font-inter uppercase tracking-widest mb-1.5 block">Telegram Chat ID</Label>
                      <Input
                        value={telegramChatId}
                        onChange={(e) => setTelegramChatId(e.target.value)}
                        placeholder="e.g. 123456789"
                        className="bg-secondary/50 border-border h-8 text-[12px] font-mono"
                      />
                      <p className="font-inter text-[10px] text-muted-foreground mt-1">Send /start to @ApexVaultBot to get your Chat ID</p>
                    </div>
                    <div className="divide-y divide-border/50">
                      {telegramPrefs.map((pref, i) => (
                        <div key={pref.label} className="px-5 py-3 flex items-center justify-between hover:bg-foreground/[0.02] transition-colors">
                          <div className="flex-1 min-w-0 mr-4">
                            <p className="font-inter text-[13px] text-foreground font-medium">{pref.label}</p>
                            <p className="font-inter text-[11px] text-muted-foreground">{pref.desc}</p>
                          </div>
                          <Switch checked={pref.enabled} onCheckedChange={() => toggleTelegramPref(i)} />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          </main>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editModal && currentSetting && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4" onClick={() => setEditModal(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()} className="liquid-glass rounded-2xl w-full max-w-sm border border-border">
              <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                <h2 className="font-inter font-bold text-foreground text-[15px]">Edit {currentSetting.label}</h2>
                <Button variant="ghost" size="icon" onClick={() => setEditModal(null)}><X className="w-5 h-5 text-muted-foreground" /></Button>
              </div>
              <div className="p-6 space-y-4">
                <p className="font-inter text-[12px] text-muted-foreground">{currentSetting.desc}</p>

                {currentSetting.options ? (
                  <div className="space-y-2">
                    <Label className="text-foreground text-xs font-inter uppercase tracking-wider">Select Value</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {currentSetting.options.map(opt => (
                        <button
                          key={opt}
                          onClick={() => setEditValue(opt)}
                          className={`font-inter text-[12px] px-3 py-2 rounded-lg border transition-colors ${
                            editValue === opt
                              ? 'border-primary bg-primary/10 text-primary font-medium'
                              : 'border-border bg-secondary/30 text-muted-foreground hover:text-foreground hover:border-foreground/20'
                          }`}
                        >{opt}</button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label className="text-foreground text-xs font-inter uppercase tracking-wider">Value</Label>
                    <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} className="bg-secondary/50 border-border" />
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setEditModal(null)} className="flex-1 font-inter text-[12px]">Cancel</Button>
                  <Button onClick={saveEdit} className="flex-1 font-inter font-bold text-[12px]">Save</Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SidebarProvider>
  );
};

export default DashboardSettings;
