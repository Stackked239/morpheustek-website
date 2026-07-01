insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('resource-pdfs', 'resource-pdfs', true, 52428800, array['application/pdf'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "Public read resource pdfs bucket" on storage.objects for select using (bucket_id = 'resource-pdfs');
create policy "Service role upload resource pdfs" on storage.objects for insert with check (bucket_id = 'resource-pdfs');
create policy "Service role update resource pdfs" on storage.objects for update using (bucket_id = 'resource-pdfs');
create policy "Service role delete resource pdfs" on storage.objects for delete using (bucket_id = 'resource-pdfs');
