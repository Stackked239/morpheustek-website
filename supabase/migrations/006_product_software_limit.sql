-- Raise product-software bucket limit (3D LiDAR + GS1-5 kits are 120–135 MB each).

update storage.buckets
set file_size_limit = 262144000
where id = 'product-software';
