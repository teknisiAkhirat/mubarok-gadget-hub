import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { mockProducts, mockSeller, type Product } from "@/lib/mock-data";
import { formatIDR } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

function DashboardPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [tab, setTab] = useState<"overview" | "produk" | "pesanan" | "toko">("overview");

  const stats = [
    { label: "Total Penjualan", value: formatIDR(0), icon: TrendingUp, color: "from-orange-500 to-red-500" },
    { label: "Produk Aktif", value: products.filter((p) => p.isActive).length, icon: Package, color: "from-blue-500 to-indigo-500" },
    { label: "Pesanan Masuk", value: 0, icon: ShoppingBag, color: "from-green-500 to-emerald-500" },
    { label: "Rating Toko", value: mockSeller.rating, icon: Star, color: "from-yellow-400 to-orange-400" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold">Dashboard Penjual</h1>
          <p className="text-sm text-muted-foreground">{mockSeller.storeName} · {mockSeller.city}</p>
        </div>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">✓ Terverifikasi</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-xl bg-gradient-to-br ${s.color} p-4 text-white shadow-md`}>
            <s.icon className="h-5 w-5 opacity-80" />
            <p className="mt-2 text-xs opacity-90">{s.label}</p>
            <p className="text-xl font-extrabold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-1 border-b border-border">
        {(["overview", "produk", "pesanan", "toko"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-semibold capitalize transition ${
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

function ProdukManager({ products, setProducts }: { products: Product[]; setProducts: (p: Product[]) => void }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", price: 0, stock: 1, type: "hp-bekas" as Product["type"] });

  function startAdd() {
    setEditId(null);
    setForm({ name: "", price: 0, stock: 1, type: "hp-bekas" });
    setShowAdd(true);
  }

  function startEdit(p: Product) {
    setEditId(p.id);
    setForm({ name: p.name, price: p.price, stock: p.stock, type: p.type });
    setShowAdd(true);
  }

  function save() {
    if (editId) {
      setProducts(products.map((p) => p.id === editId ? { ...p, ...form } : p));
    } else {
      const newP: Product = {
        ...products[0],
        id: `new-${Date.now()}`,
        name: form.name || "Produk Baru",
        slug: `new-${Date.now()}`,
        price: form.price,
        stock: form.stock,
        type: form.type,
        isFeatured: false,
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
      <div className="flex justify-between">
        <h2 className="text-lg font-bold">Manajemen Produk ({products.length})</h2>
        <Button onClick={startAdd} className="bg-[var(--color-accent-orange)] text-white hover:bg-[var(--color-accent-orange)]/90">
          <Plus className="mr-1.5 h-4 w-4" /> Tambah Produk
        </Button>
      </div>

      {showAdd && (
        <div className="rounded-xl border border-[var(--color-accent-orange)] bg-orange-50 p-5">
          <h3 className="mb-3 font-bold">{editId ? "Edit Produk" : "Produk Baru"}</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Nama Produk" defaultValue={form.name} />
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
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={save} className="bg-[var(--color-brand)] text-[var(--color-brand-foreground)]">Simpan</Button>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Batal</Button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-border bg-card">
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
                    <img src={p.images[0]} alt="" className="h-12 w-12 rounded object-cover" />
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
                    <button onClick={() => toggleActive(p.id)} className="rounded p-1.5 text-yellow-600 hover:bg-yellow-50" title="Toggle aktif">
                      <Power className="h-4 w-4" />
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
