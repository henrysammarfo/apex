# Changelog

All notable changes to APEX are documented in this file.

## v0.9.0 - 2026-04-15

- Switched production narrative and implementation to Apex-first rails (`ApexIdentityRegistry`, `ApexSettlementRouter`) with HSP/NexaID framed as optional adapters.
- Added per-vault runtime configuration (`portfolio_runtime_config`) and wired settings persistence into live agent pipeline behavior.
- Added OpenAI decision guardrails (`OPENAI_MIN_INTERVAL_SEC`, `OPENAI_MAX_CALLS_PER_HOUR`) with deterministic fallback and decision source tracking.
- Wired dashboard overview metrics and activity to live Supabase + on-chain reads.
- Added USDC faucet exposure in landing and quick-start docs for cleaner tester onboarding.

## v0.8.0 - 2026-04-14

- Added wallet profile persistence and wallet/email linking flows via Supabase.
- Added per-vault Telegram routing and channel linking utilities for multi-tenant alerts.
- Added robust RPC endpoint health probing/failover for HashKey testnet reliability.

## v0.7.0 - 2026-04-14

- Enabled oracle-weighted monitoring mode with staleness controls.
- Added hybrid decision mode (OpenAI primary with deterministic fallback).
- Hardened pipeline safety controls for cooldown, confidence threshold, and rebalance caps.

## v0.6.0 - 2026-04-13

- Deployed and integrated core contracts on HashKey testnet: vault, decision log, registry, identity, and settlement router.
- Added fixed-supply mock RWA assets and 24h faucet contracts for deterministic demos.
- Expanded smoke test coverage for contracts, RPC, Supabase, Telegram, and full pipeline checks.
