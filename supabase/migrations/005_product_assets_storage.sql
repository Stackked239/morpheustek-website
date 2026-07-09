-- Per-product spec sheet PDFs and software packages (gated downloads on product pages).

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-spec-sheets',
  'product-spec-sheets',
  true,
  52428800,
  array['application/pdf']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-software',
  'product-software',
  true,
  104857600,
  array[
    'application/zip',
    'application/x-zip-compressed',
    'application/gzip',
    'application/x-gzip',
    'application/x-tar',
    'application/octet-stream',
    'application/x-msdownload',
    'application/x-apple-diskimage'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Public read product spec sheets" on storage.objects for select using (bucket_id = 'product-spec-sheets');
create policy "Service role upload product spec sheets" on storage.objects for insert with check (bucket_id = 'product-spec-sheets');
create policy "Service role update product spec sheets" on storage.objects for update using (bucket_id = 'product-spec-sheets');
create policy "Service role delete product spec sheets" on storage.objects for delete using (bucket_id = 'product-spec-sheets');

create policy "Public read product software" on storage.objects for select using (bucket_id = 'product-software');
create policy "Service role upload product software" on storage.objects for insert with check (bucket_id = 'product-software');
create policy "Service role update product software" on storage.objects for update using (bucket_id = 'product-software');
create policy "Service role delete product software" on storage.objects for delete using (bucket_id = 'product-software');
