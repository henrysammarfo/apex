import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Globe, ArrowRight, Check } from 'lucide-react';

const marketStats = [
  { icon: TrendingUp, value: '$14B+', label: 'Tokenized RWA Market', sub: '66% YoY growth' },
  { icon: Users, value: '870K+', label: 'HSK Wallet Addresses', sub: 'Growing ecosystem' },
  { icon: DollarSign, value: '$50M', label: 'Atlas Grant Pool', sub: 'Ecosystem funding' },
  { icon: Globe, value: '0', label: 'Competitors on HSK', sub: 'First-mover advantage' },
];

const tiers = [
  {
    name: 'Explorer',
    price: 'Free',
    period: '',
    description: 'Monitor-only access for individual wallets.',
    features: [
      'Single portfolio monitoring',
      'Chainlink price feed alerts',
      'Basic risk dashboard',
      'Community support',
    ],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '$500',
    period: '/month',
    description: 'Full autonomous execution for active managers.',
    features: [
      'Up to 5 portfolio vaults',
      'AI decision agent (GPT-4o)',
      'Automated rebalancing',
      'HSP settlement integration',
      'NexaID verification',
      'Priority support',
    ],
    cta: 'Get Started',
    highlighted: true,
  },
  {
    name: 'Institutional',
    price: '$2,000',
    period: '/month',
    description: 'Enterprise-grade for family offices and funds.',
    features: [
      'Unlimited vaults',
      'Custom risk thresholds',
      'Multi-currency HSP settlement',
      'Dedicated agent instances',
      'Compliance audit logs',
      'White-glove onboarding',
      'SLA guarantee',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const TokenomicsSection = () => {
  return (
    <section id="ecosystem" className="relative z-10 py-32 px-6 md:px-12 lg:px-24">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[300px] bg-cn-glow/4 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Market Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <p className="font-jakarta font-bold text-[11px] uppercase tracking-[0.2em] text-primary mb-4">
            Market Opportunity
          </p>
          <h2 className="font-inter font-extrabold uppercase tracking-tight text-foreground text-[32px] md:text-[48px] leading-[1.1] mb-6">
            THE NUMBERS SPEAK<span className="text-primary">.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-32">
          {marketStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
              className="liquid-glass rounded-xl p-6 text-center group hover:bg-foreground/[0.03] transition-all duration-500"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-500">
                <stat.icon size={20} className="text-primary" />
              </div>
              <p className="font-inter font-extrabold text-foreground text-[28px] md:text-[36px] leading-none mb-1">
                {stat.value}
              </p>
              <p className="font-inter text-[12px] text-muted-foreground uppercase tracking-wider mb-1">
                {stat.label}
              </p>
              <p className="font-inter text-[11px] text-primary/60">{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Pricing Tiers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="font-jakarta font-bold text-[11px] uppercase tracking-[0.2em] text-primary mb-4">
            Revenue Model
          </p>
          <h2 className="font-inter font-extrabold uppercase tracking-tight text-foreground text-[32px] md:text-[48px] leading-[1.1] mb-6">
            TRANSPARENT PRICING<span className="text-primary">.</span>
          </h2>
          <p className="font-inter text-[14px] text-muted-foreground max-w-[520px] leading-relaxed">
            From individual explorers to institutional fund managers — autonomous portfolio management at every scale.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
              className={`liquid-glass rounded-2xl p-7 flex flex-col relative overflow-hidden transition-all duration-500 ${
                tier.highlighted
                  ? 'ring-1 ring-primary/30 bg-primary/[0.03]'
                  : 'hover:bg-foreground/[0.03]'
              }`}
            >
              {tier.highlighted && (
                <span className="absolute top-4 right-4 font-inter text-[9px] uppercase tracking-widest text-primary bg-primary/10 rounded-full px-2.5 py-1 font-bold">
                  Popular
                </span>
              )}

              <div className="mb-6">
                <h3 className="font-inter font-bold text-foreground text-[18px] mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="font-inter font-extrabold text-foreground text-[36px]">{tier.price}</span>
                  {tier.period && (
                    <span className="font-inter text-[13px] text-muted-foreground">{tier.period}</span>
                  )}
                </div>
                <p className="font-inter text-[12px] text-muted-foreground leading-relaxed">{tier.description}</p>
              </div>

              <ul className="flex-1 space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check size={14} className="text-primary mt-0.5 flex-shrink-0" />
                    <span className="font-inter text-[13px] text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#get-started"
                className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-inter font-bold text-[13px] uppercase tracking-wide transition-all duration-300 ${
                  tier.highlighted
                    ? 'bg-primary text-primary-foreground hover:opacity-90'
                    : 'bg-foreground/5 text-foreground hover:bg-foreground/10'
                }`}
              >
                {tier.cta}
                <ArrowRight size={14} />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TokenomicsSection;
