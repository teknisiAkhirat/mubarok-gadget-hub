import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { mockProducts, mockSeller, mockBrands, type Product } from "@/lib/mock-data";
import { formatIDR } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BadgeKondisi } from "@/components/BadgeKondisi";
import {
  Package,
  Plus,
  Star,
  Pencil,
  Trash2,
  TrendingUp,
  ShoppingBag,
  Power,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard Penjual · Mubarok SMS&S" }] }),
  component: DashboardPage,
});

const LS_KEY = "mubarok_products";

function loadProducts(): Product[] {
  if (typeof window === "undefined") return mockProducts;
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return mockProducts;
    const parsed = JSON.parse(raw) as Product[];
    return Array.isArray(parsed) && parsed.length ? parsed : mockProducts;
  } catch {
    return mockProducts;
  }
}

function saveProducts(p: Product[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

function DashboardPage() {
  const [products, setProductsState] = useState<Product[]>(mockProducts);
  const [tab, setTab] = useState<"overview" | "produk" | "pesanan" | "toko">("overview");

  useEffect(() => {
    setProductsState(loadProducts());
  }, []);

  const setProducts = (p: Product[]) => {
    setProductsState(p);
    saveProducts(p);
  };

  const stats = [
    { label: "Total Penjualan", value: formatIDR(0), icon: TrendingUp, color: "from-orange-500 to-red-500" },
    { label: "Produk Aktif", value: products.filter((p) => p.isActive).length, icon: Package, color: "from-blue-500 to-indigo-500" },
    { label: "Pesanan Masuk", value: 0, icon: ShoppingBag, color: "from-green-500 to-emerald-500" },
    { label: "Rating Toko", value: mockSeller.rating, icon: Star, color: "from-yellow-400 to-orange-400" },
  ];

  function resetDefault() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(LS_KEY);
    window.location.reload();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-3xl font-extrabold">Dashboard Penjual</h1>
          <p className="text-sm text-muted-foreground">{mockSeller.storeName} · {mockSeller.city}</p>
        </div>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">✓ Terverifikasi</span>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-xl bg-gradient-to-br ${s.color} p-4 text-white shadow-md`}>
            <s.icon className="h-5 w-5 opacity-80" />
            <p className="mt-2 text-xs opacity-90">{s.label}</p>
            <p className="text-xl font-extrabold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-1 overflow-x-auto border-b border-border">
        {(["overview", "produk", "pesanan", "toko"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`whitespace-nowrap px-4 py-2 text-sm font-semibold capitalize transition ${
              tab === t
                ? "border-b-2 border-[var(--color-accent-orange)] text-[var(--color-accent-orange)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "overview" ? "Ringkasan" : t === "produk" ? "Manajemen Produk" : t === "pesanan" ? "Pesanan" : "Pengaturan Toko"}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "overview" && (
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold">Selamat datang, {mockSeller.ownerName}! 👋</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Kelola produk, pantau pesanan, dan atur toko Anda dari satu tempat.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>📦 {products.length} produk terdaftar</li>
              <li>⏰ Operasional: {mockSeller.operationalHours}</li>
              <li>💬 Tingkat respon: {mockSeller.responseRate}% · {mockSeller.responseTime}</li>
            </ul>
          </div>
        )}

        {tab === "produk" && (
          <ProdukManager products={products} setProducts={setProducts} />
        )}

        {tab === "pesanan" && (
          <div className="rounded-xl border border-dashed border-border p-12 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <p className="mt-3 font-semibold">Belum ada pesanan masuk</p>
            <p className="text-sm text-muted-foreground">Pesanan baru akan muncul di sini.</p>
          </div>
        )}

        {tab === "toko" && (
          <div className="grid gap-4 rounded-xl border border-border bg-card p-6 md:grid-cols-2">
            <Field label="Nama Toko" defaultValue={mockSeller.storeName} />
            <Field label="Pemilik" defaultValue={mockSeller.ownerName} />
            <Field label="Kota" defaultValue={mockSeller.city} />
            <Field label="WhatsApp" defaultValue={mockSeller.whatsapp} />
            <Field label="Jam Operasional" defaultValue={mockSeller.operationalHours} />
            <Field label="Tingkat Respon" defaultValue={mockSeller.responseTime} />
            <div className="md:col-span-2">
              <Field label="Deskripsi Toko" defaultValue={mockSeller.description} />
            </div>
            <Button className="bg-[var(--color-brand)] text-[var(--color-brand-foreground)] md:col-span-2">Simpan Perubahan</Button>
          </div>
        )}
      </div>

      <div className="mt-10 flex justify-end">
        <button
          onClick={resetDefault}
          className="rounded-md border border-border bg-muted px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted/70"
          title="Hapus localStorage dan muat ulang"
        >
          Reset ke Default
        </button>
      </div>
    </div>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-muted-foreground">{label}</label>
      <Input defaultValue={defaultValue} />
    </div>
  );
}

type FormState = {
  name: string;
  price: number;
  stock: number;
  type: Product["type"];
  imageUrl: string;
  description: string;
  condition: Product["condition"];
  conditionNote: string;
  brandId: string;
  warranty: string;
};

const emptyForm: FormState = {
  name: "",
  price: 0,
  stock: 1,
  type: "hp-bekas",
  imageUrl: "",
  description: "",
  condition: "normal",
  conditionNote: "",
  brandId: mockBrands[0]?.id ?? "",
  warranty: "3 hari garansi toko",
};

function capitalize(s: string) {
  return s
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function ProdukManager({ products, setProducts }: { products: Product[]; setProducts: (p: Product[]) => void }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  function startAdd() {
    setEditId(null);
    setForm(emptyForm);
    setShowAdd(true);
  }

  function startEdit(p: Product) {
    setEditId(p.id);
    setForm({
      name: p.name,
      price: p.price,
      stock: p.stock,
      type: p.type,
      imageUrl: p.images[0] ?? "",
      description: p.description,
      condition: p.condition,
      conditionNote: p.conditionNote,
      brandId: p.brandId,
      warranty: p.warranty,
    });
    setShowAdd(true);
  }

  function save() {
    if (editId) {
      setProducts(
        products.map((p) =>
          p.id === editId
            ? {
                ...p,
                name: form.name,
                price: form.price,
                stock: form.stock,
                type: form.type,
                images: form.imageUrl ? [form.imageUrl] : p.images,
                description: form.description,
                condition: form.condition,
                conditionLabel: capitalize(form.condition),
                conditionNote: form.conditionNote,
                brandId: form.brandId,
                warranty: form.warranty,
              }
            : p,
        ),
      );
    } else {
      const name = form.name || "Produk Baru";
      const newP: Product = {
        id: `prod-${Date.now()}`,
        sellerId: mockSeller.id,
        type: form.type,
        name,
        slug: slugify(name) || `prod-${Date.now()}`,
        categoryId: null,
        compatibleWith: [],
        brandId: form.brandId,
        modelId: null,
        condition: form.condition,
        conditionLabel: capitalize(form.condition),
        conditionNote: form.conditionNote,
        description: form.description,
        specifications: {},
        price: form.price,
        compareAtPrice: null,
        stock: form.stock,
        images: form.imageUrl ? [form.imageUrl] : [],
        warranty: form.warranty,
        weight: 300,
        rating: 0,
        reviewCount: 0,
        soldCount: 0,
        isFeatured: false,
        isActive: true,
        tags: [],
        createdAt: new Date(),
      };
      setProducts([newP, ...products]);
    }
    setShowAdd(false);
  }

  function toggleActive(id: string) {
    setProducts(products.map((p) => p.id === id ? { ...p, isActive: !p.isActive } : p));
  }

  function remove(id: string) {
    setProducts(products.filter((p) => p.id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold">Manajemen Produk ({products.length})</h2>
        <Button onClick={startAdd} className="bg-[var(--color-accent-orange)] text-white hover:bg-[var(--color-accent-orange)]/90">
          <Plus className="mr-1.5 h-4 w-4" /> Tambah Produk
        </Button>
      </div>

      {showAdd && (
        <div className="rounded-xl border border-[var(--color-accent-orange)] bg-orange-50 p-5">
          <h3 className="mb-3 font-bold">{editId ? "Edit Produk" : "Produk Baru"}</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Nama Produk</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Jenis</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as Product["type"] })}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="hp-bekas">HP Bekas</option>
                <option value="sparepart">Sparepart</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Harga (IDR)</label>
              <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Stok</label>
              <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: +e.target.value })} />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-semibold text-muted-foreground">URL Foto</label>
              <Input
                placeholder="https://..."
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-semibold text-muted-foreground">Deskripsi</label>
              <Textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Kondisi</label>
              <select
                value={form.condition}
                onChange={(e) => setForm({ ...form, condition: e.target.value as Product["condition"] })}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="mulus">Mulus</option>
                <option value="normal">Normal</option>
                <option value="ori-copotan">Ori Copotan</option>
                <option value="compatible">Compatible</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Merek</label>
              <select
                value={form.brandId}
                onChange={(e) => setForm({ ...form, brandId: e.target.value })}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                {mockBrands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Catatan Kondisi</label>
              <Input
                placeholder="Mesin mulus, belum servis"
                value={form.conditionNote}
                onChange={(e) => setForm({ ...form, conditionNote: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Garansi</label>
              <Input
                placeholder="3 hari garansi toko"
                value={form.warranty}
                onChange={(e) => setForm({ ...form, warranty: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={save} className="bg-[var(--color-brand)] text-[var(--color-brand-foreground)]">Simpan</Button>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Batal</Button>
          </div>
        </div>
      )}

      {/* MOBILE: cards */}
      <div className="space-y-3 md:hidden">
        {products.map((p) => (
          <div key={p.id} className="rounded-xl border border-border bg-card p-3">
            <div className="flex gap-3">
              {p.images[0] ? (
                <img src={p.images[0]} alt="" className="h-16 w-16 shrink-0 rounded object-cover" />
              ) : (
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded bg-muted text-xs text-muted-foreground">
                  No img
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{p.name}</p>
                <div className="mt-1"><BadgeKondisi condition={p.condition} conditionLabel={p.conditionLabel} /></div>
                <p className="mt-1 text-sm font-bold text-[var(--color-accent-orange)]">{formatIDR(p.price)}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Stok: <b className="text-foreground">{p.stock}</b></span>
              <span className="capitalize text-muted-foreground">{p.type === "hp-bekas" ? "HP Bekas" : "Sparepart"}</span>
              <span className={`rounded-full px-2 py-0.5 font-bold ${p.isActive ? "bg-green-100 text-green-700" : "bg-zinc-200 text-zinc-600"}`}>
                {p.isActive ? "Aktif" : "Nonaktif"}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <button
                onClick={() => startEdit(p)}
                className="flex flex-col items-center justify-center rounded-md bg-blue-50 py-2 text-blue-600 hover:bg-blue-100"
              >
                <Pencil className="h-4 w-4" />
                <span className="mt-0.5 text-[10px] font-semibold">Edit</span>
              </button>
              <button
                onClick={() => toggleActive(p.id)}
                title="Toggle status aktif"
                className="flex flex-col items-center justify-center rounded-md bg-yellow-50 py-2 text-yellow-600 hover:bg-yellow-100"
              >
                <Power className="h-4 w-4" />
                <span className="mt-0.5 text-[10px] font-semibold">Aktif/Nonaktif</span>
              </button>
              <button
                onClick={() => remove(p.id)}
                className="flex flex-col items-center justify-center rounded-md bg-red-50 py-2 text-red-600 hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" />
                <span className="mt-0.5 text-[10px] font-semibold">Hapus</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP: table */}
      <div className="hidden overflow-hidden rounded-xl border border-border bg-card md:block">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-3">Produk</th>
              <th className="p-3">Jenis</th>
              <th className="p-3">Harga</th>
              <th className="p-3">Stok</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    {p.images[0] ? (
                      <img src={p.images[0]} alt="" className="h-12 w-12 rounded object-cover" />
                    ) : (
                      <div className="grid h-12 w-12 place-items-center rounded bg-muted text-[10px] text-muted-foreground">No img</div>
                    )}
                    <div>
                      <p className="font-semibold">{p.name}</p>
                      <BadgeKondisi condition={p.condition} conditionLabel={p.conditionLabel} />
                    </div>
                  </div>
                </td>
                <td className="p-3 capitalize">{p.type === "hp-bekas" ? "HP Bekas" : "Sparepart"}</td>
                <td className="p-3 font-bold text-[var(--color-accent-orange)]">{formatIDR(p.price)}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${p.isActive ? "bg-green-100 text-green-700" : "bg-zinc-200 text-zinc-600"}`}>
                    {p.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => startEdit(p)} className="rounded p-1.5 text-blue-600 hover:bg-blue-50" title="Edit">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => toggleActive(p.id)}
                      className="flex flex-col items-center rounded px-1.5 py-1 text-yellow-600 hover:bg-yellow-50"
                      title="Toggle status aktif"
                    >
                      <Power className="h-4 w-4" />
                      <span className="text-[9px] font-semibold leading-tight">Aktif/Nonaktif</span>
                    </button>
                    <button onClick={() => remove(p.id)} className="rounded p-1.5 text-red-600 hover:bg-red-50" title="Hapus">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
