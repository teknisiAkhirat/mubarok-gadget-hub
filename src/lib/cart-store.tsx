import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import { mockProducts, type Product } from "@/lib/mock-data";

export interface CartItem {
  productId: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  add: (productId: string, qty?: number) => void;
  remove: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clear: () => void;
  subtotal: number;
  count: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const add = useCallback((productId: string, qty = 1) => {
    setItems((curr) => {
      const existing = curr.find((c) => c.productId === productId);
      if (existing) {
        return curr.map((c) =>
          c.productId === productId ? { ...c, quantity: c.quantity + qty } : c,
        );
      }
      return [...curr, { productId, quantity: qty }];
    });
    setIsOpen(true);
  }, []);

  const remove = useCallback((productId: string) => {
    setItems((curr) => curr.filter((c) => c.productId !== productId));
  }, []);

  const updateQty = useCallback((productId: string, qty: number) => {
    setItems((curr) =>
      curr.map((c) => (c.productId === productId ? { ...c, quantity: Math.max(1, qty) } : c)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const product = mockProducts.find((p) => p.id === item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
  }, [items]);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        toggle: () => setIsOpen((v) => !v),
        add,
        remove,
        updateQty,
        clear,
        subtotal,
        count,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
