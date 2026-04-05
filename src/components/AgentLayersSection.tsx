import { motion } from 'framer-motion';
import { Monitor, Brain, Zap, CreditCard } from 'lucide-react';

const agents = [
  {
    icon: Monitor,
    layer: '01',
    title: 'Monitor Agent',
    subtitle: 'Chainlink Oracles',
    description: 'Watches price feeds every 60 seconds. Detects when any RWA asset drifts beyond configurable allocation thresholds. All observations logged immutably.',
    stats: [
      { label: 'Interval', value: '60s' },
      { label: 'Feeds', value: '12+' },
      { label: 'Uptime', value: '99.9%' },
    ],
  },
  {
    icon: Brain,
    layer: '02',
    title: 'Decision Agent',
    subtitle: 'OpenAI Reasoning',
    description: 'Analyzes portfolio state, risk thresholds, and market conditions. Outputs structured rebalancing decisions with confidence scores and full reasoning chains.',
    stats: [
      { label: 'Latency', value: '<2s' },
      { label: 'Accuracy', value: '94%' },
      { label: 'Model', value: 'GPT-4o' },
    ],
  },
  {
    icon: Zap,
    layer: '03',
    title: 'Execution Agent',
    subtitle: 'HashKey Chain',
    description: 'Submits on-chain transactions to the PortfolioVault smart contract. Signs using vault authority keypair. Every action is verifiable on-chain.',
    stats: [
      { label: 'Finality', value: '~2s' },
      { label: 'Gas', value: '0.1 Gwei' },
      { label: 'Chain', value: 'HSK L2' },
    ],
  },
  {
    icon: CreditCard,
    layer: '04',
    title: 'Settlement Agent',
    subtitle: 'HSP + NexaID',
    description: 'Routes yield payments through HSP for compliant cross-border settlement. Handles multi-currency disbursement to KYC-verified institutional recipients.',
    stats: [
      { label: 'Settlement', value: 'T+0' },
      { label: 'Currencies', value: '6+' },
      { label: 'KYC', value: 'NexaID' },
    ],
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const AgentLayersSection = () => {
  return (
    <section id="agents" className="relative z-10 py-32 px-6 md:px-12 lg:px-24">
      {/* Subtle glow behind section */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cn-glow/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="font-jakarta font-bold text-[11px] uppercase tracking-[0.2em] text-primary mb-4">
            Agent Architecture
          </p>
          <h2 className="font-inter font-extrabold uppercase tracking-tight text-foreground text-[32px] md:text-[48px] leading-[1.1] mb-6">
            FOUR LAYERS<span className="text-primary">.</span> ZERO HUMANS<span className="text-primary">.</span>
          </h2>
          <p className="font-inter text-[14px] text-muted-foreground max-w-[520px] leading-relaxed">
            Each agent operates autonomously — chained together in a pipeline that transforms raw price data into executed trades and settled payments.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {agents.map((agent, i) => (
            <motion.div
              key={agent.layer}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={cardVariants}
              className="liquid-glass rounded-2xl p-7 group hover:bg-foreground/[0.03] transition-all duration-500 relative overflow-hidden"
            >
              {/* Layer number watermark */}
              <span className="absolute -right-2 -top-4 font-inter font-extrabold text-[120px] text-foreground/[0.03] leading-none select-none pointer-events-none">
                {agent.layer}
              </span>

              <div className="relative z-10">
                {/* Icon + Label */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-500">
                    <agent.icon size={20} className="text-primary" />
                  </div>
                  <div>
                    <span className="font-inter text-[10px] text-muted-foreground uppercase tracking-widest block">
                      Layer {agent.layer}
                    </span>
                    <span className="font-inter text-[10px] text-primary/70 tracking-wide">
                      {agent.subtitle}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-inter font-bold text-foreground text-[20px] mb-3">
                  {agent.title}
                </h3>

                {/* Description */}
                <p className="font-inter text-[13px] text-muted-foreground leading-relaxed mb-6">
                  {agent.description}
                </p>

                {/* Stats */}
                <div className="flex gap-6">
                  {agent.stats.map((stat) => (
                    <div key={stat.label}>
                      <p className="font-inter font-bold text-foreground text-[16px]">{stat.value}</p>
                      <p className="font-inter text-[10px] text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AgentLayersSection;
