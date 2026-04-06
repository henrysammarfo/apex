import React from 'react';

/* ── Sidebar Navigation Data ── */
export const SIDEBAR_SECTIONS = [
  {
    heading: 'Get Started',
    links: [
      { label: 'Quick Start', slug: 'quick-start' },
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

export const TOP_TABS = [
  { label: 'Guides', slug: 'guides' },
  { label: 'API Reference', slug: 'api-reference' },
  { label: 'Examples', slug: 'examples' },
  { label: 'Changelog', slug: 'changelog' },
  { label: 'Help Center', slug: 'help-center' },
];

/* ── Agent Cards ── */
export const AGENT_CARDS = [
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

export const SDK_CARDS = [
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

/* ── Helper: find section heading for a slug ── */
export function findSectionForSlug(slug: string): string | null {
  for (const section of SIDEBAR_SECTIONS) {
    if (section.links.some(l => l.slug === slug)) return section.heading;
  }
  return null;
}

export function findLabelForSlug(slug: string): string | null {
  for (const section of SIDEBAR_SECTIONS) {
    const link = section.links.find(l => l.slug === slug);
    if (link) return link.label;
  }
  return null;
}

/* Get all slugs flat */
export function getAllSlugs(): string[] {
  return SIDEBAR_SECTIONS.flatMap(s => s.links.map(l => l.slug));
}

/* Navigation helpers */
export function getAdjacentSlugs(slug: string) {
  const all = getAllSlugs();
  const idx = all.indexOf(slug);
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  };
}
