import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Eye, Layers, ShieldCheck, Wallet, Settings, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface TourStep {
  icon: typeof Eye;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  accent: string;
}

const steps: TourStep[] = [
  {
    icon: Eye,
    title: 'Welcome to APEX Vault',
    subtitle: 'Your AI-Powered RWA Portfolio',
    description: 'APEX is an autonomous portfolio engine that manages tokenized real-world assets on HashKey Chain — treasury bills, real estate, bonds, and gold — using a coordinated swarm of AI agents.',
    details: [
      'Fully autonomous portfolio management',
      'Built on HashKey Chain (Chain ID 133)',
      'Institutional-grade compliance via NexaID',
      'Cross-border settlement through HSP',
    ],
    accent: 'from-primary/20 to-primary/5',
  },
  {
    icon: Layers,
    title: 'The 4-Agent Architecture',
    subtitle: 'Monitor → Decision → Execution → Settlement',
    description: 'Your portfolio is managed by four specialized agents working in a continuous loop, each with a distinct role in the autonomous rebalancing pipeline.',
    details: [
      'Monitor Agent — Watches Chainlink price feeds for allocation drift every 60s',
      'Decision Agent — Uses GPT-4o reasoning to evaluate rebalance trades above 85% confidence',
      'Execution Agent — Submits on-chain transactions with slippage protection on HashKey L2',
      'Settlement Agent — Handles yield distribution and cross-border payouts via HSP',
    ],
    accent: 'from-primary/20 to-primary/5',
  },
  {
    icon: ShieldCheck,
    title: 'Risk Parameters',
    subtitle: 'Guard-Rails Built In',
    description: 'Before any trade executes, it passes through multiple risk checks. You can configure all thresholds from the Settings page.',
    details: [
      'Max 40% allocation to any single asset',
      '5% minimum USDC cash reserve at all times',
      '2% daily loss limit with automatic stop-loss',
      '15-minute cooldown between rebalance events',
    ],
    accent: 'from-primary/20 to-primary/5',
  },
  {
    icon: Wallet,
    title: 'Depositing Funds',
    subtitle: 'USDC · HSK · ETH Supported',
    description: 'Deposit assets into your vault from the Portfolio page. Funds are automatically allocated across tokenized RWAs based on your target configuration.',
    details: [
      'Requires NexaID verification for compliance',
      'Choose USDC, HSK, or ETH as deposit asset',
      'Preview auto-allocation before confirming',
      'Transactions settle on HashKey Chain L2',
    ],
    accent: 'from-primary/20 to-primary/5',
  },
  {
    icon: Settings,
    title: 'Configure Your Vault',
    subtitle: 'Set Targets Before Your First Deposit',
    description: 'Head to Vault Config to set your target allocation percentages across the five asset classes. The Decision Agent uses these targets as its rebalancing benchmark.',
    details: [
      'Adjust tUSTB, rREF, cBOND, gGLD, USDC weights',
      'Set risk thresholds (exposure caps, loss limits)',
      'Enable auto-rebalance and stop-loss toggles',
      'All changes take effect on the next agent cycle',
    ],
    accent: 'from-primary/20 to-primary/5',
  },
  {
    icon: Zap,
    title: 'You\'re Ready!',
    subtitle: 'Start Managing Your Portfolio',
    description: 'Your vault is ready. Configure your target allocations, deposit funds, and let the agents handle the rest. You can monitor everything from this dashboard.',
    details: [
      'Portfolio — View holdings, deposit & withdraw',
      'Agents — Real-time agent status & activity',
      'Transactions — Full on-chain TX history',
      'Settings — Agent config, risk params, Telegram alerts',
    ],
    accent: 'from-primary/20 to-primary/5',
  },
];

const STORAGE_KEY = 'apex_onboarding_complete';

export const useOnboarding = () => {
  const [show, setShow] = useState(() => {
    return !localStorage.getItem(STORAGE_KEY);
  });

  const complete = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setShow(false);
  };

  const restart = () => {
    localStorage.removeItem(STORAGE_KEY);
    setShow(true);
  };

  return { showOnboarding: show, completeOnboarding: complete, restartOnboarding: restart };
};

interface OnboardingTourProps {
  onComplete: () => void;
}

const OnboardingTour = ({ onComplete }: OnboardingTourProps) => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const step = steps[current];
  const isLast = current === steps.length - 1;
  const Icon = step.icon;

  const handleFinish = () => {
    onComplete();
    navigate('/dashboard/vault');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-background/85 backdrop-blur-md p-4"
    >
      <motion.div
        key={current}
        initial={{ opacity: 0, scale: 0.95, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -24 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="liquid-glass rounded-2xl w-full max-w-lg border border-border overflow-hidden"
      >
        {/* Header */}
        <div className={`px-6 pt-6 pb-4 bg-gradient-to-br ${step.accent} relative`}>
          <button
            onClick={onComplete}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-inter text-[10px] uppercase tracking-[0.15em] text-primary font-semibold">
                Step {current + 1} of {steps.length}
              </p>
              <h2 className="font-inter font-bold text-foreground text-[18px] leading-tight">{step.title}</h2>
            </div>
          </div>
          <p className="font-inter text-[13px] text-primary/80 font-medium">{step.subtitle}</p>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <p className="font-inter text-[13px] text-muted-foreground leading-relaxed">{step.description}</p>

          <div className="space-y-2.5">
            {step.details.map((detail, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}
                className="flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span className="font-inter text-[12px] text-foreground/80 leading-snug">{detail}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Progress & Nav */}
        <div className="px-6 pb-5 space-y-4">
          {/* Progress dots */}
          <div className="flex items-center justify-center gap-1.5">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current
                    ? 'w-6 bg-primary'
                    : i < current
                    ? 'w-1.5 bg-primary/40'
                    : 'w-1.5 bg-muted-foreground/20'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            {current > 0 && (
              <Button
                variant="outline"
                onClick={() => setCurrent(c => c - 1)}
                className="flex-1 font-inter text-[12px] gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </Button>
            )}
            {isLast ? (
              <Button
                onClick={handleFinish}
                className="flex-1 font-inter font-bold text-[12px] gap-1.5"
              >
                Configure Vault <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            ) : (
              <Button
                onClick={() => setCurrent(c => c + 1)}
                className="flex-1 font-inter font-bold text-[12px] gap-1.5"
              >
                Next <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>

          <button
            onClick={onComplete}
            className="w-full text-center font-inter text-[11px] text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip tour
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OnboardingTour;
