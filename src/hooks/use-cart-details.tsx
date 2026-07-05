import { useEffect, useState, useMemo } from "react";
import { useCart } from "@/lib/cart-store";
import { fetchProducts } from "@/lib/products-db";
import type { Product } from "@/lib/mock-data";

export interface CartItemDetail {
  productId: string;
  quantity: number;
  product: Product;
}

export function useCartDetails() {
  const { items } = useCart();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let mounted = true;
    fetchProducts()
      .then((data) => {
        if (mounted) setProducts(data);
      })
      .catch(() => {
        /* biar kosong daripada crash */
      });
    return () => {
      mounted = false;
    };
  }, []);

  const details = useMemo<CartItemDetail[]>(() => {
    return items
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return null;
        return { productId: item.productId, quantity: item.quantity, product };
      })
      .filter((d): d is CartItemDetail => d !== null);
  }, [items, products]);

  const subtotal = useMemo(() => {
    return details.reduce((s, d) => s + d.product.price * d.quantity, 0);
  }, [details]);

  return { details, subtotal };
}