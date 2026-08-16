INSERT INTO storage.buckets (id, name, public)
VALUES ('category-images', 'category-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload category images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'category-images');

CREATE POLICY "Authenticated users can update category images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'category-images')
WITH CHECK (bucket_id = 'category-images');

CREATE POLICY "Authenticated users can delete category images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'category-images');

CREATE POLICY "Public can view category images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'category-images');
