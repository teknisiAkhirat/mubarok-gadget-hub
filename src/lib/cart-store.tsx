import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface CartItem {
  productId: string;
  sellerId: string;
  name: string;
  image: string;
  condition: string;
  price: number;
  quantity: number;
  stock: number;
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
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

  const add = useCallback((item: Omit<CartItem, "quantity">, qty = 1) => {
    setItems((curr) => {
      const existing = curr.find((c) => c.productId === item.productId);
      if (existing) {
        return curr.map((c) =>
          c.productId === item.productId
            ? { ...c, quantity: Math.min(c.stock, c.quantity + qty) }
            : c
        );
      }
      return [...curr, { ...item, quantity: Math.min(item.stock, qty) }];
    });
    setIsOpen(true);
  }, []);

  const remove = useCallback((productId: string) => {
    setItems((curr) => curr.filter((c) => c.productId !== productId));
  }, []);

  const updateQty = useCallback((productId: string, qty: number) => {
    setItems((curr) =>
      curr.map((c) =>
        c.productId === productId
          ? { ...c, quantity: Math.max(1, Math.min(c.stock, qty)) }
          : c
      )
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
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

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
