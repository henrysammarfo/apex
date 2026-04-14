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

-- ── Per-user notification channels (multi-tenant alert routing) ─────────────
create table if not exists notification_channels (
  id uuid primary key default gen_random_uuid(),
  portfolio_id text not null,
  user_id text,
  channel_type text not null default 'telegram',
  channel_target text not null, -- e.g. telegram chat id
  enabled boolean not null default true,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists ux_notification_channels_target
  on notification_channels (portfolio_id, channel_type, channel_target);
create index if not exists idx_notification_channels_portfolio
  on notification_channels (portfolio_id);

-- Nonce table for Telegram account linking (`/start <token>` flows)
create table if not exists telegram_link_nonces (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  portfolio_id text not null,
  nonce text not null unique,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_telegram_link_nonces_user
  on telegram_link_nonces (user_id, portfolio_id);

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
