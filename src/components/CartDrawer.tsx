import { Minus, Plus, MessageCircle, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useCartDetails } from "@/hooks/use-cart-details";
import { formatIDR, waLink } from "@/lib/format";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useEffect } from "react";

export function CartDrawer() {
  const { isOpen, close, updateQty, remove } = useCart();
  const { details, subtotal, isLoading } = useCartDetails();
  const [promo, setPromo] = useState("");
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex">
        <div className="flex-1 bg-black/50 backdrop-blur-sm" />
        <aside className="flex h-full w-full max-w-md flex-col bg-background shadow-2xl">
          <header className="flex items-center justify-between border-b border-border p-4">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <ShoppingBag className="h-5 w-5" /> Keranjang
            </h2>
          </header>
          <div className="flex-1 flex items-center justify-center p-4">
            <p className="text-muted-foreground">Memuat keranjang...</p>
          </div>
        </aside>
      </div>
    );
  }

  const waMessage = `Halo Mubarok SMS&S, saya tertarik dengan pesanan berikut:\n\n${details
    .map((d) => {
      const link = `${origin}/produk/${d.product.slug}`;
      return `- ${d.product.name} (${d.product.conditionLabel}) x${d.quantity}\nHarga: ${formatIDR(d.product.price * d.quantity)}\nLink Produk: ${link}`;
    })
    .join("\n\n")}\n\nTotal: ${formatIDR(subtotal)}\n\nApakah masih tersedia?`;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={close} />
      <aside className="flex h-full w-full max-w-md flex-col bg-background shadow-2xl">
        <header className="flex items-center justify-between border-b border-border p-4">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <ShoppingBag className="h-5 w-5" /> Keranjang ({details.length})
          </h2>
          <button onClick={close} className="rounded-md p-1 hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4">
          {details.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
              <ShoppingBag className="mb-3 h-12 w-12 opacity-30" />
              <p className="font-medium">Keranjang kosong</p>
              <p className="mt-1 text-sm">Yuk pilih HP atau sparepart favoritmu!</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {details.map((d) => (
                <li key={d.productId} className="flex gap-3 rounded-lg border border-border p-3">
                  <img
                    src={d.product.images[0] ?? ""}
                    alt={d.product.name}
                    className="h-20 w-20 rounded-md object-cover"
                  />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="line-clamp-2 text-sm font-semibold">{d.product.name}</h3>
                      <button
                        onClick={() => remove(d.productId)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">{d.product.conditionLabel}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center rounded-md border border-border">
                        <button
                          onClick={() => updateQty(d.productId, d.quantity - 1)}
                          className="px-2 py-1 hover:bg-muted"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm">{d.quantity}</span>
                        <button
                          onClick={() => updateQty(d.productId, d.quantity + 1)}
                          className="px-2 py-1 hover:bg-muted"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-[var(--color-accent-orange)]">
                        {formatIDR(d.product.price * d.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {details.length > 0 && (
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
            <Button asChild className="h-auto min-h-9 w-full whitespace-normal bg-green-500 text-white hover:bg-green-600">
              <a href={waLink(waMessage)} target="_blank" rel="noreferrer" onClick={close}>
                <MessageCircle className="mr-2 h-4 w-4" /> Beli / Hubungi via WA
              </a>
            </Button>
          </footer>
        )}
      </aside>
    </div>
  );
}