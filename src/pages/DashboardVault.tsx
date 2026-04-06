import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { CheckCircle2, AlertTriangle, PieChart, ShieldCheck, Sliders, Lock, TrendingUp } from 'lucide-react';

interface AssetAllocation {
  symbol: string;
  name: string;
  target: number;
  color: string;
}

const defaultAllocations: AssetAllocation[] = [
  { symbol: 'tUSTB', name: 'Tokenized US T-Bill', target: 35, color: 'hsl(var(--primary))' },
  { symbol: 'rREF', name: 'RWA Reference Index', target: 25, color: 'hsl(142 76% 36%)' },
  { symbol: 'cBOND', name: 'Corporate Bond Token', target: 20, color: 'hsl(217 91% 60%)' },
  { symbol: 'gGOLD', name: 'Tokenized Gold', target: 10, color: 'hsl(45 93% 47%)' },
  { symbol: 'USDC', name: 'Cash Reserve', target: 10, color: 'hsl(var(--muted-foreground))' },
];

const defaultRisk = {
  maxSingleAsset: 40,
  minCashReserve: 5,
  dailyLossLimit: 2,
  rebalanceCooldown: 15,
  autoRebalance: true,
  stopLossEnabled: true,
  driftThreshold: 1.0,
};

const DashboardVault = () => {
  const [allocations, setAllocations] = useState(defaultAllocations);
  const [risk, setRisk] = useState(defaultRisk);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const totalAllocation = allocations.reduce((sum, a) => sum + a.target, 0);
  const isValid = totalAllocation === 100;

  const updateAllocation = (index: number, value: number) => {
    const updated = [...allocations];
    updated[index] = { ...updated[index], target: value };
    setAllocations(updated);
  };

  const handleSave = () => {
    const errs: string[] = [];
    if (totalAllocation !== 100) errs.push(`Allocation must total 100% (currently ${totalAllocation}%)`);
    const cashAsset = allocations.find(a => a.symbol === 'USDC');
    if (cashAsset && cashAsset.target < risk.minCashReserve) errs.push(`USDC reserve (${cashAsset.target}%) is below minimum (${risk.minCashReserve}%)`);
    allocations.forEach(a => {
      if (a.target > risk.maxSingleAsset) errs.push(`${a.symbol} (${a.target}%) exceeds max single asset limit (${risk.maxSingleAsset}%)`);
    });
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    setErrors([]);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader title="Vault Configuration" />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-[900px] mx-auto space-y-6">
              {saved && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 bg-primary/10 text-primary rounded-lg px-4 py-2.5 font-inter text-[13px]">
                  <CheckCircle2 className="w-4 h-4" /> Vault configuration saved successfully
                </motion.div>
              )}
              {errors.length > 0 && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-destructive/10 text-destructive rounded-lg px-4 py-2.5 space-y-1">
                  {errors.map((err, i) => (
                    <p key={i} className="flex items-center gap-2 font-inter text-[13px]">
                      <AlertTriangle className="w-4 h-4 shrink-0" /> {err}
                    </p>
                  ))}
                </motion.div>
              )}

              {/* Target Allocation */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="liquid-glass rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <PieChart className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-inter font-bold text-foreground text-[15px]">Target Allocation</h3>
                    <p className="font-inter text-[11px] text-muted-foreground">Set your desired portfolio distribution across vault assets</p>
                  </div>
                  <div className="ml-auto">
                    <span className={`font-inter font-bold text-sm px-3 py-1 rounded-full ${isValid ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                      {totalAllocation}%
                    </span>
                  </div>
                </div>

                {/* Visual bar */}
                <div className="px-5 pt-4 pb-2">
                  <div className="h-3 rounded-full overflow-hidden flex bg-secondary/50">
                    {allocations.map((a, i) => (
                      <div key={i} style={{ width: `${a.target}%`, backgroundColor: a.color }} className="transition-all duration-300 first:rounded-l-full last:rounded-r-full" />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {allocations.map((a, i) => (
                      <span key={i} className="flex items-center gap-1.5 font-inter text-[10px] text-muted-foreground">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: a.color }} />
                        {a.symbol} {a.target}%
                      </span>
                    ))}
                  </div>
                </div>

                <div className="divide-y divide-border/50">
                  {allocations.map((asset, index) => (
                    <div key={asset.symbol} className="px-5 py-4 hover:bg-foreground/[0.02] transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: asset.color }} />
                          <span className="font-inter text-[13px] text-foreground font-medium">{asset.symbol}</span>
                          <span className="font-inter text-[11px] text-muted-foreground">— {asset.name}</span>
                        </div>
                        <span className="font-inter text-[13px] font-mono text-primary font-bold">{asset.target}%</span>
                      </div>
                      <Slider
                        value={[asset.target]}
                        onValueChange={([val]) => updateAllocation(index, val)}
                        min={0}
                        max={60}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Risk Thresholds */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="liquid-glass rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-inter font-bold text-foreground text-[15px]">Risk Thresholds</h3>
                    <p className="font-inter text-[11px] text-muted-foreground">Define risk parameters for the vault's autonomous agents</p>
                  </div>
                </div>
                <div className="divide-y divide-border/50">
                  <div className="px-5 py-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-inter text-[13px] text-foreground font-medium">Max Single Asset Exposure</p>
                        <p className="font-inter text-[11px] text-muted-foreground">No single asset may exceed this % of total portfolio</p>
                      </div>
                      <span className="font-inter text-[13px] font-mono text-primary font-bold">{risk.maxSingleAsset}%</span>
                    </div>
                    <Slider value={[risk.maxSingleAsset]} onValueChange={([v]) => setRisk({ ...risk, maxSingleAsset: v })} min={20} max={60} step={5} />
                  </div>
                  <div className="px-5 py-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-inter text-[13px] text-foreground font-medium">Minimum Cash Reserve (USDC)</p>
                        <p className="font-inter text-[11px] text-muted-foreground">Always maintain this % in liquid USDC</p>
                      </div>
                      <span className="font-inter text-[13px] font-mono text-primary font-bold">{risk.minCashReserve}%</span>
                    </div>
                    <Slider value={[risk.minCashReserve]} onValueChange={([v]) => setRisk({ ...risk, minCashReserve: v })} min={2} max={20} step={1} />
                  </div>
                  <div className="px-5 py-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-inter text-[13px] text-foreground font-medium">Daily Loss Limit</p>
                        <p className="font-inter text-[11px] text-muted-foreground">Halt trading if portfolio drops more than this % in 24h</p>
                      </div>
                      <span className="font-inter text-[13px] font-mono text-primary font-bold">{risk.dailyLossLimit}%</span>
                    </div>
                    <Slider value={[risk.dailyLossLimit]} onValueChange={([v]) => setRisk({ ...risk, dailyLossLimit: v })} min={0.5} max={5} step={0.5} />
                  </div>
                  <div className="px-5 py-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-inter text-[13px] text-foreground font-medium">Drift Threshold</p>
                        <p className="font-inter text-[11px] text-muted-foreground">Trigger rebalance when allocation drifts by ±this %</p>
                      </div>
                      <span className="font-inter text-[13px] font-mono text-primary font-bold">±{risk.driftThreshold}%</span>
                    </div>
                    <Slider value={[risk.driftThreshold]} onValueChange={([v]) => setRisk({ ...risk, driftThreshold: v })} min={0.5} max={3} step={0.25} />
                  </div>
                </div>
              </motion.div>

              {/* Automation Controls */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="liquid-glass rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sliders className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-inter font-bold text-foreground text-[15px]">Automation</h3>
                    <p className="font-inter text-[11px] text-muted-foreground">Agent behavior and automatic risk controls</p>
                  </div>
                </div>
                <div className="divide-y divide-border/50">
                  <div className="px-5 py-4 flex items-center justify-between">
                    <div>
                      <p className="font-inter text-[13px] text-foreground font-medium flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-primary" /> Auto-Rebalance
                      </p>
                      <p className="font-inter text-[11px] text-muted-foreground">Automatically rebalance when drift exceeds threshold</p>
                    </div>
                    <Switch checked={risk.autoRebalance} onCheckedChange={(v) => setRisk({ ...risk, autoRebalance: v })} />
                  </div>
                  <div className="px-5 py-4 flex items-center justify-between">
                    <div>
                      <p className="font-inter text-[13px] text-foreground font-medium flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-destructive" /> Stop-Loss Protection
                      </p>
                      <p className="font-inter text-[11px] text-muted-foreground">Pause all agents if daily loss limit is breached</p>
                    </div>
                    <Switch checked={risk.stopLossEnabled} onCheckedChange={(v) => setRisk({ ...risk, stopLossEnabled: v })} />
                  </div>
                  <div className="px-5 py-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-inter text-[13px] text-foreground font-medium">Rebalance Cooldown</p>
                        <p className="font-inter text-[11px] text-muted-foreground">Minimum minutes between auto-rebalances</p>
                      </div>
                      <span className="font-inter text-[13px] font-mono text-primary font-bold">{risk.rebalanceCooldown} min</span>
                    </div>
                    <Slider value={[risk.rebalanceCooldown]} onValueChange={([v]) => setRisk({ ...risk, rebalanceCooldown: v })} min={5} max={60} step={5} />
                  </div>
                </div>
              </motion.div>

              {/* Save */}
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => { setAllocations(defaultAllocations); setRisk(defaultRisk); setErrors([]); }} className="font-inter text-[12px]">
                  Reset to Defaults
                </Button>
                <Button onClick={handleSave} className="font-inter font-bold text-[12px] px-8">
                  {saved ? <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Saved</span> : 'Save Configuration'}
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardVault;
