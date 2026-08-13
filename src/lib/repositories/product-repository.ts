import type { Product } from "@/lib/mock-data";

export interface ProductRepository {
  list(): Product[];
  insert(product: Product): void;
  update(id: string, patch: Partial<Product>): boolean;
  remove(id: string): boolean;
  seedIfEmpty(): void;
}
