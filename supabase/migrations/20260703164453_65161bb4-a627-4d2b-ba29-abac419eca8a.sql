
CREATE TABLE public.products (
  id TEXT PRIMARY KEY,
  seller_id TEXT NOT NULL DEFAULT 'seller-mubarok',
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category_id TEXT,
  compatible_with JSONB NOT NULL DEFAULT '[]'::jsonb,
  brand_id TEXT NOT NULL,
  model_id TEXT,
  condition TEXT NOT NULL,
  condition_label TEXT NOT NULL DEFAULT '',
  condition_note TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
  price INTEGER NOT NULL DEFAULT 0,
  compare_at_price INTEGER,
  stock INTEGER NOT NULL DEFAULT 0,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  warranty TEXT NOT NULL DEFAULT '',
  weight INTEGER NOT NULL DEFAULT 300,
  rating NUMERIC NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  sold_count INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view products"
  ON public.products FOR SELECT
  USING (true);

CREATE POLICY "Authenticated can insert products"
  ON public.products FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update products"
  ON public.products FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated can delete products"
  ON public.products FOR DELETE TO authenticated
  USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
