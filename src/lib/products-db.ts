import { supabase } from "@/integrations/supabase/client";
import { mockProducts, mockSeller, type Product } from "@/lib/mock-data";

// Map DB row (snake_case) <-> Product (camelCase)
type ProductRow = {
  id: string;
  seller_id: string;
  type: string;
  name: string;
  slug: string;
  category_id: string | null;
  compatible_with: unknown;
  brand_id: string;
  model_id: string | null;
  condition: string;
  condition_label: string;
  condition_note: string;
  description: string;
  specifications: unknown;
  price: number;
  compare_at_price: number | null;
  stock: number;
  images: unknown;
  warranty: string;
  weight: number;
  rating: number | string;
  review_count: number;
  sold_count: number;
  is_featured: boolean;
  is_active: boolean;
  tags: unknown;
  created_at: string;
};

function toArr(v: unknown): string[] {
  if (Array.isArray(v)) return v as string[];
  return [];
}

export function rowToProduct(r: ProductRow): Product {
  return {
    id: r.id,
    sellerId: r.seller_id,
    type: r.type as Product["type"],
    name: r.name,
    slug: r.slug,
    categoryId: r.category_id,
    compatibleWith: toArr(r.compatible_with),
    brandId: r.brand_id,
    modelId: r.model_id,
    condition: r.condition as Product["condition"],
    conditionLabel: r.condition_label,
    conditionNote: r.condition_note,
    description: r.description,
    specifications: (r.specifications as Record<string, string>) ?? {},
    price: r.price,
    compareAtPrice: r.compare_at_price,
    stock: r.stock,
    images: toArr(r.images),
    warranty: r.warranty,
    weight: r.weight,
    rating: typeof r.rating === "string" ? Number(r.rating) : r.rating,
    reviewCount: r.review_count,
    soldCount: r.sold_count,
    isFeatured: r.is_featured,
    isActive: r.is_active,
    tags: toArr(r.tags),
    createdAt: new Date(r.created_at),
  };
}

export function productToRow(p: Product): ProductRow {
  return {
    id: p.id,
    seller_id: p.sellerId,
    type: p.type,
    name: p.name,
    slug: p.slug,
    category_id: p.categoryId,
    compatible_with: p.compatibleWith,
    brand_id: p.brandId,
    model_id: p.modelId,
    condition: p.condition,
    condition_label: p.conditionLabel,
    condition_note: p.conditionNote,
    description: p.description,
    specifications: p.specifications,
    price: p.price,
    compare_at_price: p.compareAtPrice,
    stock: p.stock,
    images: p.images,
    warranty: p.warranty,
    weight: p.weight,
    rating: p.rating,
    review_count: p.reviewCount,
    sold_count: p.soldCount,
    is_featured: p.isFeatured,
    is_active: p.isActive,
    tags: p.tags,
    created_at: p.createdAt.toISOString(),
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .from("products" as any)
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as unknown as ProductRow[]).map(rowToProduct);
}

export async function seedIfEmpty(): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { count, error } = await supabase.from("products" as any).select("id", { count: "exact", head: true });
  if (error) throw error;
  if ((count ?? 0) > 0) return;
  const rows = mockProducts.map((p) => productToRow({ ...p, sellerId: mockSeller.id }));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: insErr } = await supabase.from("products" as any).insert(rows);
  if (insErr) throw insErr;
}

export async function insertProduct(p: Product) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await supabase.from("products" as any).insert(productToRow(p));
  if (error) throw error;
}

export async function updateProduct(id: string, patch: Partial<Product>) {
  const row: Record<string, unknown> = {};
  const full = productToRow({ ...(patch as Product), id } as Product);
  for (const k of Object.keys(patch) as (keyof Product)[]) {
    // Map camelCase key -> snake_case via productToRow result
    const map: Record<string, string> = {
      sellerId: "seller_id", categoryId: "category_id", compatibleWith: "compatible_with",
      brandId: "brand_id", modelId: "model_id", conditionLabel: "condition_label",
      conditionNote: "condition_note", compareAtPrice: "compare_at_price",
      reviewCount: "review_count", soldCount: "sold_count", isFeatured: "is_featured",
      isActive: "is_active", createdAt: "created_at",
    };
    const snake = map[k as string] ?? (k as string);
    row[snake] = (full as unknown as Record<string, unknown>)[snake];
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await supabase.from("products" as any).update(row).eq("id", id);
  if (error) throw error;
}

export async function deleteProduct(id: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await supabase.from("products" as any).delete().eq("id", id);
  if (error) throw error;
}
