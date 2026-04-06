import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronRight, Copy } from 'lucide-react';
import { CodeBlock, InfoBanner, FeatureCard, Step } from './DocsComponents';
import { AGENT_CARDS, SDK_CARDS, findSectionForSlug, findLabelForSlug, getAdjacentSlugs } from './DocsData';

/* ── Content for each slug ── */

const QuickStartContent = () => (
  <>
    <InfoBanner>
      APEX is currently in Private Beta on HashKey Chain Testnet.
      <a href="#" className="text-primary hover:underline ml-1 inline-flex items-center gap-0.5">
        Request access <ArrowUpRight size={10} />
      </a>
    </InfoBanner>

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
          <div className="flex-1"><span className="text-[13px] font-medium text-foreground">APEX Dashboard</span></div>
          <ArrowUpRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
        </a>
        <a href="#" className="group flex items-center gap-3 rounded-xl border border-border/40 bg-card/50 hover:bg-card hover:border-border/80 transition-all p-4">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="4" />
              <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex-1"><span className="text-[13px] font-medium text-foreground">NexaID Verification</span></div>
          <ArrowUpRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
        </a>
      </div>
    </Step>

    <Step num={2} title="Understand the Agent Architecture">
      <p className="text-[13.5px] text-foreground/70 leading-relaxed mb-4">
        APEX operates a 4-layer autonomous agent system. Each agent handles a specific phase of portfolio management.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {AGENT_CARDS.map((card) => <FeatureCard key={card.title} {...card} />)}
      </div>
    </Step>

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

const vault = await apex.vault.create({
  name: 'My RWA Portfolio',
  riskTolerance: 0.6,
  maxDrawdown: 0.15,
  rebalanceThreshold: 5,
  allocations: {
    'HSKT': 0.40,
    'RWA-BOND': 0.35,
    'USDC': 0.25,
  },
});

console.log('Vault created:', vault.id);`}
      />
      <InfoBanner>
        Risk tolerance ranges from 0 (conservative) to 1 (aggressive). Start with 0.5 for a balanced approach.
      </InfoBanner>
    </Step>

    <Step num={4} title="Deposit & Activate">
      <p className="text-[13.5px] text-foreground/70 leading-relaxed">
        Deposit funds into your vault and the agents will automatically begin managing your portfolio.
      </p>
      <CodeBlock
        language="typescript"
        code={`const deposit = await apex.vault.deposit({
  vaultId: vault.id,
  amount: '10000',
  token: 'USDC',
});

await apex.vault.activate(vault.id);

const status = await apex.vault.status(vault.id);
console.log('Active agents:', status.agents);
console.log('Portfolio value:', status.totalValue);`}
      />
    </Step>

    <Step num={5} title="Choose Your Integration">
      <p className="text-[13.5px] text-foreground/70 leading-relaxed mb-4">
        APEX provides multiple SDKs and APIs. Select the best fit for your tech stack.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SDK_CARDS.map((card) => <FeatureCard key={card.title} {...card} />)}
      </div>
    </Step>
  </>
);

const OverviewContent = () => (
  <>
    <p className="text-[14px] text-foreground/70 leading-relaxed mb-6">
      APEX is an autonomous portfolio management protocol built on HashKey Chain. It uses a multi-agent architecture to continuously monitor, analyze, and rebalance tokenized asset portfolios — including Real World Assets (RWAs), stablecoins, and native crypto.
    </p>
    <h2 className="font-inter font-bold text-[22px] text-foreground mb-4">Why APEX?</h2>
    <ul className="space-y-3 text-[13.5px] text-foreground/60">
      <li className="flex gap-3"><span className="text-primary font-bold">•</span>Fully autonomous portfolio management with human-readable audit trails</li>
      <li className="flex gap-3"><span className="text-primary font-bold">•</span>Institutional-grade risk management with configurable drawdown limits</li>
      <li className="flex gap-3"><span className="text-primary font-bold">•</span>Built-in compliance via NexaID KYC and HSP Protocol settlement</li>
      <li className="flex gap-3"><span className="text-primary font-bold">•</span>Optimized for HashKey Chain's low-cost, high-throughput environment</li>
    </ul>
    <h2 className="font-inter font-bold text-[22px] text-foreground mt-8 mb-4">How It Works</h2>
    <p className="text-[13.5px] text-foreground/70 leading-relaxed">
      Users create Vaults — smart contract containers that hold a diversified set of tokens. APEX agents monitor market conditions, compute optimal allocations, execute trades, and settle transactions automatically. Every action is logged on-chain for full transparency.
    </p>
  </>
);

const CoreConceptsContent = () => (
  <>
    <p className="text-[14px] text-foreground/70 leading-relaxed mb-6">
      Understanding APEX's core concepts will help you get the most out of the platform.
    </p>
    <h2 className="font-inter font-bold text-[22px] text-foreground mb-3">Vaults</h2>
    <p className="text-[13.5px] text-foreground/70 leading-relaxed mb-6">
      A Vault is an on-chain smart contract that holds your portfolio. Each vault has configurable risk parameters, allocation targets, and rebalancing thresholds. Vaults are non-custodial — only you can withdraw funds.
    </p>
    <h2 className="font-inter font-bold text-[22px] text-foreground mb-3">Agents</h2>
    <p className="text-[13.5px] text-foreground/70 leading-relaxed mb-6">
      Agents are autonomous processes that monitor and manage your vault. The four agent types (Monitor, Decision, Execution, Settlement) work together in a pipeline to keep your portfolio aligned with your goals.
    </p>
    <h2 className="font-inter font-bold text-[22px] text-foreground mb-3">Drift & Rebalancing</h2>
    <p className="text-[13.5px] text-foreground/70 leading-relaxed">
      Portfolio drift occurs when asset prices move, causing your actual allocation to diverge from targets. When drift exceeds your configured threshold, agents automatically rebalance by executing trades.
    </p>
  </>
);

const PricingContent = () => (
  <>
    <p className="text-[14px] text-foreground/70 leading-relaxed mb-6">
      APEX charges a simple, transparent fee structure with no hidden costs.
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="rounded-xl border border-border/40 bg-card/50 p-6">
        <h3 className="font-bold text-foreground text-[16px] mb-2">Free Tier</h3>
        <p className="text-[28px] font-extrabold text-primary mb-3">$0</p>
        <ul className="space-y-2 text-[13px] text-foreground/60">
          <li>• 1 vault, up to $10K AUM</li>
          <li>• All 4 agents included</li>
          <li>• Testnet only</li>
        </ul>
      </div>
      <div className="rounded-xl border border-primary/30 bg-primary/[0.04] p-6">
        <h3 className="font-bold text-foreground text-[16px] mb-2">Pro</h3>
        <p className="text-[28px] font-extrabold text-primary mb-3">0.5%</p>
        <ul className="space-y-2 text-[13px] text-foreground/60">
          <li>• Unlimited vaults</li>
          <li>• Mainnet access</li>
          <li>• Priority execution</li>
          <li>• 0.5% annual AUM fee</li>
        </ul>
      </div>
    </div>
  </>
);

/* ── Monitor Agent ── */
const MonitorAgentContent = () => (
  <>
    <p className="text-[14px] text-foreground/70 leading-relaxed mb-6">
      The Monitor Agent is the first layer in the APEX pipeline. It continuously polls Chainlink price feeds and on-chain vault state to detect when portfolio drift exceeds configured thresholds.
    </p>

    <h2 className="font-inter font-bold text-[22px] text-foreground mb-4">Architecture</h2>
    <div className="rounded-xl border border-border/40 bg-card/50 p-5 mb-6 overflow-x-auto">
      <pre className="text-[13px] text-foreground/70 font-mono leading-relaxed whitespace-pre">{`Chainlink Oracles ──▶ Monitor Agent ──▶ Drift Calculator ──▶ Threshold Check
                                                                  │
                                                        ┌────────┴────────┐
                                                   Drift > N%        Drift ≤ N%
                                                        │                 │
                                               Trigger Rebalance   Continue Polling`}</pre>
    </div>

    <InfoBanner>
      The Monitor Agent runs on a configurable interval (default: every 30 seconds). It never executes trades directly — it only signals the Decision Agent when intervention is needed.
    </InfoBanner>

    <h2 className="font-inter font-bold text-[22px] text-foreground mt-8 mb-4">How Drift Is Calculated</h2>
    <p className="text-[13.5px] text-foreground/70 leading-relaxed mb-4">
      Drift is the absolute difference between the target allocation and current allocation for each asset, summed across the portfolio. The Monitor Agent fetches real-time prices from Chainlink and computes each asset's current weight.
    </p>
    <CodeBlock language="typescript" code={`// Drift calculation logic
interface AssetWeight {
  token: string;
  target: number;    // e.g. 0.40
  current: number;   // e.g. 0.43
  drift: number;     // |target - current|
}

function calculateDrift(weights: AssetWeight[]): number {
  return weights.reduce((sum, w) => sum + Math.abs(w.target - w.current), 0);
}

// Monitor loop
const POLL_INTERVAL = 30_000; // 30 seconds

async function monitorLoop(vaultId: string, threshold: number) {
  const prices = await chainlink.getLatestPrices();
  const weights = computeWeights(vaultId, prices);
  const totalDrift = calculateDrift(weights);

  if (totalDrift > threshold) {
    await signalDecisionAgent(vaultId, weights, prices);
    console.log(\`Drift \${(totalDrift * 100).toFixed(1)}% > \${threshold * 100}% → rebalance triggered\`);
  }
}`} />

    <h2 className="font-inter font-bold text-[22px] text-foreground mt-8 mb-4">Chainlink Integration</h2>
    <p className="text-[13.5px] text-foreground/70 leading-relaxed mb-4">
      The Monitor Agent reads from Chainlink's decentralized oracle network deployed on HashKey Chain. Each supported asset has a dedicated price feed contract.
    </p>
    <CodeBlock language="typescript" code={`import { ApexSDK } from '@apex/sdk';

const apex = new ApexSDK({ apiKey: 'your-key', chain: 'hashkey-testnet' });

// Get all monitored price feeds for a vault
const feeds = await apex.monitor.getPriceFeeds('vault-123');
// => [{ token: 'HSKT', feed: '0xABC...', price: 12.45, updatedAt: ... }, ...]

// Subscribe to drift alerts
apex.monitor.onDrift('vault-123', (event) => {
  console.log(\`Drift detected: \${event.totalDrift}%\`);
  console.log('Affected assets:', event.assets);
});`} />

    <h2 className="font-inter font-bold text-[22px] text-foreground mt-8 mb-4">Configuration</h2>
    <div className="overflow-x-auto">
      <table className="w-full text-[13px] border-collapse">
        <thead>
          <tr className="border-b border-border/40">
            <th className="text-left py-2 px-3 text-foreground/80 font-semibold">Parameter</th>
            <th className="text-left py-2 px-3 text-foreground/80 font-semibold">Default</th>
            <th className="text-left py-2 px-3 text-foreground/80 font-semibold">Description</th>
          </tr>
        </thead>
        <tbody className="text-foreground/60">
          <tr className="border-b border-border/20"><td className="py-2 px-3 font-mono">pollInterval</td><td className="py-2 px-3">30s</td><td className="py-2 px-3">How often the agent checks prices</td></tr>
          <tr className="border-b border-border/20"><td className="py-2 px-3 font-mono">driftThreshold</td><td className="py-2 px-3">5%</td><td className="py-2 px-3">Minimum drift to trigger rebalance</td></tr>
          <tr className="border-b border-border/20"><td className="py-2 px-3 font-mono">stalePriceWindow</td><td className="py-2 px-3">120s</td><td className="py-2 px-3">Max age before a price feed is stale</td></tr>
          <tr><td className="py-2 px-3 font-mono">alertChannels</td><td className="py-2 px-3">[]</td><td className="py-2 px-3">Webhook/Telegram endpoints for alerts</td></tr>
        </tbody>
      </table>
    </div>
  </>
);

/* ── Decision Agent ── */
const DecisionAgentContent = () => (
  <>
    <p className="text-[14px] text-foreground/70 leading-relaxed mb-6">
      The Decision Agent is the brain of APEX. When the Monitor Agent signals a drift event, the Decision Agent evaluates risk parameters, correlation matrices, and portfolio constraints to compute the optimal set of trades.
    </p>

    <h2 className="font-inter font-bold text-[22px] text-foreground mb-4">Architecture</h2>
    <div className="rounded-xl border border-border/40 bg-card/50 p-5 mb-6 overflow-x-auto">
      <pre className="text-[13px] text-foreground/70 font-mono leading-relaxed whitespace-pre">{`Rebalance Trigger
       │
       ▼
Decision Agent ──▶ Risk Model ────────┐
       │                              │
       ├──▶ Correlation Matrix ───────┤──▶ Constraint Validation ──▶ Trade Plan
       │                              │
       └──▶ Portfolio Optimizer ──────┘`}</pre>
    </div>

    <InfoBanner>
      The Decision Agent uses a mean-variance optimization model with configurable risk constraints. All trade plans are validated against vault limits before being forwarded to the Execution Agent.
    </InfoBanner>

    <h2 className="font-inter font-bold text-[22px] text-foreground mt-8 mb-4">Risk Model</h2>
    <p className="text-[13.5px] text-foreground/70 leading-relaxed mb-4">
      The risk model evaluates Value-at-Risk (VaR), maximum drawdown constraints, and position concentration limits. It ensures no single trade can violate the vault's risk envelope.
    </p>
    <CodeBlock language="typescript" code={`interface RiskConstraints {
  maxDrawdown: number;        // e.g. 0.15 (15%)
  maxPositionSize: number;    // e.g. 0.50 (50% of portfolio)
  minLiquidity: number;       // Minimum 24h volume in USD
  correlationLimit: number;   // Max pairwise correlation
}

interface TradePlan {
  trades: Array<{
    action: 'buy' | 'sell';
    token: string;
    amount: string;
    expectedPrice: number;
    slippageTolerance: number;
  }>;
  expectedDriftAfter: number;
  riskScore: number;  // 0-100
}

// Decision Agent generates an optimal trade plan
const plan = await apex.decision.computeTradePlan({
  vaultId: 'vault-123',
  currentWeights: weights,
  constraints: {
    maxDrawdown: 0.15,
    maxPositionSize: 0.50,
    minLiquidity: 100_000,
    correlationLimit: 0.85,
  },
});

console.log('Trade plan:', plan.trades);
console.log('Risk score:', plan.riskScore);`} />

    <h2 className="font-inter font-bold text-[22px] text-foreground mt-8 mb-4">Optimization Algorithm</h2>
    <p className="text-[13.5px] text-foreground/70 leading-relaxed mb-4">
      APEX uses a constrained quadratic programming solver to minimize tracking error while respecting all risk bounds. The solver runs off-chain and produces a signed trade plan that the Execution Agent can verify.
    </p>
    <CodeBlock language="python" code={`# Python SDK — inspect decision reasoning
from apex import ApexClient

client = ApexClient(api_key="your-key")

# Get the latest decision report for a vault
report = client.decision.get_report("vault-123")

print(f"Trigger:       {report.trigger_reason}")
print(f"Assets moved:  {len(report.trades)}")
print(f"Risk score:    {report.risk_score}/100")
print(f"Expected drift after: {report.expected_drift_after:.2f}%")

for trade in report.trades:
    print(f"  {trade.action.upper()} {trade.amount} {trade.token} @ {trade.price}")`} />

    <h2 className="font-inter font-bold text-[22px] text-foreground mt-8 mb-4">Rejection Criteria</h2>
    <p className="text-[13.5px] text-foreground/70 leading-relaxed mb-4">
      The Decision Agent will reject a rebalance if any of the following conditions are met:
    </p>
    <ul className="space-y-2 text-[13.5px] text-foreground/60 ml-1">
      <li className="flex gap-3"><span className="text-primary font-bold">•</span>Estimated gas cost exceeds 2% of trade value</li>
      <li className="flex gap-3"><span className="text-primary font-bold">•</span>Slippage would exceed the configured tolerance</li>
      <li className="flex gap-3"><span className="text-primary font-bold">•</span>Trade would violate max position size constraints</li>
      <li className="flex gap-3"><span className="text-primary font-bold">•</span>Insufficient on-chain liquidity for the trade pair</li>
      <li className="flex gap-3"><span className="text-primary font-bold">•</span>Cooldown period from last rebalance has not elapsed</li>
    </ul>
  </>
);

/* ── Execution Agent ── */
const ExecutionAgentContent = () => (
  <>
    <p className="text-[14px] text-foreground/70 leading-relaxed mb-6">
      The Execution Agent takes validated trade plans from the Decision Agent and submits signed transactions to HashKey Chain. It handles gas optimization, slippage protection, and MEV-resistant submission strategies.
    </p>

    <h2 className="font-inter font-bold text-[22px] text-foreground mb-4">Architecture</h2>
    <div className="rounded-xl border border-border/40 bg-card/50 p-5 mb-6 overflow-x-auto">
      <pre className="text-[13px] text-foreground/70 font-mono leading-relaxed whitespace-pre">{`Trade Plan ──▶ Gas Estimation ──▶ MEV Protection ──▶ Tx Signing ──▶ HashKey Chain
                                                                        │
                                                              ┌────────┴────────┐
                                                         Confirmed          Failed
                                                              │                 │
                                                    Settlement Agent    Retry (higher gas)`}</pre>
    </div>

    <InfoBanner>
      The Execution Agent uses a private mempool relay on HashKey Chain to prevent front-running and sandwich attacks. All transactions are signed with the vault's dedicated execution key.
    </InfoBanner>

    <h2 className="font-inter font-bold text-[22px] text-foreground mt-8 mb-4">Transaction Lifecycle</h2>
    <p className="text-[13.5px] text-foreground/70 leading-relaxed mb-4">
      Each trade follows a strict lifecycle: estimation → protection → signing → submission → confirmation. Failed transactions are automatically retried with escalating gas prices up to a configurable limit.
    </p>
    <CodeBlock language="typescript" code={`// Execution Agent internals
interface ExecutionConfig {
  maxGasPrice: bigint;           // Wei ceiling
  gasMultiplier: number;         // e.g. 1.2 (20% buffer)
  maxRetries: number;            // Default: 3
  retryDelayMs: number;          // Backoff between retries
  mevProtection: boolean;        // Use private relay
  slippageBps: number;           // Basis points (e.g. 50 = 0.5%)
}

// Monitor execution status
const execution = await apex.execution.getStatus('tx-abc');
console.log('Status:', execution.status);   // 'pending' | 'submitted' | 'confirmed' | 'failed'
console.log('Gas used:', execution.gasUsed);
console.log('Block:', execution.blockNumber);
console.log('Retries:', execution.retryCount);`} />

    <h2 className="font-inter font-bold text-[22px] text-foreground mt-8 mb-4">MEV Protection</h2>
    <p className="text-[13.5px] text-foreground/70 leading-relaxed mb-4">
      MEV (Maximal Extractable Value) attacks like front-running and sandwich attacks can erode portfolio returns. APEX mitigates this through multiple strategies:
    </p>
    <ul className="space-y-2 text-[13.5px] text-foreground/60 ml-1 mb-6">
      <li className="flex gap-3"><span className="text-primary font-bold">•</span><strong className="text-foreground/80">Private relay</strong> — Transactions bypass the public mempool</li>
      <li className="flex gap-3"><span className="text-primary font-bold">•</span><strong className="text-foreground/80">Commit-reveal</strong> — Large trades use a two-phase submission</li>
      <li className="flex gap-3"><span className="text-primary font-bold">•</span><strong className="text-foreground/80">Order splitting</strong> — Large orders are split into smaller chunks</li>
      <li className="flex gap-3"><span className="text-primary font-bold">•</span><strong className="text-foreground/80">Timing randomization</strong> — Submissions are jittered to avoid patterns</li>
    </ul>

    <h2 className="font-inter font-bold text-[22px] text-foreground mt-8 mb-4">Gas Optimization</h2>
    <CodeBlock language="typescript" code={`// Gas estimation with safety buffer
const gasEstimate = await apex.execution.estimateGas({
  vaultId: 'vault-123',
  trades: plan.trades,
});

console.log('Estimated gas:', gasEstimate.totalGas);
console.log('Estimated cost:', gasEstimate.costUSD);
console.log('Recommended priority fee:', gasEstimate.priorityFee);

// Override gas settings for a specific execution
await apex.execution.execute({
  planId: plan.id,
  gasConfig: {
    maxFeePerGas: '50000000000',   // 50 gwei
    maxPriorityFee: '2000000000',  // 2 gwei
  },
});`} />
  </>
);

/* ── Settlement Agent ── */
const SettlementAgentContent = () => (
  <>
    <p className="text-[14px] text-foreground/70 leading-relaxed mb-6">
      The Settlement Agent is the final layer. After transactions are confirmed on-chain, it handles compliance verification through NexaID, finalizes payments via HSP Protocol, updates the vault state, and emits events to configured notification channels.
    </p>

    <h2 className="font-inter font-bold text-[22px] text-foreground mb-4">Architecture</h2>
    <div className="rounded-xl border border-border/40 bg-card/50 p-5 mb-6 overflow-x-auto">
      <pre className="text-[13px] text-foreground/70 font-mono leading-relaxed whitespace-pre">{`Confirmed Tx ──▶ Settlement Agent
                       │
                  NexaID KYC Check
                       │
                 ┌─────┴─────┐
            Compliant    Non-Compliant
                 │            │
          HSP Settlement   Flag for Review
                 │
          Update Vault State ──▶ Emit Events ──▶ Webhooks / Telegram`}</pre>
    </div>

    <InfoBanner>
      HSP (HashKey Settlement Protocol) enables atomic settlement of RWA trades with built-in compliance rails. Every settlement produces an immutable on-chain receipt.
    </InfoBanner>

    <h2 className="font-inter font-bold text-[22px] text-foreground mt-8 mb-4">Compliance Flow</h2>
    <p className="text-[13.5px] text-foreground/70 leading-relaxed mb-4">
      Before any RWA settlement can finalize, the Settlement Agent verifies that both counterparties pass NexaID compliance checks. This includes KYC status, jurisdiction restrictions, and accredited investor verification for certain asset classes.
    </p>
    <CodeBlock language="typescript" code={`// Settlement with compliance checks
interface SettlementReceipt {
  id: string;
  vaultId: string;
  txHash: string;
  status: 'settled' | 'pending_review' | 'rejected';
  compliance: {
    kycVerified: boolean;
    jurisdiction: string;
    accreditedInvestor: boolean;
  };
  hspReceipt: string;  // On-chain receipt hash
  settledAt: string;    // ISO timestamp
}

// Get settlement history
const settlements = await apex.settlement.list('vault-123', {
  limit: 20,
  status: 'settled',
});

settlements.forEach(s => {
  console.log(\`\${s.id}: \${s.status} — \${s.hspReceipt}\`);
});`} />

    <h2 className="font-inter font-bold text-[22px] text-foreground mt-8 mb-4">HSP Protocol Integration</h2>
    <p className="text-[13.5px] text-foreground/70 leading-relaxed mb-4">
      HSP (HashKey Settlement Protocol) provides atomic delivery-vs-payment for tokenized assets. The Settlement Agent interacts with HSP smart contracts to ensure trades are settled in a single atomic transaction.
    </p>
    <CodeBlock language="solidity" code={`// HSP Settlement Contract Interface (simplified)
interface IHSPSettlement {
    /// @notice Settle a trade atomically
    /// @param buyer  Address of the buyer
    /// @param seller Address of the seller
    /// @param asset  RWA token contract address
    /// @param amount Number of tokens to transfer
    /// @param payment Stablecoin payment amount
    function settle(
        address buyer,
        address seller,
        address asset,
        uint256 amount,
        uint256 payment
    ) external returns (bytes32 receiptId);

    /// @notice Verify settlement receipt
    function getReceipt(bytes32 id)
        external view returns (Receipt memory);
}`} />

    <h2 className="font-inter font-bold text-[22px] text-foreground mt-8 mb-4">Event Notifications</h2>
    <p className="text-[13.5px] text-foreground/70 leading-relaxed mb-4">
      After settlement, the agent emits events to all configured channels. Supported notification targets include webhooks, Telegram bots, and email.
    </p>
    <CodeBlock language="typescript" code={`// Configure settlement notifications
await apex.settlement.configureAlerts('vault-123', {
  channels: [
    { type: 'webhook', url: 'https://your-app.com/webhook' },
    { type: 'telegram', chatId: '-100123456789' },
    { type: 'email', address: 'alerts@yourfund.com' },
  ],
  events: [
    'settlement.completed',
    'settlement.failed',
    'settlement.compliance_flag',
  ],
});`} />
  </>
);

/* ── Creating a Vault ── */
const CreatingVaultContent = () => (
  <>
    <p className="text-[14px] text-foreground/70 leading-relaxed mb-6">
      A Vault is a non-custodial smart contract on HashKey Chain that holds your diversified portfolio. This guide walks you through creating and configuring your first vault.
    </p>

    <h2 className="font-inter font-bold text-[22px] text-foreground mb-4">Prerequisites</h2>
    <ul className="space-y-2 text-[13.5px] text-foreground/60 ml-1 mb-6">
      <li className="flex gap-3"><span className="text-primary font-bold">•</span>A HashKey Chain-compatible wallet (MetaMask, WalletConnect, or native HashKey wallet)</li>
      <li className="flex gap-3"><span className="text-primary font-bold">•</span>Completed NexaID KYC verification</li>
      <li className="flex gap-3"><span className="text-primary font-bold">•</span>Sufficient HSK for gas fees (~0.01 HSK for vault deployment)</li>
    </ul>

    <h2 className="font-inter font-bold text-[22px] text-foreground mb-4">Step 1: Define Allocations</h2>
    <p className="text-[13.5px] text-foreground/70 leading-relaxed mb-4">
      Set target weights for each asset in your portfolio. APEX supports tokenized treasuries (tUSTB), real-estate funds (rREF), corporate bonds (cBOND), gold-backed tokens (gGOLD), and stablecoins (USDC).
    </p>
    <CodeBlock language="typescript" code={`import { ApexSDK } from '@apex/sdk';

const apex = new ApexSDK({ apiKey: 'your-key', chain: 'hashkey-mainnet' });

const vault = await apex.vault.create({
  name: 'Institutional RWA Fund',
  allocations: {
    'tUSTB':  0.30,   // 30% — Tokenized US Treasuries
    'rREF':   0.20,   // 20% — Real Estate Fund
    'cBOND':  0.20,   // 20% — Corporate Bonds
    'gGOLD':  0.10,   // 10% — Gold-backed token
    'USDC':   0.20,   // 20% — Stablecoin reserve
  },
});

console.log('Vault deployed at:', vault.contractAddress);`} />

    <h2 className="font-inter font-bold text-[22px] text-foreground mt-8 mb-4">Step 2: Set Risk Parameters</h2>
    <p className="text-[13.5px] text-foreground/70 leading-relaxed mb-4">
      Configure risk thresholds that govern how aggressively the agents manage your portfolio. These parameters are enforced on-chain and cannot be changed without your wallet signature.
    </p>
    <CodeBlock language="typescript" code={`await apex.vault.configure(vault.id, {
  riskTolerance: 0.6,          // 0 = conservative, 1 = aggressive
  maxDrawdown: 0.15,           // 15% max daily loss
  rebalanceThreshold: 5,       // Trigger at 5% drift
  rebalanceCooldown: 3600,     // 1 hour minimum between rebalances
  maxSlippage: 50,             // 0.5% max slippage (basis points)
});`} />

    <InfoBanner>
      Allocations must sum to exactly 1.0 (100%). The vault contract will reject deployment if weights don't add up.
    </InfoBanner>

    <h2 className="font-inter font-bold text-[22px] text-foreground mt-8 mb-4">Step 3: Deploy & Verify</h2>
    <p className="text-[13.5px] text-foreground/70 leading-relaxed mb-4">
      Once created, the vault smart contract is deployed to HashKey Chain. You can verify the deployment on the block explorer.
    </p>
    <CodeBlock language="typescript" code={`// Verify vault deployment
const status = await apex.vault.status(vault.id);

console.log('Contract:', status.contractAddress);
console.log('Chain ID:', status.chainId);        // 133 (HashKey Chain)
console.log('State:', status.state);              // 'awaiting_deposit'
console.log('Allocations:', status.allocations);
console.log('Risk params:', status.riskParams);`} />
  </>
);

/* ── Risk Parameters ── */
const RiskParametersContent = () => (
  <>
    <p className="text-[14px] text-foreground/70 leading-relaxed mb-6">
      Risk parameters define the boundaries within which APEX agents operate. These are enforced on-chain and ensure your portfolio never exceeds your risk tolerance — even during extreme market conditions.
    </p>

    <h2 className="font-inter font-bold text-[22px] text-foreground mb-4">Parameter Reference</h2>
    <div className="overflow-x-auto mb-6">
      <table className="w-full text-[13px] border-collapse">
        <thead>
          <tr className="border-b border-border/40">
            <th className="text-left py-2.5 px-3 text-foreground/80 font-semibold">Parameter</th>
            <th className="text-left py-2.5 px-3 text-foreground/80 font-semibold">Type</th>
            <th className="text-left py-2.5 px-3 text-foreground/80 font-semibold">Range</th>
            <th className="text-left py-2.5 px-3 text-foreground/80 font-semibold">Description</th>
          </tr>
        </thead>
        <tbody className="text-foreground/60">
          <tr className="border-b border-border/20"><td className="py-2.5 px-3 font-mono">riskTolerance</td><td className="py-2.5 px-3">float</td><td className="py-2.5 px-3">0.0–1.0</td><td className="py-2.5 px-3">Overall aggressiveness of the Decision Agent</td></tr>
          <tr className="border-b border-border/20"><td className="py-2.5 px-3 font-mono">maxDrawdown</td><td className="py-2.5 px-3">float</td><td className="py-2.5 px-3">0.01–0.50</td><td className="py-2.5 px-3">Maximum allowed daily portfolio loss</td></tr>
          <tr className="border-b border-border/20"><td className="py-2.5 px-3 font-mono">rebalanceThreshold</td><td className="py-2.5 px-3">number</td><td className="py-2.5 px-3">1–20</td><td className="py-2.5 px-3">Portfolio drift percentage to trigger rebalance</td></tr>
          <tr className="border-b border-border/20"><td className="py-2.5 px-3 font-mono">rebalanceCooldown</td><td className="py-2.5 px-3">number</td><td className="py-2.5 px-3">300–86400</td><td className="py-2.5 px-3">Minimum seconds between rebalances</td></tr>
          <tr className="border-b border-border/20"><td className="py-2.5 px-3 font-mono">maxSlippage</td><td className="py-2.5 px-3">number</td><td className="py-2.5 px-3">10–500</td><td className="py-2.5 px-3">Max slippage in basis points</td></tr>
          <tr className="border-b border-border/20"><td className="py-2.5 px-3 font-mono">maxPositionSize</td><td className="py-2.5 px-3">float</td><td className="py-2.5 px-3">0.1–1.0</td><td className="py-2.5 px-3">Max single-asset weight</td></tr>
          <tr><td className="py-2.5 px-3 font-mono">correlationLimit</td><td className="py-2.5 px-3">float</td><td className="py-2.5 px-3">0.0–1.0</td><td className="py-2.5 px-3">Max pairwise asset correlation</td></tr>
        </tbody>
      </table>
    </div>

    <h2 className="font-inter font-bold text-[22px] text-foreground mb-4">Preset Profiles</h2>
    <p className="text-[13.5px] text-foreground/70 leading-relaxed mb-4">
      APEX provides three built-in risk profiles for common use cases. You can also create custom configurations.
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
      {[
        { name: 'Conservative', tolerance: '0.2', drawdown: '5%', threshold: '3%', desc: 'Capital preservation focus with minimal trading.' },
        { name: 'Balanced', tolerance: '0.5', drawdown: '15%', threshold: '5%', desc: 'Moderate risk-return with regular rebalancing.' },
        { name: 'Aggressive', tolerance: '0.8', drawdown: '30%', threshold: '8%', desc: 'Growth-oriented with higher volatility tolerance.' },
      ].map(p => (
        <div key={p.name} className="rounded-xl border border-border/40 bg-card/50 p-4">
          <h4 className="font-bold text-[14px] text-foreground mb-2">{p.name}</h4>
          <div className="space-y-1 text-[12px] text-foreground/60 mb-2">
            <p>Tolerance: <span className="font-mono text-primary">{p.tolerance}</span></p>
            <p>Max Drawdown: <span className="font-mono text-primary">{p.drawdown}</span></p>
            <p>Drift Threshold: <span className="font-mono text-primary">{p.threshold}</span></p>
          </div>
          <p className="text-[12px] text-muted-foreground">{p.desc}</p>
        </div>
      ))}
    </div>

    <CodeBlock language="typescript" code={`// Apply a preset profile
await apex.vault.applyPreset(vault.id, 'balanced');

// Or customize individual parameters
await apex.vault.updateRisk(vault.id, {
  riskTolerance: 0.65,
  maxDrawdown: 0.12,
  rebalanceThreshold: 4,
  maxPositionSize: 0.40,
  correlationLimit: 0.75,
});`} />

    <InfoBanner>
      Changing risk parameters requires a wallet signature and takes effect after the current rebalance cycle completes. There is a 24-hour cooldown on risk parameter changes to prevent manipulation.
    </InfoBanner>
  </>
);

/* ── Rebalancing ── */
const RebalancingContent = () => (
  <>
    <p className="text-[14px] text-foreground/70 leading-relaxed mb-6">
      Rebalancing is the core operation of APEX. When asset prices move and cause your portfolio to drift from target allocations, the agent pipeline automatically computes and executes trades to realign your holdings.
    </p>

    <h2 className="font-inter font-bold text-[22px] text-foreground mb-4">Rebalancing Pipeline</h2>
    <div className="rounded-xl border border-border/40 bg-card/50 p-5 mb-6 overflow-x-auto">
      <pre className="text-[13px] text-foreground/70 font-mono leading-relaxed whitespace-pre">{`Price Movement ──▶ Drift Detection ──▶ Trade Planning ──▶ Execution ──▶ Settlement
                      (Monitor)         (Decision)       (Execution)   (Settlement)
                         │                   │                │              │
                    Poll every 30s    Risk validation    Gas + MEV     Compliance
                    Chainlink feeds   Optimization       Private relay  HSP atomic`}</pre>
    </div>

    <h2 className="font-inter font-bold text-[22px] text-foreground mt-8 mb-4">Drift Calculation Example</h2>
    <p className="text-[13.5px] text-foreground/70 leading-relaxed mb-4">
      Consider a vault with three assets. When ETH rises 20%, the portfolio drifts from target allocations:
    </p>
    <div className="overflow-x-auto mb-6">
      <table className="w-full text-[13px] border-collapse">
        <thead>
          <tr className="border-b border-border/40">
            <th className="text-left py-2 px-3 text-foreground/80 font-semibold">Asset</th>
            <th className="text-left py-2 px-3 text-foreground/80 font-semibold">Target</th>
            <th className="text-left py-2 px-3 text-foreground/80 font-semibold">Current</th>
            <th className="text-left py-2 px-3 text-foreground/80 font-semibold">Drift</th>
          </tr>
        </thead>
        <tbody className="text-foreground/60">
          <tr className="border-b border-border/20"><td className="py-2 px-3 font-mono">tUSTB</td><td className="py-2 px-3">40%</td><td className="py-2 px-3">35%</td><td className="py-2 px-3 text-primary">-5%</td></tr>
          <tr className="border-b border-border/20"><td className="py-2 px-3 font-mono">ETH</td><td className="py-2 px-3">35%</td><td className="py-2 px-3">43%</td><td className="py-2 px-3 text-primary">+8%</td></tr>
          <tr><td className="py-2 px-3 font-mono">USDC</td><td className="py-2 px-3">25%</td><td className="py-2 px-3">22%</td><td className="py-2 px-3 text-primary">-3%</td></tr>
        </tbody>
      </table>
    </div>
    <p className="text-[13.5px] text-foreground/70 leading-relaxed mb-4">
      Total drift = |5| + |8| + |3| = 16%. If the rebalance threshold is 5%, this triggers a rebalance: sell ETH, buy tUSTB and USDC.
    </p>

    <h2 className="font-inter font-bold text-[22px] text-foreground mt-8 mb-4">Rebalance History</h2>
    <CodeBlock language="typescript" code={`// Fetch rebalance history
const history = await apex.vault.rebalanceHistory('vault-123', {
  limit: 10,
  from: '2026-01-01',
});

history.forEach(event => {
  console.log(\`[\${event.timestamp}] Drift: \${event.driftBefore}% → \${event.driftAfter}%\`);
  console.log(\`  Trades: \${event.trades.length}, Gas: \${event.gasCostUSD}\`);
  event.trades.forEach(t => {
    console.log(\`    \${t.action} \${t.amount} \${t.token} @ $\${t.price}\`);
  });
});`} />

    <InfoBanner>
      APEX uses a "trade-only-what's-needed" approach — it computes the minimum set of trades to bring the portfolio within threshold, minimizing gas costs and market impact.
    </InfoBanner>
  </>
);

/* ── Deposits & Withdrawals ── */
const DepositsWithdrawalsContent = () => (
  <>
    <p className="text-[14px] text-foreground/70 leading-relaxed mb-6">
      APEX supports multi-asset deposits and flexible withdrawal strategies. Funds are managed through non-custodial vault contracts — only your wallet can initiate withdrawals.
    </p>

    <h2 className="font-inter font-bold text-[22px] text-foreground mb-4">Deposits</h2>
    <p className="text-[13.5px] text-foreground/70 leading-relaxed mb-4">
      Deposit USDC, HSK, or ETH into your vault. Deposits are automatically allocated according to your target weights using the auto-allocation preview.
    </p>
    <CodeBlock language="typescript" code={`// Deposit with auto-allocation preview
const preview = await apex.vault.previewDeposit({
  vaultId: 'vault-123',
  amount: '10000',
  token: 'USDC',
});

console.log('Allocation preview:');
preview.allocations.forEach(a => {
  console.log(\`  \${a.token}: $\${a.amountUSD} (\${a.weight * 100}%)\`);
});
// tUSTB: $3,000 (30%)
// rREF:  $2,000 (20%)
// cBOND: $2,000 (20%)
// gGOLD: $1,000 (10%)
// USDC:  $2,000 (20%)

// Confirm deposit
const receipt = await apex.vault.deposit({
  vaultId: 'vault-123',
  amount: '10000',
  token: 'USDC',
});

console.log('Deposit tx:', receipt.txHash);`} />

    <InfoBanner>
      NexaID verification is required before your first deposit. Subsequent deposits from the same verified wallet are processed immediately.
    </InfoBanner>

    <h2 className="font-inter font-bold text-[22px] text-foreground mt-8 mb-4">Withdrawals</h2>
    <p className="text-[13.5px] text-foreground/70 leading-relaxed mb-4">
      APEX supports two withdrawal modes, each optimized for different use cases:
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
      <div className="rounded-xl border border-border/40 bg-card/50 p-5">
        <h4 className="font-bold text-[14px] text-foreground mb-2">Yield Only</h4>
        <p className="text-[12.5px] text-muted-foreground leading-relaxed">
          Withdraw only accumulated yield while preserving your principal. Ideal for income-focused strategies. Available once yield exceeds the minimum withdrawal threshold.
        </p>
      </div>
      <div className="rounded-xl border border-border/40 bg-card/50 p-5">
        <h4 className="font-bold text-[14px] text-foreground mb-2">Partial Withdrawal</h4>
        <p className="text-[12.5px] text-muted-foreground leading-relaxed">
          Withdraw a specific dollar amount from your vault. Agents proportionally liquidate across all assets to maintain target allocation ratios.
        </p>
      </div>
    </div>
    <CodeBlock language="typescript" code={`// Yield-only withdrawal
const yieldWithdrawal = await apex.vault.withdraw({
  vaultId: 'vault-123',
  mode: 'yield-only',
  destination: { type: 'wallet' },  // On-chain to your wallet
});

// Partial withdrawal to bank via HSP
const bankWithdrawal = await apex.vault.withdraw({
  vaultId: 'vault-123',
  mode: 'partial',
  amount: '5000',
  destination: {
    type: 'bank',
    bankDetails: {
      name: 'Acme Fund LLC',
      iban: 'GB29NWBK60161331926819',
      swift: 'NWBKGB2L',
    },
  },
});

console.log('Settlement via HSP:', bankWithdrawal.hspReceiptId);`} />

    <h2 className="font-inter font-bold text-[22px] text-foreground mt-8 mb-4">Destination Routing</h2>
    <div className="overflow-x-auto">
      <table className="w-full text-[13px] border-collapse">
        <thead>
          <tr className="border-b border-border/40">
            <th className="text-left py-2 px-3 text-foreground/80 font-semibold">Destination</th>
            <th className="text-left py-2 px-3 text-foreground/80 font-semibold">Settlement</th>
            <th className="text-left py-2 px-3 text-foreground/80 font-semibold">Time</th>
            <th className="text-left py-2 px-3 text-foreground/80 font-semibold">Fee</th>
          </tr>
        </thead>
        <tbody className="text-foreground/60">
          <tr className="border-b border-border/20"><td className="py-2 px-3">On-chain wallet</td><td className="py-2 px-3">Direct transfer</td><td className="py-2 px-3">~30 seconds</td><td className="py-2 px-3">Gas only</td></tr>
          <tr><td className="py-2 px-3">Bank (cross-border)</td><td className="py-2 px-3">HSP Protocol</td><td className="py-2 px-3">1–3 business days</td><td className="py-2 px-3">0.1% + gas</td></tr>
        </tbody>
      </table>
    </div>
  </>
);

/* ── HashKey Chain ── */
const HashKeyChainContent = () => (
  <>
    <p className="text-[14px] text-foreground/70 leading-relaxed mb-6">
      APEX is built natively on HashKey Chain (Chain ID: 133), a high-performance EVM-compatible Layer 2 optimized for regulated digital assets and real-world asset tokenization.
    </p>

    <h2 className="font-inter font-bold text-[22px] text-foreground mb-4">Chain Details</h2>
    <div className="overflow-x-auto mb-6">
      <table className="w-full text-[13px] border-collapse">
        <thead>
          <tr className="border-b border-border/40">
            <th className="text-left py-2 px-3 text-foreground/80 font-semibold">Property</th>
            <th className="text-left py-2 px-3 text-foreground/80 font-semibold">Value</th>
          </tr>
        </thead>
        <tbody className="text-foreground/60">
          <tr className="border-b border-border/20"><td className="py-2 px-3 font-semibold text-foreground/70">Chain ID</td><td className="py-2 px-3 font-mono">133</td></tr>
          <tr className="border-b border-border/20"><td className="py-2 px-3 font-semibold text-foreground/70">Native Token</td><td className="py-2 px-3 font-mono">HSK</td></tr>
          <tr className="border-b border-border/20"><td className="py-2 px-3 font-semibold text-foreground/70">Block Time</td><td className="py-2 px-3">~2 seconds</td></tr>
          <tr className="border-b border-border/20"><td className="py-2 px-3 font-semibold text-foreground/70">Consensus</td><td className="py-2 px-3">Optimistic Rollup</td></tr>
          <tr className="border-b border-border/20"><td className="py-2 px-3 font-semibold text-foreground/70">EVM Compatible</td><td className="py-2 px-3">Yes (Solidity ^0.8.x)</td></tr>
          <tr><td className="py-2 px-3 font-semibold text-foreground/70">RPC Endpoint</td><td className="py-2 px-3 font-mono">https://rpc.hashkey.com</td></tr>
        </tbody>
      </table>
    </div>

    <h2 className="font-inter font-bold text-[22px] text-foreground mb-4">Network Configuration</h2>
    <CodeBlock language="typescript" code={`// Add HashKey Chain to MetaMask programmatically
await window.ethereum.request({
  method: 'wallet_addEthereumChain',
  params: [{
    chainId: '0x85',  // 133 in hex
    chainName: 'HashKey Chain',
    nativeCurrency: { name: 'HSK', symbol: 'HSK', decimals: 18 },
    rpcUrls: ['https://rpc.hashkey.com'],
    blockExplorerUrls: ['https://explorer.hashkey.com'],
  }],
});`} />

    <h2 className="font-inter font-bold text-[22px] text-foreground mt-8 mb-4">APEX Contract Addresses</h2>
    <CodeBlock language="bash" code={`# Mainnet (Chain ID 133)
VaultFactory:    0x7A1B...3F9E
AgentRegistry:   0x4C2D...8A1B
HSPSettlement:   0x9E3F...2C4D
NexaIDVerifier:  0x1B5A...7E3F

# Testnet (Chain ID 13300)
VaultFactory:    0xTEST...1234
AgentRegistry:   0xTEST...5678`} />

    <InfoBanner>
      HashKey Chain's low gas costs (avg. ~$0.001 per transaction) make APEX rebalancing economically viable even for smaller portfolios.
    </InfoBanner>
  </>
);

/* ── Chainlink Feeds ── */
const ChainlinkFeedsContent = () => (
  <>
    <p className="text-[14px] text-foreground/70 leading-relaxed mb-6">
      APEX relies on Chainlink's decentralized oracle network for tamper-proof price data. The Monitor Agent reads these feeds to compute portfolio weights and detect drift.
    </p>

    <h2 className="font-inter font-bold text-[22px] text-foreground mb-4">Supported Price Feeds</h2>
    <div className="overflow-x-auto mb-6">
      <table className="w-full text-[13px] border-collapse">
        <thead>
          <tr className="border-b border-border/40">
            <th className="text-left py-2 px-3 text-foreground/80 font-semibold">Pair</th>
            <th className="text-left py-2 px-3 text-foreground/80 font-semibold">Feed Address</th>
            <th className="text-left py-2 px-3 text-foreground/80 font-semibold">Heartbeat</th>
            <th className="text-left py-2 px-3 text-foreground/80 font-semibold">Deviation</th>
          </tr>
        </thead>
        <tbody className="text-foreground/60">
          <tr className="border-b border-border/20"><td className="py-2 px-3 font-mono">HSK/USD</td><td className="py-2 px-3 font-mono text-[11px]">0xABC...1234</td><td className="py-2 px-3">60s</td><td className="py-2 px-3">0.5%</td></tr>
          <tr className="border-b border-border/20"><td className="py-2 px-3 font-mono">tUSTB/USD</td><td className="py-2 px-3 font-mono text-[11px]">0xDEF...5678</td><td className="py-2 px-3">3600s</td><td className="py-2 px-3">0.1%</td></tr>
          <tr className="border-b border-border/20"><td className="py-2 px-3 font-mono">ETH/USD</td><td className="py-2 px-3 font-mono text-[11px]">0x123...ABCD</td><td className="py-2 px-3">60s</td><td className="py-2 px-3">0.5%</td></tr>
          <tr><td className="py-2 px-3 font-mono">XAU/USD</td><td className="py-2 px-3 font-mono text-[11px]">0x456...EFGH</td><td className="py-2 px-3">3600s</td><td className="py-2 px-3">0.25%</td></tr>
        </tbody>
      </table>
    </div>

    <h2 className="font-inter font-bold text-[22px] text-foreground mb-4">Reading Price Feeds</h2>
    <CodeBlock language="solidity" code={`// Solidity — Read Chainlink price feed
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceConsumer {
    AggregatorV3Interface internal priceFeed;

    constructor(address feedAddress) {
        priceFeed = AggregatorV3Interface(feedAddress);
    }

    function getLatestPrice() public view returns (int256) {
        (
            /* uint80 roundID */,
            int256 price,
            /* uint startedAt */,
            uint timeStamp,
            /* uint80 answeredInRound */
        ) = priceFeed.latestRoundData();

        // Stale price check
        require(block.timestamp - timeStamp < 120, "Stale price");
        return price;
    }
}`} />

    <h2 className="font-inter font-bold text-[22px] text-foreground mt-8 mb-4">SDK Access</h2>
    <CodeBlock language="typescript" code={`// Get all price feeds via the APEX SDK
const feeds = await apex.chainlink.getAllFeeds();

feeds.forEach(feed => {
  console.log(\`\${feed.pair}: $\${feed.price} (updated \${feed.age}s ago)\`);
});

// Subscribe to price updates
apex.chainlink.subscribe('HSK/USD', (update) => {
  console.log(\`HSK price: $\${update.price} at round \${update.roundId}\`);
});`} />

    <InfoBanner>
      APEX validates price freshness before every decision. If a Chainlink feed is stale (older than the configured <code className="font-mono text-[12px]">stalePriceWindow</code>), the Monitor Agent pauses and emits a warning alert.
    </InfoBanner>
  </>
);

/* ── NexaID KYC ── */
const NexaIdKycContent = () => (
  <>
    <p className="text-[14px] text-foreground/70 leading-relaxed mb-6">
      NexaID provides on-chain identity verification for APEX vaults. It ensures that all participants meet regulatory requirements before accessing RWA markets.
    </p>

    <h2 className="font-inter font-bold text-[22px] text-foreground mb-4">Verification Flow</h2>
    <div className="rounded-xl border border-border/40 bg-card/50 p-5 mb-6 overflow-x-auto">
      <pre className="text-[13px] text-foreground/70 font-mono leading-relaxed whitespace-pre">{`User Wallet ──▶ NexaID Widget ──▶ Document Upload ──▶ Verification
                                                         │
                                               ┌────────┴────────┐
                                           Approved          Rejected
                                               │                 │
                                      SBT Minted to        Retry with
                                        Wallet            Different Docs`}</pre>
    </div>

    <h2 className="font-inter font-bold text-[22px] text-foreground mt-8 mb-4">Integration</h2>
    <p className="text-[13.5px] text-foreground/70 leading-relaxed mb-4">
      NexaID issues a Soulbound Token (SBT) to verified wallets. APEX vault contracts check for this token before allowing deposits or withdrawals.
    </p>
    <CodeBlock language="typescript" code={`// Check NexaID verification status
const verification = await apex.nexaid.getStatus(walletAddress);

console.log('KYC Status:', verification.status);    // 'verified' | 'pending' | 'expired'
console.log('Level:', verification.level);           // 'basic' | 'accredited'
console.log('Jurisdiction:', verification.country);  // 'US', 'HK', 'SG', etc.
console.log('SBT Token:', verification.sbtTokenId);
console.log('Expires:', verification.expiresAt);

// Trigger verification flow in your app
const session = await apex.nexaid.createSession({
  walletAddress: '0xYOUR_WALLET',
  redirectUrl: 'https://yourapp.com/kyc-callback',
  level: 'accredited',  // Required for RWA access
});

// Redirect user to NexaID
window.location.href = session.verificationUrl;`} />

    <h2 className="font-inter font-bold text-[22px] text-foreground mt-8 mb-4">Verification Levels</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
      <div className="rounded-xl border border-border/40 bg-card/50 p-5">
        <h4 className="font-bold text-[14px] text-foreground mb-2">Basic KYC</h4>
        <p className="text-[12.5px] text-muted-foreground leading-relaxed mb-2">ID document + liveness check. Grants access to crypto-only vaults and stablecoin deposits.</p>
        <p className="text-[11px] text-primary font-mono">Processing: ~5 minutes</p>
      </div>
      <div className="rounded-xl border border-primary/30 bg-primary/[0.04] p-5">
        <h4 className="font-bold text-[14px] text-foreground mb-2">Accredited Investor</h4>
        <p className="text-[12.5px] text-muted-foreground leading-relaxed mb-2">Full KYC + income/asset verification. Required for RWA vaults (tUSTB, rREF, cBOND, gGOLD).</p>
        <p className="text-[11px] text-primary font-mono">Processing: 1–3 business days</p>
      </div>
    </div>

    <InfoBanner>
      NexaID SBTs expire after 12 months. APEX agents will pause vault operations and notify you 30 days before expiration. Re-verification is a streamlined process.
    </InfoBanner>
  </>
);

/* ── HSP Protocol ── */
const HspProtocolContent = () => (
  <>
    <p className="text-[14px] text-foreground/70 leading-relaxed mb-6">
      HSP (HashKey Settlement Protocol) enables atomic delivery-vs-payment settlement for tokenized assets. APEX uses HSP for all RWA trade settlements and cross-border bank withdrawals.
    </p>

    <h2 className="font-inter font-bold text-[22px] text-foreground mb-4">How HSP Works</h2>
    <div className="rounded-xl border border-border/40 bg-card/50 p-5 mb-6 overflow-x-auto">
      <pre className="text-[13px] text-foreground/70 font-mono leading-relaxed whitespace-pre">{`Trade Confirmed ──▶ HSP Escrow ──▶ Compliance Gate ──▶ Atomic Settlement
                        │                │                    │
                   Lock assets     NexaID check        Simultaneous:
                   in escrow      Jurisdiction check    Asset transfer
                                  Sanction screening    Payment release
                                                        Receipt minted`}</pre>
    </div>

    <h2 className="font-inter font-bold text-[22px] text-foreground mt-8 mb-4">Settlement Contract</h2>
    <CodeBlock language="solidity" code={`// HSP Settlement Interface
interface IHSPSettlement {
    struct Receipt {
        bytes32 id;
        address buyer;
        address seller;
        address asset;
        uint256 assetAmount;
        uint256 paymentAmount;
        uint256 settledAt;
        bool compliant;
    }

    /// @notice Initiate atomic DvP settlement
    function settle(
        address buyer,
        address seller,
        address asset,
        uint256 assetAmount,
        address paymentToken,
        uint256 paymentAmount
    ) external returns (bytes32 receiptId);

    /// @notice Query settlement receipt
    function getReceipt(bytes32 receiptId)
        external view returns (Receipt memory);

    /// @notice Check if address is settlement-eligible
    function isEligible(address party)
        external view returns (bool);
}`} />

    <h2 className="font-inter font-bold text-[22px] text-foreground mt-8 mb-4">Cross-Border Settlements</h2>
    <p className="text-[13.5px] text-foreground/70 leading-relaxed mb-4">
      For bank withdrawals, HSP coordinates with licensed payment rails to convert on-chain assets to fiat and wire to the destination bank account.
    </p>
    <CodeBlock language="typescript" code={`// Initiate a cross-border settlement
const settlement = await apex.hsp.initiate({
  vaultId: 'vault-123',
  amount: '50000',
  token: 'USDC',
  destination: {
    type: 'bank_wire',
    currency: 'USD',
    bank: {
      name: 'Acme Fund LLC',
      iban: 'GB29NWBK60161331926819',
      swift: 'NWBKGB2L',
      country: 'GB',
    },
  },
});

console.log('HSP Receipt:', settlement.receiptId);
console.log('Status:', settlement.status);            // 'processing'
console.log('Est. arrival:', settlement.estimatedAt);  // '2026-04-09T14:00:00Z'

// Track settlement progress
const status = await apex.hsp.track(settlement.receiptId);
console.log('Steps completed:', status.completedSteps);
console.log('Current step:', status.currentStep);`} />

    <InfoBanner>
      HSP settlements are final and irreversible once the atomic swap completes. Cross-border wire transfers typically settle within 1–3 business days depending on the destination country.
    </InfoBanner>
  </>
);

/* ── Generic sub-page content ── */
const GenericContent = ({ slug }: { slug: string }) => {
  const label = findLabelForSlug(slug) || slug;
  return (
    <>
      <p className="text-[14px] text-foreground/70 leading-relaxed mb-6">
        Documentation for <strong>{label}</strong> is coming soon. This page will contain detailed guides, code examples, and best practices.
      </p>
      <InfoBanner>
        This section is under active development. Check back soon or join our community for early access to documentation drafts.
      </InfoBanner>
      <CodeBlock
        language="bash"
        code={`# Install the APEX CLI
npm install -g @apex/cli

# Check docs for ${slug}
apex docs ${slug}`}
      />
    </>
  );
};

/* ── Tab content components ── */
const ApiReferenceTabContent = () => (
  <>
    <h2 className="font-inter font-bold text-[22px] text-foreground mb-4">API Reference</h2>
    <p className="text-[14px] text-foreground/70 leading-relaxed mb-6">
      Complete REST API documentation for the APEX protocol. All endpoints require authentication via API key.
    </p>
    <h3 className="font-inter font-bold text-[16px] text-foreground mb-3">Base URL</h3>
    <CodeBlock language="bash" code="https://api.apex.hashkey.com/v1" />
    <h3 className="font-inter font-bold text-[16px] text-foreground mt-6 mb-3">Authentication</h3>
    <CodeBlock language="bash" code={`curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://api.apex.hashkey.com/v1/vaults`} />
    <h3 className="font-inter font-bold text-[16px] text-foreground mt-6 mb-3">Endpoints</h3>
    <div className="space-y-2">
      {[
        { method: 'GET', path: '/vaults', desc: 'List all vaults' },
        { method: 'POST', path: '/vaults', desc: 'Create a new vault' },
        { method: 'GET', path: '/vaults/:id', desc: 'Get vault details' },
        { method: 'POST', path: '/vaults/:id/deposit', desc: 'Deposit funds' },
        { method: 'POST', path: '/vaults/:id/withdraw', desc: 'Withdraw funds' },
        { method: 'GET', path: '/agents/status', desc: 'Get agent statuses' },
      ].map(ep => (
        <div key={ep.path + ep.method} className="flex items-center gap-3 rounded-lg border border-border/30 bg-card/50 px-4 py-3">
          <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${ep.method === 'GET' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'}`}>
            {ep.method}
          </span>
          <code className="text-[13px] font-mono text-foreground/80">{ep.path}</code>
          <span className="text-[12px] text-muted-foreground ml-auto hidden sm:inline">{ep.desc}</span>
        </div>
      ))}
    </div>
  </>
);

const ExamplesTabContent = () => (
  <>
    <h2 className="font-inter font-bold text-[22px] text-foreground mb-4">Examples</h2>
    <p className="text-[14px] text-foreground/70 leading-relaxed mb-6">
      Ready-to-use code examples to help you integrate APEX into your projects.
    </p>
    <h3 className="font-inter font-bold text-[16px] text-foreground mb-3">Create & Fund a Vault</h3>
    <CodeBlock language="typescript" code={`import { ApexSDK } from '@apex/sdk';

const apex = new ApexSDK({ apiKey: process.env.APEX_KEY! });

async function main() {
  const vault = await apex.vault.create({
    name: 'DeFi Portfolio',
    riskTolerance: 0.7,
    allocations: { 'ETH': 0.5, 'USDC': 0.3, 'RWA-BOND': 0.2 },
  });

  await apex.vault.deposit({ vaultId: vault.id, amount: '5000', token: 'USDC' });
  await apex.vault.activate(vault.id);
  
  console.log('Vault active:', vault.id);
}

main();`} />
    <h3 className="font-inter font-bold text-[16px] text-foreground mt-6 mb-3">Listen to Webhook Events</h3>
    <CodeBlock language="typescript" code={`// Express webhook handler
app.post('/webhook/apex', (req, res) => {
  const { event, data } = req.body;
  
  switch (event) {
    case 'vault.rebalanced':
      console.log('Rebalance:', data.trades);
      break;
    case 'agent.alert':
      console.log('Alert:', data.message);
      break;
  }
  
  res.sendStatus(200);
});`} />
  </>
);

const ChangelogTabContent = () => (
  <>
    <h2 className="font-inter font-bold text-[22px] text-foreground mb-6">Changelog</h2>
    {[
      { version: 'v0.4.0', date: 'March 2026', changes: ['Added HSP Protocol settlement integration', 'Improved rebalancing algorithm efficiency by 40%', 'New Python SDK beta release'] },
      { version: 'v0.3.0', date: 'February 2026', changes: ['NexaID KYC integration', 'Webhook support for real-time events', 'Dashboard portfolio analytics'] },
      { version: 'v0.2.0', date: 'January 2026', changes: ['Multi-vault support', 'Chainlink price feed integration', 'TypeScript SDK v1.0'] },
      { version: 'v0.1.0', date: 'December 2025', changes: ['Initial testnet launch', 'Basic vault creation and management', 'Monitor and Decision agents'] },
    ].map(release => (
      <div key={release.version} className="mb-8 pb-8 border-b border-border/20 last:border-0">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[14px] font-bold text-primary">{release.version}</span>
          <span className="text-[12px] text-muted-foreground">{release.date}</span>
        </div>
        <ul className="space-y-1.5">
          {release.changes.map((c, i) => (
            <li key={i} className="text-[13px] text-foreground/60 flex gap-2">
              <span className="text-primary">•</span>{c}
            </li>
          ))}
        </ul>
      </div>
    ))}
  </>
);

const HelpCenterTabContent = () => (
  <>
    <h2 className="font-inter font-bold text-[22px] text-foreground mb-4">Help Center</h2>
    <p className="text-[14px] text-foreground/70 leading-relaxed mb-6">
      Need help? Find answers to common questions or reach out to our team.
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[
        { title: 'FAQ', desc: 'Answers to frequently asked questions about APEX.' },
        { title: 'Community Discord', desc: 'Join our Discord server for real-time support.' },
        { title: 'GitHub Issues', desc: 'Report bugs or request features on GitHub.' },
        { title: 'Email Support', desc: 'Contact support@apex.hashkey.com for help.' },
      ].map(item => (
        <div key={item.title} className="group rounded-xl border border-border/40 bg-card/50 hover:bg-card hover:border-border/80 transition-all p-5 cursor-pointer">
          <h4 className="font-bold text-[14px] text-foreground mb-1.5">{item.title}</h4>
          <p className="text-[12.5px] text-muted-foreground">{item.desc}</p>
        </div>
      ))}
    </div>
  </>
);

/* ── Main content router ── */
interface DocsPageContentProps {
  activeTab: string;
  activeSlug: string;
}

export const DocsPageContent = ({ activeTab, activeSlug }: DocsPageContentProps) => {
  const sectionHeading = findSectionForSlug(activeSlug);
  const label = findLabelForSlug(activeSlug);
  const { prev, next } = getAdjacentSlugs(activeSlug);

  // Non-Guides tabs have their own content
  if (activeTab !== 'guides') {
    const tabTitle = activeTab === 'api-reference' ? 'API Reference'
      : activeTab === 'examples' ? 'Examples'
      : activeTab === 'changelog' ? 'Changelog'
      : 'Help Center';
    
    return (
      <main className="flex-1 min-w-0 px-6 md:px-10 lg:px-16 py-10 max-w-4xl">
        <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground mb-2">
          <span>{tabTitle}</span>
        </div>
        <h1 className="font-inter font-extrabold text-[32px] md:text-[40px] text-foreground tracking-tight mb-8">
          {tabTitle}
        </h1>
        {activeTab === 'api-reference' && <ApiReferenceTabContent />}
        {activeTab === 'examples' && <ExamplesTabContent />}
        {activeTab === 'changelog' && <ChangelogTabContent />}
        {activeTab === 'help-center' && <HelpCenterTabContent />}
      </main>
    );
  }

  // Guides tab — slug-based content
  return (
    <main className="flex-1 min-w-0 px-6 md:px-10 lg:px-16 py-10 max-w-4xl">
      <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground mb-2">
        <span>{sectionHeading}</span>
        <ChevronRight size={10} />
        <span className="text-foreground">{label}</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h1 className="font-inter font-extrabold text-[32px] md:text-[40px] text-foreground tracking-tight">
          {label}
        </h1>
        <button className="hidden md:flex items-center gap-1.5 rounded-lg border border-border/50 bg-card/50 px-3 py-1.5 text-[12px] text-muted-foreground hover:text-foreground hover:border-border transition-colors">
          <Copy size={12} />
          Copy page
        </button>
      </div>

      {activeSlug === 'quick-start' && <QuickStartContent />}
      {activeSlug === 'overview' && <OverviewContent />}
      {activeSlug === 'core-concepts' && <CoreConceptsContent />}
      {activeSlug === 'pricing' && <PricingContent />}
      {activeSlug === 'monitor-agent' && <MonitorAgentContent />}
      {activeSlug === 'decision-agent' && <DecisionAgentContent />}
      {activeSlug === 'execution-agent' && <ExecutionAgentContent />}
      {activeSlug === 'settlement-agent' && <SettlementAgentContent />}
      {activeSlug === 'creating-vault' && <CreatingVaultContent />}
      {activeSlug === 'risk-parameters' && <RiskParametersContent />}
      {activeSlug === 'rebalancing' && <RebalancingContent />}
      {activeSlug === 'deposits-withdrawals' && <DepositsWithdrawalsContent />}
      {activeSlug === 'hashkey-chain' && <HashKeyChainContent />}
      {activeSlug === 'chainlink-feeds' && <ChainlinkFeedsContent />}
      {activeSlug === 'nexaid-kyc' && <NexaIdKycContent />}
      {activeSlug === 'hsp-protocol' && <HspProtocolContent />}
      {!['quick-start', 'overview', 'core-concepts', 'pricing', 'monitor-agent', 'decision-agent', 'execution-agent', 'settlement-agent', 'creating-vault', 'risk-parameters', 'rebalancing', 'deposits-withdrawals', 'hashkey-chain', 'chainlink-feeds', 'nexaid-kyc', 'hsp-protocol'].includes(activeSlug) && <GenericContent slug={activeSlug} />}

      {/* Bottom Navigation */}
      <div className="border-t border-border/30 pt-8 mt-8 flex items-center justify-between">
        {prev ? (
          <Link to={`/docs/${prev}`} className="group flex items-center gap-2 text-[13px] text-muted-foreground hover:text-primary transition-colors">
            <ChevronRight size={14} className="rotate-180 group-hover:-translate-x-0.5 transition-transform" />
            {findLabelForSlug(prev)}
          </Link>
        ) : <div />}
        {next ? (
          <Link to={`/docs/${next}`} className="group flex items-center gap-2 text-[13px] text-muted-foreground hover:text-primary transition-colors">
            Next: {findLabelForSlug(next)}
            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ) : <div />}
      </div>

      <div className="mt-12 pt-8 border-t border-border/20 text-center">
        <p className="text-[12px] text-muted-foreground/60">
          Was this page helpful?{' '}
          <button className="text-primary hover:underline">Yes</button>{' · '}
          <button className="text-primary hover:underline">No</button>
        </p>
      </div>
    </main>
  );
};
