import { Link } from "@tanstack/react-router";
import { MapPin, MessageCircle, Star } from "lucide-react";
import type { Product } from "@/lib/mock-data";
import { mockSeller } from "@/lib/mock-data";
import { formatIDR, waLink } from "@/lib/format";
import { BadgeKondisi } from "./BadgeKondisi";
import { Button } from "./ui/button";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();

  const handleAddToCart = () => {
    add(product.id);
    toast.success(`${product.name} ditambahkan ke keranjang`);
  };

  const handleWa = () => {
    const link = `${window.location.origin}/produk/${product.slug}`;
    const waMsg = `Halo Mubarok SMS&S, saya tertarik dengan produk berikut:\n\nNama Produk: ${product.name}\nHarga: ${formatIDR(product.price)}\nLink Produk: ${link}\n\nApakah masih tersedia?`;
    window.open(waLink(waMsg), "_blank");
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:border-[var(--color-accent-orange)]/40">
      <Link
        to="/produk/$slug"
        params={{ slug: product.slug }}
        className="relative block aspect-square overflow-hidden bg-muted"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-2 top-2">
          <BadgeKondisi condition={product.condition} conditionLabel={product.conditionLabel} />
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <Link to="/produk/$slug" params={{ slug: product.slug }}>
          <h3 className="line-clamp-2 text-sm font-semibold text-foreground hover:text-[var(--color-brand)]">
            {product.name}
          </h3>
        </Link>
        {product.conditionNote && (
          <p className="line-clamp-1 text-xs italic text-muted-foreground">{product.conditionNote}</p>
        )}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Star className="h-3 w-3" />
          <span>{product.rating > 0 ? product.rating.toFixed(1) : "—"}</span>
          <span>·</span>
          <span>Stok: {product.stock}</span>
        </div>
        <div className="mt-1 text-lg font-bold text-[var(--color-accent-orange)]">
          {formatIDR(product.price)}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span className="truncate">Blora · {mockSeller.storeName.split(" ").slice(0, 2).join(" ")}</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <Button
            size="sm"
            variant="outline"
            className="mt-1 border-[var(--color-accent-orange)] text-[var(--color-accent-orange)] hover:bg-[var(--color-accent-orange)] hover:text-white"
            onClick={handleAddToCart}
          >
            + Keranjang
          </Button>
          <Button
            size="sm"
            className="bg-emerald-600 text-white hover:bg-emerald-700"
            asChild
          >
            <a
              href={waLink(`Halo Mubarok Gadget Hub, saya tertarik dengan produk ${product.name} seharga ${formatIDR(product.price)} (Kondisi: ${product.condition ?? "Standard"}). Apakah stoknya masih tersedia?`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Pesan via WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
