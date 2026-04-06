import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X, ArrowUpRight, ChevronRight, Copy, Check, Info, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

/* ── Sidebar Navigation Data ── */
const SIDEBAR_SECTIONS = [
  {
    heading: 'Get Started',
    links: [
      { label: 'Quick Start', slug: 'quick-start', active: true },
      { label: 'Overview', slug: 'overview' },
      { label: 'Core Concepts', slug: 'core-concepts' },
      { label: 'Pricing', slug: 'pricing' },
    ],
  },
  {
    heading: 'Agent Architecture',
    links: [
      { label: 'Monitor Agent', slug: 'monitor-agent' },
      { label: 'Decision Agent', slug: 'decision-agent' },
      { label: 'Execution Agent', slug: 'execution-agent' },
      { label: 'Settlement Agent', slug: 'settlement-agent' },
    ],
  },
  {
    heading: 'Vault Management',
    links: [
      { label: 'Creating a Vault', slug: 'creating-vault' },
      { label: 'Risk Parameters', slug: 'risk-parameters' },
      { label: 'Rebalancing', slug: 'rebalancing' },
      { label: 'Deposits & Withdrawals', slug: 'deposits-withdrawals' },
    ],
  },
  {
    heading: 'Integrations',
    links: [
      { label: 'HashKey Chain', slug: 'hashkey-chain' },
      { label: 'Chainlink Feeds', slug: 'chainlink-feeds' },
      { label: 'NexaID KYC', slug: 'nexaid-kyc' },
      { label: 'HSP Protocol', slug: 'hsp-protocol' },
    ],
  },
  {
    heading: 'SDKs & APIs',
    links: [
      { label: 'REST API', slug: 'rest-api' },
      { label: 'TypeScript SDK', slug: 'typescript-sdk' },
      { label: 'Python SDK', slug: 'python-sdk' },
      { label: 'Webhooks', slug: 'webhooks' },
    ],
  },
];

const TOP_TABS = [
  { label: 'Guides', active: true },
  { label: 'API Reference', active: false },
  { label: 'Examples', active: false },
  { label: 'Changelog', active: false },
  { label: 'Help Center', active: false },
];

/* ── Step Cards Data ── */
const AGENT_CARDS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" strokeLinecap="round" />
      </svg>
    ),
    title: 'Monitor Agent',
    desc: 'Continuously polls Chainlink price feeds and on-chain state to detect rebalancing triggers.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 3L20 19H4L12 3Z" strokeLinejoin="round" />
        <circle cx="12" cy="14" r="1.5" fill="currentColor" />
      </svg>
    ),
    title: 'Decision Agent',
    desc: 'Evaluates risk parameters, correlation matrices, and portfolio drift to compute optimal trades.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 8H17L14 5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 16H7L10 19" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Execution Agent',
    desc: 'Submits signed transactions to HashKey Chain, managing gas, slippage, and MEV protection.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Settlement Agent',
    desc: 'Finalizes payments through HSP Protocol with compliance checks via NexaID.',
  },
];

const SDK_CARDS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    title: 'REST API',
    desc: 'Standard RESTful API, compatible with all programming languages.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
        <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
      </svg>
    ),
    title: 'TypeScript SDK',
    desc: 'Official TypeScript SDK with full type safety and async support.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    title: 'Python SDK',
    desc: 'Official Python SDK for data science and backend integrations.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
        <path d="M18 8A6 6 0 1 0 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.73 21A2 2 0 0 1 10.27 21" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Webhooks',
    desc: 'Real-time event notifications for portfolio changes and agent actions.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    title: 'API Reference',
    desc: 'Complete API documentation with parameter descriptions.',
  },
];

/* ── Code Block Component ── */
const CodeBlock = ({ code, language }: { code: string; language: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative rounded-lg border border-border/50 bg-card overflow-hidden my-4">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/30">
        <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">{language}</span>
        <button onClick={handleCopy} className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors">
          {copied ? <Check size={12} className="text-primary" /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed">
        <code className="font-mono text-foreground/80">{code}</code>
      </pre>
    </div>
  );
};

/* ── Info Banner ── */
const InfoBanner = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/[0.04] px-4 py-3.5 my-6">
    <Info size={16} className="text-primary mt-0.5 shrink-0" />
    <p className="text-[13px] text-foreground/70 leading-relaxed">{children}</p>
  </div>
);

/* ── Feature Card ── */
const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) => (
  <div className="group rounded-xl border border-border/40 bg-card/50 hover:bg-card hover:border-border/80 transition-all duration-300 p-5 cursor-pointer">
    <div className="text-muted-foreground group-hover:text-primary transition-colors mb-3">
      {icon}
    </div>
    <h4 className="font-inter font-bold text-[14px] text-foreground mb-1.5">{title}</h4>
    <p className="font-inter text-[12.5px] text-muted-foreground leading-relaxed">{desc}</p>
  </div>
);

