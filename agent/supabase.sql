-- APEX backend schema (Supabase / Postgres). Run in SQL editor.
-- Use SUPABASE_SERVICE_ROLE_KEY only from your agent server — never in the browser or Vite bundle.

create extension if not exists "pgcrypto";

-- ── Portfolios (vault metadata, optional NexaID / HSP JSON) ─────────────────────
create table if not exists portfolios (
  id uuid primary key default gen_random_uuid(),
  vault_address text not null unique,
  owner_wallet text not null,
  nexaid_hash text,
  assets jsonb,
  thresholds jsonb,
  hsp_config jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_portfolios_owner on portfolios (owner_wallet);

-- ── Decisions (OpenAI + on-chain audit) ──────────────────────────────────────
create table if not exists decisions (
  id uuid primary key default gen_random_uuid(),
  portfolio_id text not null,
  asset_address text,
  decision_type text not null,
  direction text,
  amount_pct numeric,
  confidence numeric,
  reasoning text,
  reasoning_hash text,
  chainlink_price numeric,
  tx_hash text,
  openai_model text,
  status text not null default 'pending',
  executed_at timestamptz not null default now()
);

create index if not exists idx_decisions_portfolio on decisions (portfolio_id);
create index if not exists idx_decisions_tx on decisions (tx_hash);

-- ── Agent monitor / pipeline logs ───────────────────────────────────────────
create table if not exists agent_logs (
  id uuid primary key default gen_random_uuid(),
  portfolio_id text,
  action text not null,
  details jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_agent_logs_portfolio on agent_logs (portfolio_id);
create index if not exists idx_agent_logs_created on agent_logs (created_at desc);

-- ── Singleton cooldown state for pipeline executor ─────────────────────────
create table if not exists pipeline_state (
  id integer primary key default 1 check (id = 1),
  last_execution_at timestamptz,
  last_tx_hash text,
  updated_at timestamptz not null default now()
);

insert into pipeline_state (id) values (1)
on conflict (id) do nothing;

-- Optional: tighten RLS later if you add Supabase Auth for end users.
-- Service role bypasses RLS for server-side agents.
