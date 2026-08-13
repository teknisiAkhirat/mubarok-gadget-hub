import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { findBrand, findModel, findCategory, type Product } from "@/lib/mock-data";
import { fetchProducts, seedIfEmpty } from "@/lib/products-db";
import { formatIDR, waLink } from "@/lib/format";
import { BadgeKondisi } from "@/components/BadgeKondisi";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Clock,
  Loader2,
  MapPin,
  MessageCircle,
  MinusCircle,
  ShieldCheck,
  Star,
  Store,
} from "lucide-react";

export const Route = createFileRoute("/produk_/$slug")({
  head: () => ({
    meta: [{ title: "Detail Produk · Mubarok Gadget Hub" }],
  }),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-7xl px-4 py-20 text-center">
      <h2 className="text-2xl font-bold">Terjadi error</h2>
      <p className="text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
  component: PDP,
});

const GRADE_COLORS: Record<string, string> = {
  A: "bg-emerald-600 text-white",
  "B+": "bg-teal-600 text-white",
  B: "bg-amber-600 text-white",
  C: "bg-orange-600 text-white",
};

function PDP() {
  const { slug } = Route.useParams();
  const { add } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await seedIfEmpty().catch(() => {});
        const list = await fetchProducts();
        if (mounted) setProducts(list);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setActiveImg(0);
  }, [slug]);

  const product = useMemo(() => products.find((p) => p.slug === slug), [products, slug]);

  const related = useMemo(() => {
    if (!product) return [];
    return products
      .filter(
        (p) =>
          p.id !== product.id &&
          p.isActive &&
          (p.categoryId === product.categoryId || p.brandId === product.brandId),
      )
      .slice(0, 4);
  }, [products, product]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-3 text-sm text-muted-foreground">Memuat produk…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Produk tidak ditemukan</h2>
        <Link
          to="/produk"
          className="mt-4 inline-block text-[var(--color-accent-orange)] hover:underline"
        >
          ← Kembali ke katalog
        </Link>
      </div>
    );
  }

  const brand = findBrand(product.brandId);
  const model = findModel(product.modelId);
  const category = findCategory(product.categoryId);

  const stokLabel =
    product.stock === 0
      ? "Stok habis"
      : product.stock <= 2
        ? `Stok hampir habis (sisa ${product.stock})`
        : `Tersedia · ${product.stock} unit`;

  const waMsg = `Halo Mubarok Gadget Hub, saya tertarik dengan produk berikut:\n\nNama Produk: ${product.name}\nHarga: ${formatIDR(product.price)}\nGrade: ${product.grade ?? "-"}\nLink Produk: ${window.location.origin + window.location.pathname}\n\nApakah masih tersedia?`;

  const handleAddToCart = () => {
    add(product.id);
    toast.success(`${product.name} ditambahkan ke keranjang`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <nav className="mb-4 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Beranda
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/produk" className="hover:text-foreground">
          Produk
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link
          to="/produk"
          search={{ type: product.type } as never}
          className="hover:text-foreground"
        >
          {product.type === "hp-bekas" ? "HP Bekas" : "Sparepart"}
        </Link>
        {brand && (
          <>
            <ChevronRight className="h-3 w-3" />
            <Link
              to="/produk"
              search={{ brand: brand.slug } as never}
              className="hover:text-foreground"
            >
              {brand.name}
            </Link>
          </>
        )}
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr]">
        {/* 1. Gallery */}
        <div>
          <div className="overflow-hidden rounded-xl border border-border bg-muted">
            <img
              src={product.images[activeImg]}
              alt={product.name}
              className="aspect-square w-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`h-20 w-20 overflow-hidden rounded-md border-2 ${
                    i === activeImg ? "border-[var(--color-accent-orange)]" : "border-border"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* 8. Hasil pemeriksaan — Inspection Summary */}
          {product.inspection && product.inspection.length > 0 && (
            <div className="mt-6 rounded-xl border border-border bg-card p-5">
              <h2 className="text-lg font-bold">Hasil Pemeriksaan</h2>
              <p className="text-xs text-muted-foreground">
                Pemeriksaan teknis unit (data mock untuk V1).
              </p>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[380px] text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="py-2 pr-4 font-semibold">Pemeriksaan</th>
                      <th className="py-2 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.inspection.map((row) => (
                      <tr key={row.label} className="border-b border-border/60 last:border-none">
                        <td className="py-2 pr-4 font-medium">{row.label}</td>
                        <td className="py-2">
                          {row.status === "Normal" ? (
                            <span className="inline-flex items-center gap-1.5 text-emerald-700">
                              <CheckCircle2 className="h-4 w-4" /> Normal
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-red-700">
                              <MinusCircle className="h-4 w-4" /> Minus
                              {row.note ? ` — ${row.note}` : ""}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Info column — urutan PRD: Nama → Harga → Stok → Grade → Kondisi → CTA → Garansi */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <BadgeKondisi condition={product.condition} conditionLabel={product.conditionLabel} />
            {product.grade && (
              <span
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold ${GRADE_COLORS[product.grade] ?? "bg-[var(--color-brand)] text-white"}`}
              >
                Grade {product.grade}
              </span>
            )}
            {product.type === "sparepart" && product.isOriginal !== undefined && (
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
            {product.type === "sparepart" && product.quality && (
              <span className="inline-flex items-center rounded-md bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 border border-blue-300">
                Kualitas: {product.quality}
              </span>
            )}
            {product.type === "sparepart" && product.tested && (
              <span className="inline-flex items-center rounded-md bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-700 border border-purple-300">
                <CheckCircle2 className="mr-1 h-3 w-3" /> Tested
              </span>
            )}
          </div>

          {/* 2. Nama */}
          <h1 className="mt-3 text-2xl font-extrabold md:text-3xl">{product.name}</h1>

          {/* 3. Harga */}
          <div className="mt-4 text-3xl font-extrabold text-[var(--color-accent-orange)]">
            {formatIDR(product.price)}
          </div>

          {/* 4. Stok */}
          <div className="mt-1 text-sm font-medium text-foreground">{stokLabel}</div>

          {/* 6. Ringkasan kondisi */}
          {product.conditionNote && (
            <p className="mt-3 text-sm italic text-foreground">{product.conditionNote}</p>
          )}

          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{product.rating > 0 ? product.rating.toFixed(1) : "—"}</span>
            <span>·</span>
            <span>{product.soldCount} terjual</span>
          </div>

          {/* Kompatibilitas / model */}
          {product.type === "sparepart" && product.compatibleWith.length > 0 && (
            <div className="mt-4 rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-900">
              <strong>Cocok untuk:</strong>{" "}
              {product.compatibleWith
                .map((id: string) => findModel(id)?.name)
                .filter(Boolean)
                .join(", ")}
            </div>
          )}
          {product.type === "hp-bekas" && model && (
            <div className="mt-4 rounded-md bg-muted px-3 py-2 text-sm">
              <strong>{brand?.name}</strong> {model.name} · Rilis {model.releaseYear}
            </div>
          )}

          {/* 7. Kekurangan unit — Defect Disclosure (harus menonjol) */}
          {product.defects && product.defects.length > 0 && (
            <div className="mt-5 rounded-xl border-2 border-red-300 bg-red-50 p-4">
              <h2 className="flex items-center gap-2 font-bold text-red-800">
                <AlertTriangle className="h-5 w-5" /> Kekurangan Unit
              </h2>
              <ul className="mt-2 space-y-1 text-sm text-red-900">
                {product.defects.map((d) => (
                  <li key={d} className="flex items-start gap-1.5">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                    {d}
                  </li>
                ))}
              </ul>
              {product.grade && (
                <p className="mt-2 text-xs text-red-700/80">
                  Grade {product.grade} — kondisi keseluruhan masih teruji dan berfungsi normal,
                  dijelaskan apa adanya.
                </p>
              )}
            </div>
          )}

          {/* 9. Kelengkapan */}
          {product.accessories && product.accessories.length > 0 && (
            <div className="mt-5 rounded-xl border border-border bg-card p-4">
              <h2 className="text-sm font-bold">Kelengkapan Unit</h2>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {product.accessories.map((a) => (
                  <span
                    key={a}
                    className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-medium"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 10. Garansi */}
          <div className="mt-5 flex items-center gap-1.5 text-sm">
            <ShieldCheck className="h-4 w-4 text-green-600" /> Garansi: {product.warranty}
          </div>

          {/* 13. CTA WhatsApp */}
          <div className="mt-5 flex flex-col gap-2">
            {product.type === "sparepart" ? (
              <Button
                asChild
                className="h-auto min-h-11 w-full whitespace-normal bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand)]/90"
              >
                <a
                  href={waLink(
                    `Halo Mubarok Gadget Hub, saya ingin menanyakan sparepart "${product.name}" (${product.conditionLabel}${product.isOriginal ? ", Original" : ", Compatible"}${product.quality ? `, Kualitas ${product.quality}` : ""}). Apakah tersedia?`,
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="mr-2 h-4 w-4" /> Tanya Sparepart
                </a>
              </Button>
            ) : (
              <Button
                asChild
                className="h-auto min-h-11 w-full whitespace-normal bg-emerald-600 text-white hover:bg-emerald-700"
              >
                <a href={waLink(waMsg)} target="_blank" rel="noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" /> Beli / Tanya via WhatsApp
                </a>
              </Button>
            )}
            {product.type !== "sparepart" && (
              <Button
                size="sm"
                variant="outline"
                className="w-full border-[var(--color-accent-orange)] text-[var(--color-accent-orange)] hover:bg-[var(--color-accent-orange)] hover:text-white"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                + Keranjang
              </Button>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
            {category && <span>📦 Kategori: {category.name}</span>}
            <span>⚖️ {product.weight} gr</span>
          </div>

          {/* Info Toko */}
          <div className="mt-6 rounded-xl border border-border bg-card p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--color-brand)] text-[var(--color-brand-foreground)]">
                <Store className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold">Mubarok Gadget Hub</h3>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Blora, Jawa Tengah
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Senin–Sabtu 09.00–15.00
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Toko HP bekas, sparepart, servis & tukar tambah yang amanah dan transparan.
                </p>
                <div className="mt-3">
                  <a
                    href={waLink(`Halo Mubarok Gadget Hub, saya ingin bertanya.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-md bg-green-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-600"
                  >
                    <MessageCircle className="h-3 w-3" /> Chat WA
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deskripsi & Spesifikasi */}
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-lg font-bold">Deskripsi</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-lg font-bold">Spesifikasi</h2>
          <dl className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
            {Object.entries(product.specifications).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 border-b border-border/60 py-2">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="text-right font-medium">{String(v)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-5 text-2xl font-bold">Produk Serupa</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
