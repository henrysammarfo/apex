import { Monitor, Brain, Zap, CreditCard, ArrowDown, ExternalLink } from 'lucide-react';

const layers = [
  {
    icon: Monitor,
    label: 'Layer 1',
    title: 'Monitor Agent',
    description: 'Watches Chainlink price feeds every 60s. Detects drift from target allocation.',
    tech: 'Chainlink Oracles',
    color: 'text-primary',
  },
  {
    icon: Brain,
    label: 'Layer 2',
    title: 'Decision Agent',
    description: 'Analyzes portfolio state, risk thresholds & market conditions. Outputs structured rebalancing decisions.',
    tech: 'OpenAI',
    color: 'text-primary',
  },
  {
    icon: Zap,
    label: 'Layer 3',
    title: 'Execution Agent',
    description: 'Submits on-chain transactions to PortfolioVault smart contract. Signs via vault authority.',
    tech: 'HashKey Chain',
    color: 'text-primary',
  },
  {
    icon: CreditCard,
    label: 'Layer 4',
    title: 'Settlement Agent',
    description: 'Routes yield payments through HSP for compliant cross-border settlement.',
    tech: 'HSP + NexaID',
    color: 'text-primary',
  },
];

const integrations = [
  { name: 'Chainlink', role: 'Price Feeds & CCIP', desc: 'Real-time oracle data for RWA asset prices on HashKey Chain' },
  { name: 'HSP', role: 'Payment Settlement', desc: 'Compliant cross-border yield distribution via HashKey Settlement Protocol' },
  { name: 'NexaID', role: 'Identity & KYC', desc: 'On-chain identity verification for institutional investor accreditation' },
  { name: 'OpenAI', role: 'AI Reasoning', desc: 'Portfolio analysis, risk assessment & autonomous rebalancing decisions' },
];

const ArchitectureSection = () => {
  return (
    <section id="architecture" className="relative z-10 bg-background py-24 px-6 md:px-12 lg:px-24">
      {/* Section Header */}
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
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <layer.icon size={22} className="text-primary" />
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
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-inter font-bold text-foreground text-[16px]">{item.name}</h4>
                  <ExternalLink size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
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
