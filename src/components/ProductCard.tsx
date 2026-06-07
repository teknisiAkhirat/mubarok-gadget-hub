import { Link } from "@tanstack/react-router";
import { MapPin, ShoppingCart, Star } from "lucide-react";
import type { Product } from "@/lib/mock-data";
import { mockSeller } from "@/lib/mock-data";
import { formatIDR } from "@/lib/format";
import { BadgeKondisi } from "./BadgeKondisi";
import { Button } from "./ui/button";
import { useCart } from "@/lib/cart-store";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();

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
        <Button
          size="sm"
          className="mt-2 bg-[var(--color-brand)] text-[var(--color-brand-foreground)] hover:bg-[var(--color-brand)]/90"
          onClick={() =>
            add({
              productId: product.id,
              sellerId: product.sellerId,
              name: product.name,
              image: product.images[0],
              condition: product.conditionLabel,
              price: product.price,
              stock: product.stock,
            })
          }
        >
          <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
          {product.type === "hp-bekas" ? "Beli" : "+ Keranjang"}
        </Button>
      </div>
    </div>
  );
}
