-- Blog posts + Supabase Storage for product images

create table if not exists blog_posts (
  slug text primary key,
  title text not null,
  excerpt text,
  body text not null default '',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_status_published_idx on blog_posts (status, published_at desc);

alter table blog_posts enable row level security;

create policy "Public read published blog posts"
  on blog_posts for select using (status = 'published');

-- Storage bucket for admin-uploaded product photos
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Public read product images bucket"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Service role upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images');

create policy "Service role update product images"
  on storage.objects for update
  using (bucket_id = 'product-images');

create policy "Service role delete product images"
  on storage.objects for delete
  using (bucket_id = 'product-images');
