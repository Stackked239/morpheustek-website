-- MorpheusTEK Phase 2 CMS schema
-- Run in Supabase SQL editor or via `supabase db push`

create extension if not exists "pgcrypto";

-- ── Catalog tables (JSONB payloads match src/lib/catalog.ts shapes) ─────────

create table if not exists categories (
  slug text primary key,
  data jsonb not null,
  sort_order int not null default 0,
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  updated_at timestamptz not null default now()
);

create table if not exists products (
  slug text primary key,
  data jsonb not null,
  sort_order int not null default 0,
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  updated_at timestamptz not null default now()
);

create table if not exists applications (
  slug text primary key,
  data jsonb not null,
  sort_order int not null default 0,
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  updated_at timestamptz not null default now()
);

create table if not exists resources (
  slug text primary key,
  data jsonb not null,
  sort_order int not null default 0,
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  updated_at timestamptz not null default now()
);

-- Product image paths keyed by slug
create table if not exists product_images (
  slug text primary key references products(slug) on delete cascade,
  path text not null,
  updated_at timestamptz not null default now()
);

-- ── Site-wide settings + page copy + homepage section configs ───────────────

create table if not exists content_blocks (
  key text primary key,
  label text not null,
  "group" text not null,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- ── Form submissions (durable log before HubSpot sync) ──────────────────────

create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  form_type text not null,
  payload jsonb not null,
  hubspot_contact_id text,
  hubspot_deal_id text,
  status text not null default 'pending' check (status in ('pending', 'synced', 'failed')),
  error text,
  created_at timestamptz not null default now()
);

-- ── Media metadata (files live in Supabase Storage or /public) ────────────

create table if not exists media_assets (
  id uuid primary key default gen_random_uuid(),
  path text not null unique,
  alt_text text,
  caption text,
  kind text not null default 'image',
  updated_at timestamptz not null default now()
);

-- ── RLS: public read published catalog; service role writes via admin API ───

alter table categories enable row level security;
alter table products enable row level security;
alter table applications enable row level security;
alter table resources enable row level security;
alter table product_images enable row level security;
alter table content_blocks enable row level security;
alter table submissions enable row level security;
alter table media_assets enable row level security;

create policy "Public read published categories"
  on categories for select using (status = 'published');

create policy "Public read published products"
  on products for select using (status = 'published');

create policy "Public read published applications"
  on applications for select using (status = 'published');

create policy "Public read published resources"
  on resources for select using (status = 'published');

create policy "Public read product images"
  on product_images for select using (true);

create policy "Public read content blocks"
  on content_blocks for select using (true);

create policy "Public read media assets"
  on media_assets for select using (true);

-- Submissions: no public read; inserts via service role only (API route)

create index if not exists products_status_idx on products (status);
create index if not exists content_blocks_group_idx on content_blocks ("group");
