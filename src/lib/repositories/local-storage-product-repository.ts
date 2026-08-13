import { mockProducts, type Product } from "@/lib/mock-data";
import type { ProductRepository } from "./product-repository";

const STORAGE_KEY = "mubarok_products";
const SEEDED_FLAG_KEY = "mubarok_products_seeded";

const PRODUCT_TYPES: Product["type"][] = ["hp-bekas", "sparepart", "tablet"];
const PRODUCT_CONDITIONS: Product["condition"][] = ["mulus", "normal", "ori-copotan", "compatible"];

function normalizeProduct(raw: unknown): Product {
  const r = (raw ?? {}) as Record<string, unknown>;
  return {
    id: String(r.id ?? ""),
    sellerId: String(r.sellerId ?? ""),
    type: PRODUCT_TYPES.includes(r.type as Product["type"])
      ? (r.type as Product["type"])
      : "hp-bekas",
    name: String(r.name ?? ""),
    slug: String(r.slug ?? ""),
    categoryId: r.categoryId == null ? null : String(r.categoryId),
    compatibleWith: Array.isArray(r.compatibleWith) ? r.compatibleWith.map(String) : [],
    brandId: String(r.brandId ?? ""),
    modelId: r.modelId == null ? null : String(r.modelId),
    condition: PRODUCT_CONDITIONS.includes(r.condition as Product["condition"])
      ? (r.condition as Product["condition"])
      : "normal",
    conditionLabel: String(r.conditionLabel ?? ""),
    conditionNote: String(r.conditionNote ?? ""),
    grade:
      r.grade === "A" || r.grade === "B+" || r.grade === "B" || r.grade === "C"
        ? (r.grade as Product["grade"])
        : undefined,
    defects: Array.isArray(r.defects) ? r.defects.map(String) : undefined,
    inspection: Array.isArray(r.inspection) ? (r.inspection as Product["inspection"]) : undefined,
    accessories: Array.isArray(r.accessories) ? r.accessories.map(String) : undefined,
    description: String(r.description ?? ""),
    specifications:
      r.specifications && typeof r.specifications === "object"
        ? (r.specifications as Record<string, string>)
        : {},
    price: Number(r.price ?? 0),
    compareAtPrice: r.compareAtPrice == null ? null : Number(r.compareAtPrice),
    stock: Number(r.stock ?? 0),
    images: Array.isArray(r.images) ? r.images.map(String) : [],
    warranty: String(r.warranty ?? ""),
    weight: Number(r.weight ?? 300),
    rating: Number(r.rating ?? 0),
    reviewCount: Number(r.reviewCount ?? 0),
    soldCount: Number(r.soldCount ?? 0),
    isFeatured: Boolean(r.isFeatured),
    isActive: r.isActive == null ? true : Boolean(r.isActive),
    tags: Array.isArray(r.tags) ? r.tags.map(String) : [],
    createdAt: r.createdAt ? new Date(String(r.createdAt)) : new Date(),
  };
}

function loadProducts(): Product[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeProduct);
  } catch {
    return [];
  }
}

function saveProducts(products: Product[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch {
    // localStorage may be full or disabled
  }
}

export class LocalStorageProductRepository implements ProductRepository {
  list(): Product[] {
    return loadProducts();
  }

  insert(product: Product): void {
    saveProducts([product, ...loadProducts()]);
  }

  update(id: string, patch: Partial<Product>): boolean {
    const products = loadProducts();
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    products[idx] = { ...products[idx], ...patch };
    saveProducts(products);
    return true;
  }

  remove(id: string): boolean {
    const products = loadProducts();
    const next = products.filter((p) => p.id !== id);
    if (next.length === products.length) return false;
    saveProducts(next);
    return true;
  }

  seedIfEmpty(): void {
    if (typeof window === "undefined") return;
    try {
      if (localStorage.getItem(STORAGE_KEY) || localStorage.getItem(SEEDED_FLAG_KEY)) return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockProducts));
      localStorage.setItem(SEEDED_FLAG_KEY, "1");
    } catch {
      // localStorage may be full or disabled
    }
  }
}
