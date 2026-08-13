import { Link } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, MessageCircle, Star } from "lucide-react";
import type { Product } from "@/lib/mock-data";
import { formatIDR, waLink } from "@/lib/format";
import { BadgeKondisi } from "./BadgeKondisi";
import { Button } from "./ui/button";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";

const GRADE_COLORS: Record<string, string> = {
  A: "bg-emerald-600 text-white",
  "B+": "bg-teal-600 text-white",
  B: "bg-amber-600 text-white",
  C: "bg-orange-600 text-white",
};

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();

  const handleAddToCart = () => {
    add(product.id);
    toast.success(`${product.name} ditambahkan ke keranjang`);
  };

  const outOfStock = product.stock <= 0;
  const defect = product.defects && product.defects.length > 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 ease-in-out hover:shadow-md hover:border-[var(--color-accent-orange)]/40">
      <Link
        to="/produk/$slug"
        params={{ slug: product.slug }}
        className="relative block aspect-square overflow-hidden bg-muted"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute left-2 top-2 flex flex-col items-start gap-1.5">
          <BadgeKondisi condition={product.condition} conditionLabel={product.conditionLabel} />
          {product.grade && (
            <span
              className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold ${
                GRADE_COLORS[product.grade] ?? "bg-[var(--color-brand)] text-white"
              }`}
            >
              Grade {product.grade}
            </span>
          )}
          {product.type === "sparepart" && (
            <>
              {product.isOriginal !== undefined && (
                <span
                  className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold ${
                    product.isOriginal
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                      : "bg-amber-100 text-amber-700 border border-amber-300"
                  }`}
                >
                  {product.isOriginal ? "Original" : "Compatible"}
                </span>
              )}
              {product.quality && (
                <span className="inline-flex items-center rounded-md bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 border border-blue-300">
                  Kualitas: {product.quality}
                </span>
              )}
              {product.tested && (
                <span className="inline-flex items-center rounded-md bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-700 border border-purple-300">
                  <CheckCircle2 className="mr-1 h-3 w-3" /> Tested
                </span>
              )}
            </>
          )}
        </div>
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
            <span className="rounded-md bg-destructive px-3 py-1 text-xs font-bold text-destructive-foreground">
              Stok Habis
            </span>
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <Link to="/produk/$slug" params={{ slug: product.slug }}>
          <h3 className="line-clamp-2 text-sm font-semibold text-foreground hover:text-[var(--color-brand)] transition-colors">
            {product.name}
          </h3>
        </Link>
        {defect && product.defects && (
          <p className="flex items-start gap-1 rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-2">{product.defects[0]}</span>
          </p>
        )}
        {!defect && product.conditionNote && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{product.conditionNote.slice(0, 48)}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {product.rating > 0 ? (
            <>
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{product.rating.toFixed(1)}</span>
              <span>·</span>
            </>
          ) : null}
          <span>Stok: {product.stock}</span>
        </div>
        <div className="mt-1 text-lg font-bold text-[var(--color-accent-orange)]">
          {formatIDR(product.price)}
        </div>
        <div className="mt-auto flex flex-col gap-1.5 pt-2">
          {product.type === "sparepart" ? (
            <Button
              size="sm"
              className="bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand)]/90 transition-colors"
              asChild
            >
              <a
                href={waLink(
                  `Halo Mubarok Gadget Hub, saya ingin menanyakan sparepart "${product.name}" (${product.conditionLabel}${product.isOriginal ? ", Original" : ", Compatible"}${product.quality ? `, Kualitas ${product.quality}` : ""}). Apakah tersedia?`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Tanya Sparepart
              </a>
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="border-[var(--color-accent-orange)] text-[var(--color-accent-orange)] hover:bg-[var(--color-accent-orange)] hover:text-white transition-colors"
              onClick={handleAddToCart}
              disabled={outOfStock}
            >
              + Keranjang
            </Button>
          )}
          {product.type !== "sparepart" && (
            <Button
              size="sm"
              className="bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
              asChild
            >
              <a
                href={waLink(
                  `Halo Mubarok Gadget Hub, saya tertarik dengan produk ${product.name} seharga ${formatIDR(product.price)} (Kondisi: ${product.condition ?? "Standard"}). Apakah stoknya masih tersedia?`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Pesan via WhatsApp
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
