import { ArrowDown, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const integrationVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const layers = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ),
    label: 'Layer 1',
    title: 'Monitor Agent',
    description: 'Watches Chainlink price feeds every 60s. Detects drift from target allocation.',
    tech: 'Chainlink Oracles',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.58-3.25 3.93" />
        <path d="M8.25 9.93A4.001 4.001 0 0 1 12 2" />
        <path d="M12 9v3l2 1" />
        <circle cx="12" cy="18" r="4" />
        <path d="M12 14v-1" />
        <path d="M9 21.5 6 19" />
        <path d="M15 21.5 18 19" />
      </svg>
    ),
    label: 'Layer 2',
    title: 'Decision Agent',
    description: 'Analyzes portfolio state, risk thresholds & market conditions. Outputs structured rebalancing decisions.',
    tech: 'OpenAI',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    label: 'Layer 3',
    title: 'Execution Agent',
    description: 'Submits on-chain transactions to PortfolioVault smart contract. Signs via vault authority.',
    tech: 'HashKey Chain',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M7 15h0M2 9.5h20" />
      </svg>
    ),
    label: 'Layer 4',
    title: 'Settlement Agent',
    description: 'Routes yield payments through HSP for compliant cross-border settlement.',
    tech: 'HSP + NexaID',
  },
];

const integrations = [
  {
    name: 'Chainlink',
    role: 'Price Feeds & CCIP',
    desc: 'Real-time oracle data for RWA asset prices on HashKey Chain',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M12 7l4 2.25v4.5L12 16l-4-2.25v-4.5L12 7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'HSP',
    role: 'Payment Settlement',
    desc: 'Compliant cross-border yield distribution via HashKey Settlement Protocol',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'NexaID',
    role: 'Identity & KYC',
    desc: 'On-chain identity verification for institutional investor accreditation',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'OpenAI',
    role: 'AI Reasoning',
    desc: 'Portfolio analysis, risk assessment & autonomous rebalancing decisions',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
];

const ArchitectureSection = () => {
  return (
    <section id="architecture" className="relative z-10 bg-background py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto mb-20">
        <p className="font-jakarta font-bold text-[11px] uppercase tracking-[0.2em] text-primary mb-4">
          System Architecture
        </p>
        <h2 className="font-inter font-extrabold uppercase tracking-tight text-foreground text-[32px] md:text-[48px] leading-[1.1] mb-6">
          4 AUTONOMOUS AGENT LAYERS<span className="text-primary">.</span>
        </h2>
        <p className="font-inter text-[14px] text-muted-foreground max-w-[600px] leading-relaxed">
          Each layer operates independently — monitoring, reasoning, executing, and settling — with no human in the loop after initial configuration.
        </p>
      </div>

      {/* Agent Pipeline */}
      <div className="max-w-4xl mx-auto mb-24">
        <div className="flex flex-col gap-0">
          {layers.map((layer, i) => (
            <div key={layer.label} className="flex flex-col items-center">
              <div className="liquid-glass rounded-xl p-6 w-full flex items-start gap-5 group hover:bg-foreground/[0.02] transition-colors">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {layer.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-inter text-[11px] text-muted-foreground uppercase tracking-widest">{layer.label}</span>
                    <span className="h-px flex-1 bg-border" />
                    <span className="font-inter text-[11px] text-primary/80 tracking-wide">{layer.tech}</span>
                  </div>
                  <h3 className="font-inter font-bold text-foreground text-[18px] mb-1">{layer.title}</h3>
                  <p className="font-inter text-[13px] text-muted-foreground leading-relaxed">{layer.description}</p>
                </div>
              </div>
              {i < layers.length - 1 && (
                <div className="flex flex-col items-center py-2">
                  <div className="w-px h-6 bg-primary/30" />
                  <ArrowDown size={14} className="text-primary/50" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Integration Grid */}
      <div className="max-w-6xl mx-auto">
        <p className="font-jakarta font-bold text-[11px] uppercase tracking-[0.2em] text-primary mb-8">
          Ecosystem Integrations
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {integrations.map((item) => (
            <div
              key={item.name}
              className="liquid-glass rounded-xl p-5 flex flex-col justify-between min-h-[180px] group hover:bg-foreground/[0.02] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/15 transition-colors duration-300">
                    {item.icon}
                  </div>
                  <ExternalLink size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h4 className="font-inter font-bold text-foreground text-[16px] mb-1">{item.name}</h4>
                <span className="inline-block font-inter text-[10px] uppercase tracking-widest text-primary bg-primary/10 rounded-full px-2.5 py-0.5 mb-3">
                  {item.role}
                </span>
              </div>
              <p className="font-inter text-[12px] text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArchitectureSection;
