import type { Product } from "@/lib/mock-data";
import { productRepository } from "@/lib/repositories";

export async function fetchProducts(): Promise<Product[]> {
  return productRepository.list();
}

export async function seedIfEmpty(): Promise<void> {
  productRepository.seedIfEmpty();
}

export async function insertProduct(p: Product): Promise<void> {
  productRepository.insert(p);
}

export async function updateProduct(id: string, patch: Partial<Product>): Promise<boolean> {
  return productRepository.update(id, patch);
}

export async function deleteProduct(id: string): Promise<boolean> {
  return productRepository.remove(id);
}

export type InventoryItem = {
  id: string;
  seller_id: string;
  name: string;
  slug: string;
  type: string;
  condition: string;
  condition_label: string;
  condition_note: string;
  description: string;
  price: number;
  cost_price: number | null;
  imei_or_sn: string | null;
  merk: string | null;
  tipe: string | null;
  stock: number;
  sale_status: string | null;
  images: string[];
  warranty: string;
  weight: number;
  is_active: boolean;
  created_at: string;
};

export function inventoryRowToItem(r: Record<string, unknown>): InventoryItem {
  return {
    id: String(r.id),
    seller_id: String(r.seller_id ?? ""),
    name: String(r.name ?? ""),
    slug: String(r.slug ?? ""),
    type: String(r.type ?? "hp-bekas"),
    condition: String(r.condition ?? "normal"),
    condition_label: String(r.condition_label ?? ""),
    condition_note: String(r.condition_note ?? ""),
    description: String(r.description ?? ""),
    price: Number(r.price ?? 0),
    cost_price: r.cost_price == null ? null : Number(r.cost_price),
    imei_or_sn: r.imei_or_sn == null ? null : String(r.imei_or_sn),
    merk: r.merk == null ? null : String(r.merk),
    tipe: r.tipe == null ? null : String(r.tipe),
    stock: Number(r.stock ?? 0),
    sale_status: r.sale_status == null ? null : String(r.sale_status),
    images: Array.isArray(r.images) ? r.images.map(String) : [],
    warranty: String(r.warranty ?? ""),
    weight: Number(r.weight ?? 300),
    is_active: Boolean(r.is_active),
    created_at: String(r.created_at ?? new Date().toISOString()),
  };
}
