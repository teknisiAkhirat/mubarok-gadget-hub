import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronRight, MessageCircle, Search } from "lucide-react";
import { mockCategories, mockBrands, type Product } from "@/lib/mock-data";
import { formatIDR } from "@/lib/format";
import { WA_LINK, STORE } from "@/config/constants";

export const Route = createFileRoute("/sparepart")({
  head: () => ({
    meta: [
      { title: "Sparepart HP · Mubarok Gadget Hub" },
      {
        name: "description",
        content:
          "Sparepart HP bekas berkualitas di Blora. LCD, baterai, kamera, charging port, dan lainnya.",
      },
    ],
  }),
  component: SparepartPage,
});

// Mock sparepart data — khusus untuk halaman ini
const MOCK_SPAREPARTS: Product[] = [
  {
    id: "sp-lcd-001",
    sellerId: "seller-mubarok",
    type: "sparepart",
    name: "LCD Samsung Galaxy A32 - Compatible",
    slug: "lcd-samsung-galaxy-a32-compatible",
    categoryId: "cat-lcd",
    compatibleWith: ["sam-a32"],
    brandId: "brand-samsung",
    modelId: null,
    condition: "compatible",
    conditionLabel: "Compatible",
    conditionNote: "LCD aftermarket, kualitas baik, sudah diuji.",
    description:
      "LCD Samsung Galaxy A32 compatible. Kualitas bagus, sudah diuji sebelum dijual. Cocok untuk pengganti LCD retak atau blank.",
    specifications: {
      Kompatibel: "Samsung Galaxy A32",
      Tipe: "LCD + Touchscreen",
      Kondisi: "Compatible — Sudah Diuji",
    },
    price: 185000,
    compareAtPrice: null,
    stock: 3,
    images: [],
    warranty: "3 hari garansi toko",
    weight: 50,
    rating: 0,
    reviewCount: 0,
    soldCount: 0,
    isFeatured: false,
    isActive: true,
    tags: ["lcd", "samsung", "a32", "display", "touchscreen"],
    createdAt: new Date("2025-07-01"),
  },
  {
    id: "sp-bat-001",
    sellerId: "seller-mubarok",
    type: "sparepart",
    name: "Baterai Xiaomi Redmi 9 - Compatible",
    slug: "baterai-xiaomi-redmi-9-compatible",
    categoryId: "cat-baterai",
    compatibleWith: ["xmi-redmi9"],
    brandId: "brand-xiaomi",
    modelId: null,
    condition: "compatible",
    conditionLabel: "Compatible",
    conditionNote: "Baterai aftermarket, kapasitas normal.",
    description:
      "Baterai Xiaomi Redmi 9 compatible. Kapasitas 5020mAh, sudah diuji. Cocok untuk baterai yang sudah drop.",
    specifications: {
      Kompatibel: "Xiaomi Redmi 9",
      Tipe: "Li-Po Battery",
      Kapasitas: "5020 mAh",
      Kondisi: "Compatible — Sudah Diuji",
    },
    price: 85000,
    compareAtPrice: null,
    stock: 5,
    images: [],
    warranty: "3 hari garansi toko",
    weight: 80,
    rating: 0,
    reviewCount: 0,
    soldCount: 0,
    isFeatured: false,
    isActive: true,
    tags: ["baterai", "xiaomi", "redmi 9", "battery"],
    createdAt: new Date("2025-07-01"),
  },
  {
    id: "sp-cam-001",
    sellerId: "seller-mubarok",
    type: "sparepart",
    name: "Kamera Depan Samsung Galaxy A53 - Original Copotan",
    slug: "kamera-depan-samsung-galaxy-a53-ori-copotan",
    categoryId: "cat-kamera",
    compatibleWith: ["sam-a53"],
    brandId: "brand-samsung",
    modelId: null,
    condition: "ori-copotan",
    conditionLabel: "Ori Copotan",
    conditionNote: "Original copotan dari unit, berfungsi normal.",
    description:
      "Kamera depan Samsung Galaxy A53 original copotan. Diambil dari unit berfungsi, kondisi normal. Cocok untuk pengganti kamera depan rusak.",
    specifications: {
      Kompatibel: "Samsung Galaxy A53",
      Tipe: "Front Camera Module",
      Resolusi: "32 MP",
      Kondisi: "Original Copotan — Normal",
    },
    price: 125000,
    compareAtPrice: null,
    stock: 1,
    images: [],
    warranty: "3 hari garansi toko",
    weight: 10,
    rating: 0,
    reviewCount: 0,
    soldCount: 0,
    isFeatured: false,
    isActive: true,
    tags: ["kamera", "samsung", "a53", "front camera", "ori copotan"],
    createdAt: new Date("2025-07-01"),
  },
  {
    id: "sp-charge-001",
    sellerId: "seller-mubarok",
    type: "sparepart",
    name: "Charging Port Oppo A54 - Compatible",
    slug: "charging-port-oppo-a54-compatible",
    categoryId: "cat-charging",
    compatibleWith: ["oppo-a54"],
    brandId: "brand-oppo",
    modelId: null,
    condition: "compatible",
    conditionLabel: "Compatible",
    conditionNote: "Port charging aftermarket, sudah diuji.",
    description:
      "Modul charging port Oppo A54 compatible. Sudah diuji sebelum dijual. Cocok untuk HP yang tidak bisa charge atau port longgar.",
    specifications: {
      Kompatibel: "Oppo A54",
      Tipe: "Charging Port Board",
      Kondisi: "Compatible — Sudah Diuji",
    },
    price: 45000,
    compareAtPrice: null,
    stock: 4,
    images: [],
    warranty: "3 hari garansi toko",
    weight: 15,
    rating: 0,
    reviewCount: 0,
    soldCount: 0,
    isFeatured: false,
    isActive: true,
    tags: ["charging", "oppo", "a54", "port", "connector"],
    createdAt: new Date("2025-07-01"),
  },
  {
    id: "sp-spen-001",
    sellerId: "seller-mubarok",
    type: "sparepart",
    name: "S Pen Samsung Galaxy Note 8 - Original Copotan",
    slug: "s-pen-samsung-galaxy-note-8-ori-copotan",
    categoryId: "cat-aksesori",
    compatibleWith: ["sam-note8"],
    brandId: "brand-samsung",
    modelId: null,
    condition: "ori-copotan",
    conditionLabel: "Ori Copotan",
    conditionNote: "Kondisi normal, berfungsi baik.",
    description:
      "S Pen Samsung Galaxy Note 8 original copotan. Kondisi normal, stylus berfungsi baik. Cocok untuk pengganti S Pen yang hilang atau rusak.",
    specifications: {
      Kompatibel: "Samsung Galaxy Note 8",
      Tipe: "S Pen Stylus",
      Kondisi: "Original Copotan — Normal",
      Warna: "Hitam",
    },
    price: 75000,
    compareAtPrice: null,
    stock: 1,
    images: [],
    warranty: "3 hari garansi toko",
    weight: 20,
    rating: 0,
    reviewCount: 0,
    soldCount: 0,
    isFeatured: false,
    isActive: true,
    tags: ["s pen", "stylus", "samsung", "note 8", "aksesori"],
    createdAt: new Date("2025-06-01"),
  },
  {
    id: "sp-speaker-001",
    sellerId: "seller-mubarok",
    type: "sparepart",
    name: "Speaker Bawah Xiaomi Redmi 10 - Compatible",
    slug: "speaker-bawah-xiaomi-redmi-10-compatible",
    categoryId: "cat-audio",
    compatibleWith: ["xmi-redmi10"],
    brandId: "brand-xiaomi",
    modelId: null,
    condition: "compatible",
    conditionLabel: "Compatible",
    conditionNote: "Speaker aftermarket, suara jernih.",
    description:
      "Speaker bawah (loudspeaker) Xiaomi Redmi 10 compatible. Sudah diuji, suara jernih. Cocok untuk speaker yang sudah pecah atau tidak keluar suara.",
    specifications: {
      Kompatibel: "Xiaomi Redmi 10",
      Tipe: "Loudspeaker Module",
      Kondisi: "Compatible — Sudah Diuji",
    },
    price: 35000,
    compareAtPrice: null,
    stock: 6,
    images: [],
    warranty: "3 hari garansi toko",
    weight: 15,
    rating: 0,
    reviewCount: 0,
    soldCount: 0,
    isFeatured: false,
    isActive: true,
    tags: ["speaker", "xiaomi", "redmi 10", "audio", "loudspeaker"],
    createdAt: new Date("2025-07-01"),
  },
];

function SparepartPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");

  const filtered = useMemo(() => {
    let list = MOCK_SPAREPARTS.filter((p) => p.isActive);

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    if (selectedCategory) {
      list = list.filter((p) => p.categoryId === selectedCategory);
    }

    if (selectedBrand) {
      list = list.filter((p) => p.brandId === selectedBrand);
    }

    return list;
  }, [search, selectedCategory, selectedBrand]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Beranda
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">Sparepart</span>
      </nav>

      {/* Hero */}
      <section className="mb-8 rounded-2xl bg-gradient-to-br from-[var(--color-brand)] to-[#0f2440] p-6 text-[var(--color-brand-foreground)] md:p-10">
        <h1 className="text-3xl font-extrabold md:text-4xl">Sparepart HP</h1>
        <p className="mt-3 max-w-xl text-sm opacity-90 md:text-base">
          Komponen HP bekas berkualitas. LCD, baterai, kamera, charging port, dan lainnya. Semua
          sudah diuji sebelum dijual.
        </p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs opacity-80">
          <span>✓ Sudah diuji</span>
          <span>✓ Garansi toko</span>
          <span>✓ Harga transparan</span>
        </div>
      </section>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari sparepart... (LCD, baterai, kamera)"
            className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-sm"
          />
        </div>
      </div>

      {/* Kategori */}
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Kategori
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("")}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              !selectedCategory
                ? "border-[var(--color-brand)] bg-[var(--color-brand)] text-[var(--color-brand-foreground)]"
                : "border-border hover:border-[var(--color-brand)]/40 hover:bg-muted"
            }`}
          >
            Semua
          </button>
          {mockCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                selectedCategory === cat.id
                  ? "border-[var(--color-brand)] bg-[var(--color-brand)] text-[var(--color-brand-foreground)]"
                  : "border-border hover:border-[var(--color-brand)]/40 hover:bg-muted"
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Merek */}
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Kompatibel dengan Merek
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedBrand("")}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              !selectedBrand
                ? "border-[var(--color-brand)] bg-[var(--color-brand)] text-[var(--color-brand-foreground)]"
                : "border-border hover:border-[var(--color-brand)]/40 hover:bg-muted"
            }`}
          >
            Semua
          </button>
          {mockBrands
            .filter((b) => MOCK_SPAREPARTS.some((p) => p.brandId === b.id))
            .map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBrand(b.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  selectedBrand === b.id
                    ? "border-[var(--color-brand)] bg-[var(--color-brand)] text-[var(--color-brand-foreground)]"
                    : "border-border hover:border-[var(--color-brand)]/40 hover:bg-muted"
                }`}
              >
                {b.name}
              </button>
            ))}
        </div>
      </section>

      {/* Hasil */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Menampilkan <strong className="text-foreground">{filtered.length}</strong> sparepart
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-lg font-semibold">Sparepart tidak ditemukan</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Coba ubah filter atau kata kunci pencarian.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item) => (
            <SparepartCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Info Section */}
      <section className="mt-12 rounded-xl border border-border bg-card p-6">
        <h2 className="mb-3 text-lg font-bold">Catatan Penting</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">Original vs Compatible:</strong> Status originalitas
            tercantum jelas di setiap produk. Kami tidak menggunakan label "original" jika belum
            diverifikasi.
          </li>
          <li>
            <strong className="text-foreground">Sudah Diuji:</strong> Semua sparepart sudah diuji
            sebelum dijual. Garansi toko berlaku untuk kerusakan fungsional.
          </li>
          <li>
            <strong className="text-foreground">Tidak Yakin Kompatibel?</strong> Hubungi kami via
            WhatsApp dengan menyertakan model HP Anda.
          </li>
        </ul>
      </section>
    </div>
  );
}

function SparepartCard({ item }: { item: Product }) {
  const category = mockCategories.find((c) => c.id === item.categoryId);

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:border-[var(--color-accent-orange)]/40">
      <div className="relative aspect-square bg-muted">
        {item.images.length > 0 ? (
          <img
            src={item.images[0]}
            alt={item.name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl text-muted-foreground/30">
            {category?.icon ?? "📦"}
          </div>
        )}
        <div className="absolute left-2 top-2">
          <ConditionBadge condition={item.condition} label={item.conditionLabel} />
        </div>
        {item.stock <= 2 && item.stock > 0 && (
          <div className="absolute right-2 top-2 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700">
            Sisa {item.stock}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="line-clamp-2 text-sm font-semibold text-foreground">{item.name}</h3>
        {item.conditionNote && (
          <p className="line-clamp-1 text-xs italic text-muted-foreground">{item.conditionNote}</p>
        )}
        {category && (
          <p className="text-xs text-muted-foreground">
            {category.icon} {category.name}
          </p>
        )}
        <div className="mt-auto">
          <p className="text-lg font-bold text-[var(--color-accent-orange)]">
            {formatIDR(item.price)}
          </p>
          <p className="text-xs text-muted-foreground">Stok: {item.stock}</p>
        </div>
        <a
          href={WA_LINK.buy(item.name, formatIDR(item.price))}
          target="_blank"
          rel="noreferrer"
          className="mt-1 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-green-500 px-3 py-2 text-xs font-semibold text-white hover:bg-green-600"
        >
          <MessageCircle className="h-3.5 w-3.5" /> Tanya Sparepart
        </a>
      </div>
    </div>
  );
}

function ConditionBadge({ condition, label }: { condition: string; label: string }) {
  const styles: Record<string, string> = {
    mulus: "bg-green-100 text-green-700 border-green-300",
    normal: "bg-blue-100 text-blue-700 border-blue-300",
    "ori-copotan": "bg-blue-100 text-blue-700 border-blue-300",
    compatible: "bg-yellow-100 text-yellow-700 border-yellow-300",
  };
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${styles[condition] ?? "bg-gray-100 text-gray-700 border-gray-300"}`}
    >
      {condition !== "compatible" && "✓ "}
      {label}
    </span>
  );
}
