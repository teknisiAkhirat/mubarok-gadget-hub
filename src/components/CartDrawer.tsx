import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { formatIDR, waLink } from "@/lib/format";
import { mockProducts } from "@/lib/mock-data";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";

export function CartDrawer() {
  const { isOpen, close, items, updateQty, remove, subtotal } = useCart();
  const [promo, setPromo] = useState("");
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  if (!isOpen) return null;

  const waMessage = `Halo Mubarok SMS&S, saya tertarik dengan pesanan:\n\n${items
    .map((i) => `- ${i.name} (${i.condition}) x${i.quantity} = ${formatIDR(i.price * i.quantity)}`)
    .join("\n")}\n\nTotal: ${formatIDR(subtotal)}`;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={close} />
      <aside className="flex h-full w-full max-w-md flex-col bg-background shadow-2xl">
        <header className="flex items-center justify-between border-b border-border p-4">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <ShoppingBag className="h-5 w-5" /> Keranjang ({items.length})
          </h2>
          <button onClick={close} className="rounded-md p-1 hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
              <ShoppingBag className="mb-3 h-12 w-12 opacity-30" />
              <p className="font-medium">Keranjang kosong</p>
              <p className="mt-1 text-sm">Yuk pilih HP atau sparepart favoritmu!</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-3 rounded-lg border border-border p-3">
                  <img src={item.image} alt={item.name} className="h-20 w-20 rounded-md object-cover" />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="line-clamp-2 text-sm font-semibold">{item.name}</h3>
                      <button onClick={() => remove(item.productId)} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.condition}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center rounded-md border border-border">
                        <button
                          onClick={() => updateQty(item.productId, item.quantity - 1)}
                          className="px-2 py-1 hover:bg-muted"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.productId, item.quantity + 1)}
                          className="px-2 py-1 hover:bg-muted"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-[var(--color-accent-orange)]">
                        {formatIDR(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className="space-y-3 border-t border-border p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Kode promo"
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
              />
              <Button variant="outline">Pakai</Button>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-xl font-bold text-[var(--color-accent-orange)]">{formatIDR(subtotal)}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button asChild className="bg-[var(--color-brand)] text-[var(--color-brand-foreground)] hover:bg-[var(--color-brand)]/90">
                <Link to="/checkout" onClick={close}>Checkout</Link>
              </Button>
              <Button asChild variant="outline" className="border-green-500 text-green-700 hover:bg-green-50">
                <a href={waLink(waMessage)} target="_blank" rel="noreferrer">Hubungi WA</a>
              </Button>
            </div>
          </footer>
        )}
      </aside>
    </div>
  );
}
