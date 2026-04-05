import { motion } from 'framer-motion';

const agents = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ),
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
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
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
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M7 15h0M2 9.5h20" />
      </svg>
    ),
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
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cn-glow/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative">
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
              <span className="absolute -right-2 -top-4 font-inter font-extrabold text-[120px] text-foreground/[0.03] leading-none select-none pointer-events-none">
                {agent.layer}
              </span>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-500 text-primary">
                    {agent.icon}
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

                <h3 className="font-inter font-bold text-foreground text-[20px] mb-3">
                  {agent.title}
                </h3>

                <p className="font-inter text-[13px] text-muted-foreground leading-relaxed mb-6">
                  {agent.description}
                </p>

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
