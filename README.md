# APEX — Autonomous Portfolio Execution Agent

APEX is a live autonomous portfolio execution MVP on HashKey testnet:

- on-chain vault + decision log + identity + settlement rails,
- AI decisioning with deterministic fallback,
- oracle-weighted drift monitoring,
- per-vault Telegram routing for multi-tenant notifications,
- Supabase-backed audit trail and realtime operational logs.

APEX is built as an execution-first, production-oriented autonomous finance stack: open core rails, transparent on-chain auditability, and adapter-ready integrations.

## What Is Live Now

- **Contracts deployed on HashKey testnet** (vault + logging + identity + settlement + faucets)
- **Agent pipeline live**: monitor -> decision -> execution -> audit
- **Oracle mode live** (`oracle_value_weighted`)
- **Realtime notifications live** (Telegram)
- **Realtime backend persistence live** (Supabase)
- **Auth sessions live** (Supabase Auth)

## Architecture

### Core rails (open default)

- `PortfolioVault.sol` - token holdings, allocation configs, rebalance execution
- `DecisionLog.sol` - immutable-style on-chain decision hash trail
- `ApexIdentityRegistry.sol` - open identity attestations + eligibility checks
- `ApexSettlementRouter.sol` - provider-abstracted settlement routing (`APEX`, `HSP` enum)
- `DemoFaucet24h.sol` - fixed-pool 24h claim faucet for repeatable demos

### Agents

- `agent/monitorAgent.mjs` - periodic vault state/oracle drift monitor
- `agent/decisionAgent.mjs` - OpenAI structured decisioning (Zod-validated)
- `agent/pipeline.mjs` - full autonomous loop with safety controls
- `agent/executionAgent.mjs` - manual execution utility
- `agent/settlementAgent.mjs` - HSP adapter shell
- `agent/linkTelegram.mjs` - per-vault Telegram route linker

### Safety/production controls

- confidence floor (`MIN_DECISION_CONFIDENCE`)
- cooldown (`MIN_SECONDS_BETWEEN_EXECUTIONS`)
- max rebalance cap (`MAX_REBALANCE_PCT_OF_BALANCE`)
- alert dedupe throttle (`MONITOR_ALERT_MIN_INTERVAL_SEC`)
- deterministic fallback (`DECISION_MODE=hybrid|deterministic|ai`)
- RPC failover + health probing (`HASHKEY_TESTNET_RPCS`)
- oracle staleness guard (`ORACLE_MAX_STALENESS_SEC`)

## Latest Deployment (HashKey Testnet)

Deployment performed from wallet: `0x2F914bcbAD5bf4967BbB11e4372200b7c7594AEB`

- `PortfolioVault`: `0x9de742296f6F680A3F953a7bfc5a6F6f9a52aC9d`
- `DecisionLog`: `0xeF57972f97F13a5833a666FAB24b08Ef59f1CA3A`
- `AgentRegistry`: `0x917b514C0B0cf8e174c9B5379e0cbc5527B25bb6`
- `ApexIdentityRegistry`: `0x622f5a7c1A075C0d2dE06485B1E8b0D71BB6fC7e`
- `ApexSettlementRouter`: `0xEd9987C9fDcD008661DD21D67f24aA818Ea4Aa48`
- `MockRWA Silver`: `0x4192696687a540B92b2CAf25442C94843cC6DD03`
- `MockRWA MMF`: `0x5F411a8879A67ed0be12Fd5257750211cE4fA503`
- `MockRWA Securities`: `0x42E3F51Ab897410B03655c00049fA2F0fCE9f056`
- `Mock Testnet USDC`: `0x1d82f5Da580b43b708617A8947Eeab0D38152077`
- `Faucet Silver`: `0x37216d1535dF725d58eDD037897185a8bA388a99`
- `Faucet MMF`: `0x83CDf2C2Fa137A7310Ff58914bD9F72e2717faaD`
- `Faucet Securities`: `0x64C1708e098aaF555320CBd24aFc7E8FaA706859`
- `Faucet USDC`: `0x355880a1b0848eB0e7064A22F365a68E30AdC7D7`