/* ── Numbered Step ── */
const Step = ({ num, title, children }: { num: number; title: string; children: React.ReactNode }) => (
  <div className="relative pl-12 pb-10">
    {/* Step number */}
    <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
      <span className="text-[13px] font-bold text-primary">{num}</span>
    </div>
    <h3 className="font-inter font-bold text-[18px] text-foreground mb-3">{title}</h3>
    <div className="space-y-3">{children}</div>
  </div>
);

/* ── Main Docs Page ── */
const Docs = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground font-inter">
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="flex items-center justify-between px-4 md:px-6 h-14">
          {/* Left: Logo + Language */}
          <div className="flex items-center gap-3">
            <button className="md:hidden text-foreground" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link to="/" className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-primary">
                <path d="M12 3L20 19H4L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M12 9L16 17H8L12 9Z" fill="currentColor" opacity="0.3" />
              </svg>
              <span className="font-bold text-foreground text-[15px] tracking-tight hidden sm:inline">APEX</span>
            </Link>
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-md mx-4">
            <div className={`relative flex items-center rounded-lg border transition-colors ${searchFocused ? 'border-primary/50 bg-card' : 'border-border/40 bg-card/50'}`}>
              <Search size={14} className="absolute left-3 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground pl-9 pr-12 py-2 outline-none"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              <kbd className="absolute right-3 hidden sm:inline-flex items-center gap-0.5 rounded border border-border/50 bg-muted/30 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Right: Links + Theme */}
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="hidden md:inline text-[13px] text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
            <a href="https://github.com" target="_blank" rel="noopener" className="hidden md:inline text-[13px] text-muted-foreground hover:text-foreground transition-colors">GitHub</a>
            <button onClick={toggleTheme} className="text-muted-foreground hover:text-foreground transition-colors">
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-1 px-4 md:px-6 overflow-x-auto scrollbar-none">
          {TOP_TABS.map((tab) => (
            <button
              key={tab.label}
              className={`px-3 py-2.5 text-[13px] font-medium whitespace-nowrap border-b-2 transition-colors ${
                tab.active
                  ? 'text-primary border-primary'
                  : 'text-muted-foreground border-transparent hover:text-foreground hover:border-border/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="flex">
        {/* ── Sidebar ── */}
        <AnimatePresence>
          {(sidebarOpen || true) && (
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className={`${
                sidebarOpen ? 'fixed inset-y-0 left-0 z-40 mt-[105px]' : 'hidden'
              } md:sticky md:top-[105px] md:block w-64 h-[calc(100vh-105px)] overflow-y-auto border-r border-border/30 bg-background px-4 py-6 shrink-0`}
            >
              {SIDEBAR_SECTIONS.map((section) => (
                <div key={section.heading} className="mb-6">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-2.5 px-2">
                    {section.heading}
                  </h3>
                  <ul className="space-y-0.5">
                    {section.links.map((link) => (
                      <li key={link.slug}>
                        <button
                          className={`w-full text-left px-2 py-1.5 rounded-md text-[13px] transition-colors ${
                            link.active
                              ? 'bg-primary/[0.08] text-primary font-medium'
                              : 'text-foreground/60 hover:text-foreground hover:bg-muted/30'
                          }`}
                        >
                          {link.label}
                          {link.slug === 'typescript-sdk' && (
                            <ChevronRight size={12} className="inline ml-1 text-muted-foreground" />
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-30 bg-background/60 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* ── Main Content ── */}
        <main className="flex-1 min-w-0 px-6 md:px-10 lg:px-16 py-10 max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground mb-2">
            <span>Get Started</span>
            <ChevronRight size={10} />
            <span className="text-foreground">Quick Start</span>
          </div>

          <div className="flex items-center justify-between mb-8">
            <h1 className="font-inter font-extrabold text-[32px] md:text-[40px] text-foreground tracking-tight">
              Quick Start
            </h1>
            <button className="hidden md:flex items-center gap-1.5 rounded-lg border border-border/50 bg-card/50 px-3 py-1.5 text-[12px] text-muted-foreground hover:text-foreground hover:border-border transition-colors">
              <Copy size={12} />
              Copy page
            </button>
          </div>

          <InfoBanner>
            APEX is currently in Private Beta on HashKey Chain Testnet. 
            <a href="#" className="text-primary hover:underline ml-1 inline-flex items-center gap-0.5">
              Request access <ArrowUpRight size={10} />
            </a>
          </InfoBanner>

          {/* ── Step 1: Connect Wallet ── */}
          <Step num={1} title="Connect Your Wallet">
            <p className="text-[13.5px] text-foreground/70 leading-relaxed">
              Connect a HashKey Chain-compatible wallet to get started. APEX supports MetaMask, WalletConnect, and native HashKey wallets.
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-[13px] text-foreground/60 ml-1">
              <li>Navigate to the <Link to="/login" className="text-primary hover:underline">APEX Dashboard</Link></li>
              <li>Click "Connect Wallet" and select your provider</li>
              <li>Complete NexaID verification (KYC) if required</li>
              <li>Your wallet is now linked to APEX</li>
            </ul>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <a href="#" className="group flex items-center gap-3 rounded-xl border border-border/40 bg-card/50 hover:bg-card hover:border-border/80 transition-all p-4">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    <path d="M9 12h6M12 9v6" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className="text-[13px] font-medium text-foreground">APEX Dashboard</span>
                </div>
                <ArrowUpRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
              <a href="#" className="group flex items-center gap-3 rounded-xl border border-border/40 bg-card/50 hover:bg-card hover:border-border/80 transition-all p-4">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="4" />
                    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className="text-[13px] font-medium text-foreground">NexaID Verification</span>
                </div>
                <ArrowUpRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            </div>
          </Step>

          {/* ── Step 2: Choose Agent Architecture ── */}
          <Step num={2} title="Understand the Agent Architecture">
            <p className="text-[13.5px] text-foreground/70 leading-relaxed mb-4">
              APEX operates a 4-layer autonomous agent system. Each agent handles a specific phase of portfolio management, working in concert to monitor, decide, execute, and settle.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AGENT_CARDS.map((card) => (
                <FeatureCard key={card.title} {...card} />
              ))}
            </div>
          </Step>

          {/* ── Step 3: Configure Vault ── */}
          <Step num={3} title="Configure Your Vault">
            <p className="text-[13.5px] text-foreground/70 leading-relaxed">
              Set your risk parameters and allocation targets. The vault is your personalized portfolio container managed by APEX agents.
            </p>

            <CodeBlock
              language="typescript"
              code={`import { ApexSDK } from '@apex/sdk';

const apex = new ApexSDK({
  apiKey: 'your-api-key',
  chain: 'hashkey-testnet',
});

// Create a new vault
const vault = await apex.vault.create({
  name: 'My RWA Portfolio',
  riskTolerance: 0.6,     // 0-1 scale
  maxDrawdown: 0.15,      // 15% max drawdown
  rebalanceThreshold: 5,  // 5% drift triggers rebalance
  allocations: {
    'HSKT': 0.40,          // HashKey Token
    'RWA-BOND': 0.35,      // Tokenized Bonds
    'USDC': 0.25,          // Stablecoin reserve
  },
});

console.log('Vault created:', vault.id);`}
            />

            <InfoBanner>
              Risk tolerance ranges from 0 (conservative) to 1 (aggressive). Start with 0.5 for a balanced approach.
            </InfoBanner>
          </Step>

          {/* ── Step 4: Deposit Funds ── */}
          <Step num={4} title="Deposit & Activate">
            <p className="text-[13.5px] text-foreground/70 leading-relaxed">
              Deposit funds into your vault and the agents will automatically begin monitoring and managing your portfolio.
            </p>

            <CodeBlock
              language="typescript"
              code={`// Deposit USDC into the vault
const deposit = await apex.vault.deposit({
  vaultId: vault.id,
  amount: '10000',
  token: 'USDC',
});

// Activate autonomous management
await apex.vault.activate(vault.id);

// Check vault status
const status = await apex.vault.status(vault.id);
console.log('Active agents:', status.agents);
console.log('Portfolio value:', status.totalValue);`}
            />
          </Step>

          {/* ── Step 5: Choose SDK ── */}
          <Step num={5} title="Choose Your Integration">
            <p className="text-[13.5px] text-foreground/70 leading-relaxed mb-4">
              APEX provides multiple SDKs and APIs. Select the best fit for your project needs and tech stack.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SDK_CARDS.map((card) => (
                <FeatureCard key={card.title} {...card} />
              ))}
            </div>
          </Step>

          {/* ── Bottom Navigation ── */}
          <div className="border-t border-border/30 pt-8 mt-8 flex items-center justify-between">
            <div />
            <Link
              to="/docs"
              className="group flex items-center gap-2 text-[13px] text-muted-foreground hover:text-primary transition-colors"
            >
              Next: Overview
              <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* ── Page Feedback ── */}
          <div className="mt-12 pt-8 border-t border-border/20 text-center">
            <p className="text-[12px] text-muted-foreground/60">
              Was this page helpful?{' '}
              <button className="text-primary hover:underline">Yes</button>{' · '}
              <button className="text-primary hover:underline">No</button>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Docs;
