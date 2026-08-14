import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { mockBrands, mockCategories, type Product } from "@/lib/mock-data";
import { fetchProducts, seedIfEmpty } from "@/lib/products-db";
import { ProductCard } from "@/components/ProductCard";
import { ChevronRight, SlidersHorizontal, Loader2, X, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

type ProdukSearch = {
  q?: string;
  type?: "hp-bekas" | "sparepart" | "tablet";
  brand?: string;
  category?: string;
  compatible?: string;
  condition?: "mulus" | "normal" | "ori-copotan" | "compatible";
  stock?: "tersedia" | "habis";
  sort?: "terbaru" | "termurah" | "termahal" | "terlaris";
};

const CONDITION_FILTERS: { value: NonNullable<ProdukSearch["condition"]>; label: string }[] = [
  { value: "mulus", label: "Mulus" },
  { value: "normal", label: "Normal" },
  { value: "ori-copotan", label: "Ori Copotan" },
  { value: "compatible", label: "Compatible" },
];

const STOCK_FILTERS: { value: NonNullable<ProdukSearch["stock"]>; label: string }[] = [
  { value: "tersedia", label: "Stok Tersedia" },
  { value: "habis", label: "Stok Habis" },
];

export const Route = createFileRoute("/produk")({
  head: () => ({
    meta: [
      { title: "Produk — HP Bekas & Sparepart · Mubarok SMS&S" },
      {
        name: "description",
        content: "Jelajahi katalog HP bekas bergaransi dan sparepart smartphone di Blora.",
      },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): ProdukSearch => ({
    q: typeof s.q === "string" ? s.q : undefined,
    type:
      s.type === "hp-bekas" || s.type === "sparepart" || s.type === "tablet" ? s.type : undefined,
    brand: typeof s.brand === "string" ? s.brand : undefined,
    category: typeof s.category === "string" ? s.category : undefined,
    compatible: typeof s.compatible === "string" ? s.compatible : undefined,
    condition:
      s.condition === "mulus" ||
      s.condition === "normal" ||
      s.condition === "ori-copotan" ||
      s.condition === "compatible"
        ? s.condition
        : undefined,
    stock: s.stock === "tersedia" || s.stock === "habis" ? s.stock : undefined,
    sort: ["terbaru", "termurah", "termahal", "terlaris"].includes(s.sort as string)
      ? (s.sort as ProdukSearch["sort"])
      : "terbaru",
  }),
  component: ProdukPage,
});

function ProdukPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(10000000);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        try {
          await seedIfEmpty();
        } catch {
          /* ignore */
        }
        setProducts(await fetchProducts());
      } catch (e) {
        toast.error("Gagal memuat produk: " + (e instanceof Error ? e.message : "unknown"));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    let list: Product[] = products.filter((p) => p.isActive);
    if (search.q) {
      const q = search.q.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q),
      );
    }
    if (search.type) list = list.filter((p) => p.type === search.type);

    // Filter Brand khusus HP/Tablet atau jika tidak diset sparepart
    if (search.brand && search.type !== "sparepart") {
      const brand = mockBrands.find((b) => b.slug === search.brand);
      if (brand) list = list.filter((p) => p.brandId === brand.id);
    }

    // Filter Kategori khusus Sparepart
    if (search.category && search.type === "sparepart") {
      const cat = mockCategories.find((c) => c.slug === search.category);
      if (cat) list = list.filter((p) => p.categoryId === cat.id);
    }

    if (search.compatible && search.type === "sparepart") {
      const compatBrand = mockBrands.find((b) => b.slug === search.compatible);
      if (compatBrand) {
        const modelIds = compatBrand.models.map((m) => m.id);
        list = list.filter(
          (p) => p.type === "sparepart" && p.compatibleWith.some((id) => modelIds.includes(id)),
        );
      }
    }

    if (search.condition) {
      list = list.filter((p) => p.condition === search.condition);
    }

    if (search.stock === "tersedia") {
      list = list.filter((p) => p.stock > 0);
    } else if (search.stock === "habis") {
      list = list.filter((p) => p.stock === 0);
    }

    list = list.filter((p) => p.price >= priceMin && p.price <= priceMax);

    switch (search.sort) {
      case "termurah":
        list.sort((a, b) => a.price - b.price);
        break;
      case "termahal":
        list.sort((a, b) => b.price - a.price);
        break;
      case "terlaris":
        list.sort((a, b) => b.soldCount - a.soldCount);
        break;
      default:
        list.sort((a, b) => +b.createdAt - +a.createdAt);
    }
    return list;
  }, [search, priceMin, priceMax, products]);

  const setFilter = (key: keyof ProdukSearch, value: string | undefined) => {
    navigate({ search: (prev: ProdukSearch) => ({ ...prev, [key]: value || undefined }) });
  };

  const getTypeLabel = (type: "hp-bekas" | "sparepart" | "tablet") => {
    if (type === "hp-bekas") return "HP Bekas";
    if (type === "sparepart") return "Sparepart";
    if (type === "tablet") return "Tablet Bekas";
    return type;
  };

  const isSparepartActive = search.type === "sparepart";

  const activeFilterCount =
    (search.brand ? 1 : 0) +
    (search.category ? 1 : 0) +
    (search.compatible ? 1 : 0) +
    (search.condition ? 1 : 0) +
    (search.stock ? 1 : 0) +
    (search.type ? 1 : 0) +
    (priceMin > 0 || priceMax < 10000000 ? 1 : 0);

  const filterPanel = (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <SlidersHorizontal className="h-4 w-4 text-[var(--color-accent-orange)]" /> Filter Produk
        </div>
        <button
          onClick={() => setMobileFilterOpen(false)}
          className="rounded-md p-1 text-muted-foreground hover:bg-muted md:hidden"
          aria-label="Tutup filter"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <FilterGroup title="Jenis Produk">
        {[
          { v: undefined, label: "Semua Katalog" },
          { v: "hp-bekas", label: "📱 HP Bekas" },
          { v: "tablet", label: "📱 Tablet Bekas" },
          { v: "sparepart", label: "🔧 Sparepart HP" },
        ].map((opt) => (
          <button
            key={opt.label}
            onClick={() => setFilter("type", opt.v as ProdukSearch["type"])}
            className={`w-full rounded-md px-3 py-1.5 text-left text-sm transition-all duration-200 ${search.type === opt.v ? "bg-[var(--color-brand)] text-[var(--color-brand-foreground)] font-medium" : "hover:bg-muted"}`}
          >
            {opt.label}
          </button>
        ))}
      </FilterGroup>

      {/* Munculkan Merek HP HANYA jika bukan mode sparepart */}
      {!isSparepartActive && (
        <FilterGroup title="Merek HP & Tablet Bekas">
          <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
            <button
              onClick={() => setFilter("brand", undefined)}
              className={`w-full rounded-md px-3 py-1 text-left text-sm transition-colors ${!search.brand ? "bg-muted font-semibold" : "hover:bg-muted"}`}
            >
              Semua Merek
            </button>
            {mockBrands.map((b) => (
              <button
                key={b.id}
                onClick={() => setFilter("brand", b.slug)}
                className={`w-full rounded-md px-3 py-1 text-left text-sm transition-colors ${search.brand === b.slug ? "bg-muted font-semibold" : "hover:bg-muted"}`}
              >
                {b.name}
              </button>
            ))}
          </div>
        </FilterGroup>
      )}

      {/* Munculkan Kategori & Kompatibilitas HANYA jika mode sparepart aktif */}
      {isSparepartActive && (
        <>
          <FilterGroup title="Kategori Sparepart">
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => setFilter("category", undefined)}
                className={`w-full rounded-md px-3 py-1 text-left text-sm transition-colors ${!search.category ? "bg-muted font-semibold" : "hover:bg-muted"}`}
              >
                Semua Kategori
              </button>
              {mockCategories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setFilter("category", c.slug)}
                  className={`w-full rounded-md px-3 py-1 text-left text-sm transition-colors ${search.category === c.slug ? "bg-muted font-semibold" : "hover:bg-muted"}`}
                >
                  {c.icon} {c.name}
                </button>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title="Kompatibel Model">
            <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
              <button
                onClick={() => setFilter("compatible", undefined)}
                className={`w-full rounded-md px-3 py-1 text-left text-sm transition-colors ${!search.compatible ? "bg-muted font-semibold" : "hover:bg-muted"}`}
              >
                Semua Kompatibilitas
              </button>
              {mockBrands
                .filter((b) => b.models.length > 0)
                .map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setFilter("compatible", b.slug)}
                    className={`w-full rounded-md px-3 py-1 text-left text-sm transition-colors ${search.compatible === b.slug ? "bg-muted font-semibold" : "hover:bg-muted"}`}
                  >
                    {b.name}
                  </button>
                ))}
            </div>
          </FilterGroup>
        </>
      )}

      {/* Kondisi — untuk HP bekas, tablet, dan sparepart */}
      <FilterGroup title="Kondisi">
        <div className="space-y-1">
          <button
            onClick={() => setFilter("condition", undefined)}
            className={`w-full rounded-md px-3 py-1 text-left text-sm transition-colors ${!search.condition ? "bg-muted font-semibold" : "hover:bg-muted"}`}
          >
            Semua Kondisi
          </button>
          {CONDITION_FILTERS.map((c) => (
            <button
              key={c.value}
              onClick={() => setFilter("condition", c.value)}
              className={`w-full rounded-md px-3 py-1 text-left text-sm transition-colors ${search.condition === c.value ? "bg-muted font-semibold" : "hover:bg-muted"}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </FilterGroup>

      {/* Stok */}
      <FilterGroup title="Stok">
        <div className="space-y-1">
          <button
            onClick={() => setFilter("stock", undefined)}
            className={`w-full rounded-md px-3 py-1 text-left text-sm transition-colors ${!search.stock ? "bg-muted font-semibold" : "hover:bg-muted"}`}
          >
            Semua Stok
          </button>
          {STOCK_FILTERS.map((s) => (
            <button
              key={s.value}
              onClick={() => setFilter("stock", s.value)}
              className={`w-full rounded-md px-3 py-1 text-left text-sm transition-colors ${search.stock === s.value ? "bg-muted font-semibold" : "hover:bg-muted"}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Rentang Harga (IDR)">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={priceMin || ""}
              onChange={(e) => setPriceMin(Number(e.target.value))}
              className="w-full rounded border border-border bg-background px-2 py-1 text-xs focus:outline-none focus:border-[var(--color-accent-orange)]"
            />
            <span className="text-xs text-muted-foreground">s/d</span>
            <input
              type="number"
              placeholder="Max"
              value={priceMax || ""}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-full rounded border border-border bg-background px-2 py-1 text-xs focus:outline-none focus:border-[var(--color-accent-orange)]"
            />
          </div>
          <input
            type="range"
            min={0}
            max={10000000}
            step={100000}
            value={priceMax}
            onChange={(e) => setPriceMax(+e.target.value)}
            className="w-full accent-[var(--color-accent-orange)]"
          />
          <div className="text-right text-[11px] text-muted-foreground">
            Maks: Rp {priceMax.toLocaleString("id-ID")}
          </div>
        </div>
      </FilterGroup>

      {(activeFilterCount > 0 || priceMin > 0 || priceMax < 10000000) && (
        <button
          onClick={() => {
            setPriceMin(0);
            setPriceMax(10000000);
            navigate({
              search: { sort: search.sort ?? "terbaru" },
            });
          }}
          className="w-full rounded-md border border-border px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
        >
          Reset Semua Filter
        </button>
      )}
    </>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 transition-all duration-300">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">
          Beranda
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/produk" className="hover:text-foreground transition-colors">
          Produk
        </Link>
        {search.type && (
          <>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground capitalize">{getTypeLabel(search.type)}</span>
          </>
        )}
      </nav>

      <div className="grid gap-6 md:grid-cols-[260px_1fr]">
        {/* Sidebar Filter (desktop) */}
        <aside className="hidden h-fit space-y-5 rounded-xl border border-border bg-card p-4 md:sticky md:top-24 md:block shadow-sm">
          {filterPanel}
        </aside>

        {/* Results */}
        <div className="transition-all duration-300">
          <div className="mb-4">
            <h1 className="text-2xl font-extrabold md:text-3xl">
              {search.type === "sparepart"
                ? "Katalog Sparepart"
                : search.type === "tablet"
                  ? "Katalog Tablet Bekas"
                  : "Katalog HP Bekas"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {search.q
                ? `Hasil pencarian untuk "${search.q}"`
                : "Temukan HP bekas, sparepart, dan tablet dengan kondisi transparan dan garansi toko."}
            </p>
          </div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Menampilkan <strong className="text-foreground">{filtered.length}</strong> produk
              {search.q && (
                <>
                  {" "}
                  untuk keyword "<strong>{search.q}</strong>"
                </>
              )}
            </p>
            <div className="flex items-center gap-2">
              {/* Mobile filter trigger */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium md:hidden"
                aria-label="Buka filter"
              >
                <SlidersHorizontal className="h-4 w-4" /> Filter
                {activeFilterCount > 0 && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-accent-orange)] px-1 text-[10px] font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <select
                value={search.sort}
                onChange={(e) => setFilter("sort", e.target.value as ProdukSearch["sort"])}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent-orange)] transition-colors"
              >
                <option value="terbaru">Terbaru</option>
                <option value="termurah">Harga Termurah</option>
                <option value="termahal">Harga Termahal</option>
                <option value="terlaris">Terlaris</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid place-items-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-[var(--color-accent-orange)]" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center transition-all">
              <AlertTriangle className="mx-auto h-10 w-10 text-muted-foreground/50" />
              <p className="mt-3 text-lg font-semibold">Produk tidak ditemukan</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Coba sesuaikan filter kategori, kondisi, atau rentang harga pencarian Anda.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 transition-all duration-300">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile bottom sheet filter */}
      {mobileFilterOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 md:hidden"
          onClick={() => setMobileFilterOpen(false)}
          aria-hidden
        />
      )}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] overflow-y-auto rounded-t-2xl border-t border-border bg-background p-5 shadow-2xl transition-transform duration-300 md:hidden ${
          mobileFilterOpen ? "translate-y-0" : "translate-y-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Filter produk"
      >
        {filterPanel}
        <button
          onClick={() => setMobileFilterOpen(false)}
          className="mt-4 w-full rounded-lg bg-[var(--color-brand)] px-4 py-3 text-sm font-bold text-[var(--color-brand-foreground)]"
        >
          Terapkan Filter
        </button>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-border/60 pb-3 last:border-none">
      <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
        {title}
      </h4>
      {children}
    </div>
  );
}