## Realtime Oracle Mapping (Current MVP)

Mock assets are mapped to live reference feeds for realtime behavior testing:

- `mSILV` -> APRO BTC/USD feed
- `mMMF` -> APRO USDC/USD feed
- `mSEC` -> APRO USDT/USD feed

This proves live oracle ingestion and autonomous control flow.  
Production mapping should move to issuer-specific RWA feeds/attestations.

## Smoke-Test Evidence

Run:

```bash
npm run smoke:all
```

Expected output includes:

- `ok: true`
- `mode: "oracle_value_weighted"`
- `supabaseWriteOk: true`
- `telegramEnabled: true`

## Prerequisites

```bash
node -v
```

- Node.js `>=20`
- npm `>=10`
- A Supabase project (for logs/settings/auth tables)
- Optional: OpenAI API key (without it, run deterministic mode)

## Environment Setup (Required)

1. Copy env templates:

```bash
copy .env.example .env
copy .env.example .env.local
```

2. Fill only required keys:

- In `.env`: `HASHKEY_TESTNET_RPC`, `VAULT_CONTRACT`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- Optional in `.env`: `OPENAI_API_KEY` (if omitted, use `DECISION_MODE=deterministic`)
- In `.env.local`: `VITE_PUBLIC_VAULT_ADDRESS`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

3. Run database schema once in Supabase SQL editor:

- `agent/supabase.sql`

## Quick Start (Judge Path: ~15 minutes)

```bash
npm install
npm run contracts:compile
npm run contracts:test
npm run smoke:all
npm run dev
```

USDC-only deploy (without redeploying other contracts):

```bash
$env:DEPLOY_MODE="usdc_only"
npm run contracts:deploy:usdc:testnet
Remove-Item Env:DEPLOY_MODE
```

If you want autonomous backend loop running locally in parallel:

```bash
npm run agent:pipeline
```

Open app:

```bash
http://localhost:5173
```

Expected successful smoke-test signals:

- `ok: true`
- `mode: "oracle_value_weighted"` (or deterministic mode if configured)
- `supabaseWriteOk: true`
- `telegramEnabled: true` (if telegram envs set)

## Troubleshooting (Judge Fast Fixes)

- `OPENAI_API_KEY` missing or rate-limited:
  - set `DECISION_MODE=deterministic` in `.env` and re-run smoke test
- RPC instability:
  - set `HASHKEY_TESTNET_RPCS` with multiple endpoints (comma-separated)
- Supabase write errors:
  - verify schema from `agent/supabase.sql` has been executed
- Frontend auth redirect mismatch:
  - ensure Supabase Auth URLs include local `http://localhost:5173/*` routes

## Bible Alignment Check (Hackathon Scope)

- ✅ HashKey testnet deployment and live operation
- ✅ Autonomous monitor/decision/execution loop
- ✅ Oracle-powered drift logic
- ✅ On-chain audit trail for decisions/executions
- ✅ Payment/identity rails implemented as open core + adapter-ready
- ✅ Multi-tenant notification routing
- ⚠️ HSP/NexaID external credentials can be integrated when available (adapters already scaffolded)

## Current Limits

- Mock RWA instruments are demo assets, not regulated custody-backed securities.
- Oracle mapping currently uses live reference proxies for agent behavior validation.
- Mainnet-grade issuer custody proof feeds are future integration work.

## Security

- `.env` and `*.local` are gitignored.
- Rotate any exposed keys before production deployment.
- Keep service-role and private keys server-side only.

## Privacy

See `PRIVACY.md`.

## Changelog

See `CHANGELOG.md`.

## Brand Assets

| Asset | Path | Usage |
|-------|------|-------|
| Favicon | `public/favicon.png` | Browser tab icon |
| Square Logo | `src/assets/apex-logo-square.png` | X / LinkedIn profile picture |
| Cover Banner | `src/assets/apex-cover.jpg` | LinkedIn / X cover image |

## License

© 2026 APEX Protocol. All rights reserved.
