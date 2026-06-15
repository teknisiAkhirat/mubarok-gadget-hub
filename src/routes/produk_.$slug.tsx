import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  findProductBySlug,
  findBrand,
  findModel,
  findCategory,
  mockProducts,
  mockSeller,
} from "@/lib/mock-data";
import { formatIDR, waLink } from "@/lib/format";
import { BadgeKondisi } from "@/components/BadgeKondisi";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronRight,
  Clock,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Star,
  Store,
} from "lucide-react";

export const Route = createFileRoute("/produk_/$slug")({
  loader: ({ params }) => {
    const product = findProductBySlug(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.product.name} · Mubarok SMS&S` : "Produk" },
      { name: "description", content: loaderData?.product.description.slice(0, 160) ?? "" },
      { property: "og:title", content: loaderData?.product.name ?? "Produk" },
      { property: "og:image", content: loaderData?.product.images[0] ?? "" },
    ],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-7xl px-4 py-20 text-center">
      <h2 className="text-2xl font-bold">Produk tidak ditemukan</h2>
      <Link to="/produk" className="mt-4 inline-block text-[var(--color-accent-orange)] hover:underline">
        ← Kembali ke katalog
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-7xl px-4 py-20 text-center">
      <h2 className="text-2xl font-bold">Terjadi error</h2>
      <p className="text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
  component: PDP,
});

function PDP() {
  const { product } = Route.useLoaderData();
  const brand = findBrand(product.brandId);
  const model = findModel(product.modelId);
  const category = findCategory(product.categoryId);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [pageUrl, setPageUrl] = useState("");
  const { add, open } = useCart();

  useEffect(() => {
    setPageUrl(window.location.origin + window.location.pathname);
  }, [product.slug]);

  const related = mockProducts.filter((p) => p.id !== product.id).slice(0, 4);

  const stokLabel =
    product.stock === 0
      ? "Stok habis"
      : product.stock <= 2
      ? `Stok hampir habis (sisa ${product.stock})`
      : `Tersedia · ${product.stock} unit`;

  const waMsg = `Halo Mubarok SMS&S, saya tertarik dengan produk berikut:\n\nNama Produk: ${product.name}\nHarga: ${formatIDR(product.price)}\nLink Produk: ${pageUrl}\n\nApakah masih tersedia?`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <nav className="mb-4 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Beranda</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/produk" className="hover:text-foreground">Produk</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/produk" search={{ type: product.type } as never} className="hover:text-foreground">
          {product.type === "hp-bekas" ? "HP Bekas" : "Sparepart"}
        </Link>
        {brand && (
          <>
            <ChevronRight className="h-3 w-3" />
            <Link to="/produk" search={{ brand: brand.slug } as never} className="hover:text-foreground">
              {brand.name}
            </Link>
          </>
        )}
      </nav>

      <div className="grid gap-8 md:grid-cols-[1.1fr_1fr]">
        {/* Gallery */}
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
        </div>

        {/* Info */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <BadgeKondisi condition={product.condition} conditionLabel={product.conditionLabel} />
            {product.isFeatured && (
              <span className="rounded-md bg-[var(--color-accent-orange)]/10 px-2 py-0.5 text-xs font-semibold text-[var(--color-accent-orange)]">
                ⭐ Unggulan
              </span>
            )}
          </div>
          <h1 className="mt-3 text-2xl font-extrabold md:text-3xl">{product.name}</h1>
          {product.conditionNote && (
            <p className="mt-1 text-sm italic text-muted-foreground">{product.conditionNote}</p>
          )}

          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="h-4 w-4" /> {product.rating > 0 ? product.rating.toFixed(1) : "—"}
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

          <div className="mt-5 rounded-xl bg-gradient-to-br from-orange-50 to-yellow-50 p-5">
            <div className="text-3xl font-extrabold text-[var(--color-accent-orange)]">
              {formatIDR(product.price)}
            </div>
            <div className="mt-1 text-sm font-medium text-foreground">{stokLabel}</div>
          </div>

          <div className="mt-5 flex items-center gap-4">
            <span className="text-sm font-semibold">Jumlah:</span>
            <div className="flex items-center rounded-md border border-border">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-muted">
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-12 text-center font-semibold">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                className="px-3 py-2 hover:bg-muted"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Button
              variant="outline"
              className="border-[var(--color-brand)] text-[var(--color-brand)] hover:bg-[var(--color-brand)] hover:text-[var(--color-brand-foreground)]"
              onClick={() => {
                add(
                  {
                    productId: product.id,
                    sellerId: product.sellerId,
                    name: product.name,
                    image: product.images[0],
                    condition: product.conditionLabel,
                    price: product.price,
                    stock: product.stock,
                  },
                  qty
                );
              }}
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> + Keranjang
            </Button>
            <Button
              className="bg-[var(--color-accent-orange)] text-white hover:bg-[var(--color-accent-orange)]/90"
              onClick={() => {
                add(
                  {
                    productId: product.id,
                    sellerId: product.sellerId,
                    name: product.name,
                    image: product.images[0],
                    condition: product.conditionLabel,
                    price: product.price,
                    stock: product.stock,
                  },
                  qty
                );
                open();
              }}
            >
              Beli Sekarang
            </Button>
            <Button asChild className="h-auto min-h-9 whitespace-normal bg-green-500 text-white hover:bg-green-600">
              <a href={waLink(waMsg)} target="_blank" rel="noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" /> Beli / Hubungi via WA
              </a>
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-green-600" /> {product.warranty}</span>
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
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold">{mockSeller.storeName}</h3>
                  {mockSeller.isVerified && (
                    <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-700">✓ Terverifikasi</span>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> {mockSeller.rating}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {mockSeller.city}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Respon {mockSeller.responseTime}</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{mockSeller.operationalHours}</p>
                <p className="mt-1 text-xs text-muted-foreground">{mockSeller.description}</p>
                <div className="mt-3 flex gap-2">
                  <a
                    href={waLink(`Halo ${mockSeller.storeName}, saya ingin bertanya.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-md bg-green-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-600"
                  >
                    <MessageCircle className="h-3 w-3" /> Chat WA
                  </a>
                  <button className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted">
                    Kunjungi Toko
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="deskripsi" className="mt-10">
        <TabsList>
          <TabsTrigger value="deskripsi">Deskripsi</TabsTrigger>
          <TabsTrigger value="spesifikasi">Spesifikasi</TabsTrigger>
          <TabsTrigger value="ulasan">Ulasan</TabsTrigger>
          <TabsTrigger value="diskusi">Diskusi</TabsTrigger>
        </TabsList>
        <TabsContent value="deskripsi" className="rounded-xl border border-border bg-card p-5 text-sm leading-relaxed">
          {product.description}
        </TabsContent>
        <TabsContent value="spesifikasi" className="rounded-xl border border-border bg-card p-5">
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            {Object.entries(product.specifications).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 border-b border-border/60 py-2">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="text-right font-medium">{String(v)}</dd>
              </div>
            ))}
          </dl>
        </TabsContent>
        <TabsContent value="ulasan" className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Belum ada ulasan untuk produk ini.
        </TabsContent>
        <TabsContent value="diskusi" className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Belum ada diskusi. Jadi yang pertama bertanya!
        </TabsContent>
      </Tabs>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-5 text-2xl font-bold">Produk Serupa</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
