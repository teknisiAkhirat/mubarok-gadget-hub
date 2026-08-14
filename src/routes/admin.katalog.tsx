import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BadgeKondisi } from "@/components/BadgeKondisi";
import {
  ArrowLeft,
  Wrench,
  Search,
  Plus,
  Pencil,
  Trash2,
  Power,
  Star,
  LogOut,
  Lock,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import samsungM52 from "@/assets/samsung-m52.jpg";
import { mockBrands, mockSeller, PRODUCT_TYPE_LABELS, type Product } from "@/lib/mock-data";
import { formatIDR } from "@/lib/format";
import { productRepository } from "@/lib/repositories";
import { isAdminLoggedIn, adminLogin, adminLogout } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/katalog")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin Katalog · Mubarok Gadget Hub" }] }),
  component: AdminKatalogPage,
});

function AdminKatalogPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [pin, setPin] = useState("");
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    setAuthenticated(isAdminLoggedIn());
    setChecking(false);
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    if (adminLogin(pin)) {
      setAuthenticated(true);
      setPin("");
    } else {
      setLoginError("PIN salah. Silakan coba lagi.");
      setPin("");
    }
  }

  function handleLogout() {
    adminLogout();
    setAuthenticated(false);
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Memuat...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-sm">
          <CardContent className="p-6">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-brand)] text-[var(--color-brand-foreground)]">
                <Lock className="h-6 w-6" />
              </div>
              <h1 className="text-xl font-bold">Admin Login</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Masukkan PIN untuk mengakses halaman admin.
              </p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">PIN</label>
                <Input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Masukkan PIN..."
                  autoFocus
                  required
                />
                {loginError && <p className="text-xs text-destructive">{loginError}</p>}
              </div>
              <Button
                type="submit"
                className="w-full bg-[var(--color-brand)] text-[var(--color-brand-foreground)]"
              >
                Masuk
              </Button>
              <Link
                to="/"
                className="block text-center text-sm text-muted-foreground hover:underline"
              >
                Kembali ke beranda
              </Link>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <KatalogManager onLogout={handleLogout} />;
}

function KatalogManager({ onLogout }: { onLogout: () => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [busy, setBusy] = useState(false);

  function load() {
    productRepository.seedIfEmpty();
    setProducts(productRepository.list());
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.slug.toLowerCase().includes(query.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())),
      )
    : products;

  function startAdd() {
    setEditId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function startEdit(p: Product) {
    setEditId(p.id);
    setForm({
      name: p.name,
      type: p.type,
      price: p.price,
      compareAtPrice: p.compareAtPrice ?? 0,
      stock: p.stock,
      condition: p.condition,
      conditionNote: p.conditionNote,
      brandId: p.brandId,
      warranty: p.warranty,
      description: p.description,
      imageUrl: p.images[0] ?? "",
      isFeatured: p.isFeatured,
    });
    setShowForm(true);
  }

  function save() {
    setBusy(true);
    try {
      const name = form.name.trim() || "Produk Baru";
      const slug = slugify(name) || `produk-${Date.now()}`;
      const common = {
        name,
        slug,
        type: form.type,
        price: Number(form.price) || 0,
        compareAtPrice: Number(form.compareAtPrice) > 0 ? Number(form.compareAtPrice) : null,
        stock: Number(form.stock) || 0,
        condition: form.condition,
        conditionLabel: capitalize(form.condition),
        conditionNote: form.conditionNote.trim(),
        brandId: form.brandId,
        warranty: form.warranty.trim() || "3 hari garansi toko",
        description: form.description.trim(),
        images: form.imageUrl.trim() ? [form.imageUrl.trim()] : [samsungM52],
        isFeatured: form.isFeatured,
      };

      if (editId) {
        const ok = productRepository.update(editId, common);
        if (ok) toast.success("Produk diperbarui dan tersimpan ke localStorage");
        else toast.error("Produk tidak ditemukan");
      } else {
        const newProduct: Product = {
          id: `prod-${Date.now()}`,
          sellerId: mockSeller.id,
          categoryId: null,
          compatibleWith: [],
          modelId: null,
          specifications: {},
          weight: 300,
          rating: 0,
          reviewCount: 0,
          soldCount: 0,
          isActive: true,
          tags: [],
          createdAt: new Date(),
          ...common,
        };
        productRepository.insert(newProduct);
        toast.success("Produk ditambahkan dan tersimpan ke localStorage");
      }

      load();
      setShowForm(false);
    } catch (e) {
      toast.error("Gagal simpan: " + (e instanceof Error ? e.message : "unknown"));
    } finally {
      setBusy(false);
    }
  }

  function toggleActive(p: Product) {
    productRepository.update(p.id, { isActive: !p.isActive });
    toast.success(p.isActive ? "Produk dinonaktifkan" : "Produk diaktifkan");
    load();
  }

  function remove(id: string) {
    if (!confirm("Hapus produk ini dari katalog? Perubahan tidak dapat dibatalkan.")) return;
    const ok = productRepository.remove(id);
    if (ok) toast.success("Produk dihapus dari katalog");
    else toast.error("Gagal menghapus produk");
    load();
  }

  const activeCount = products.filter((p) => p.isActive).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4" /> Kembali
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/servis">
              <Wrench className="h-4 w-4" /> Admin Servis
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Admin — Kelola Katalog</h1>
            <p className="text-sm text-muted-foreground">
              Tambah, edit, dan hapus produk. Data tersimpan di localStorage peramban.
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onLogout}>
          <LogOut className="mr-1 h-4 w-4" /> Logout
        </Button>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total Produk" value={products.length} />
        <StatCard label="Aktif" value={activeCount} />
        <StatCard
          label="HP Bekas & Tablet Bekas"
          value={products.filter((p) => p.type !== "sparepart").length}
        />
        <StatCard label="Sparepart" value={products.filter((p) => p.type === "sparepart").length} />
      </div>

      <Card className="mb-5">
        <CardContent className="flex flex-wrap items-center gap-3 p-4">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari produk, slug, atau tag..."
              className="pl-9"
            />
          </div>
          <Button
            onClick={startAdd}
            className="bg-[var(--color-accent-orange)] text-white hover:bg-[var(--color-accent-orange)]/90"
          >
            <Plus className="mr-1.5 h-4 w-4" /> Tambah Produk
          </Button>
        </CardContent>
      </Card>

      {showForm && (
        <Card className="mb-5 border-[var(--color-accent-orange)]">
          <CardContent className="p-5">
            <h3 className="mb-3 font-bold">{editId ? "Edit Produk" : "Produk Baru"}</h3>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-muted-foreground">Nama Produk</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Samsung Galaxy A54 Bekas"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Jenis</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as Product["type"] })}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                >
                  <option value="hp-bekas">HP Bekas</option>
                  <option value="tablet">Tablet Bekas</option>
                  <option value="sparepart">Sparepart</option>
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
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Harga (IDR)</label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: +e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">
                  Harga Coret (opsional, IDR)
                </label>
                <Input
                  type="number"
                  value={form.compareAtPrice}
                  onChange={(e) => setForm({ ...form, compareAtPrice: +e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Stok</label>
                <Input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: +e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Kondisi</label>
                <select
                  value={form.condition}
                  onChange={(e) =>
                    setForm({ ...form, condition: e.target.value as Product["condition"] })
                  }
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                >
                  <option value="mulus">Mulus</option>
                  <option value="normal">Normal</option>
                  <option value="ori-copotan">Ori Copotan</option>
                  <option value="compatible">Compatible</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">
                  Catatan Kondisi
                </label>
                <Input
                  value={form.conditionNote}
                  onChange={(e) => setForm({ ...form, conditionNote: e.target.value })}
                  placeholder="Mesin mulus, belum pernah servis"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Garansi</label>
                <Input
                  value={form.warranty}
                  onChange={(e) => setForm({ ...form, warranty: e.target.value })}
                  placeholder="3 hari garansi toko"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">URL Foto</label>
                <Input
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://... (opsional)"
                />
              </div>
              <div className="flex items-center gap-2 rounded-md border border-border px-3 py-2">
                <input
                  id="isFeatured"
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="h-4 w-4 accent-[var(--color-accent-orange)]"
                />
                <label htmlFor="isFeatured" className="text-sm font-medium">
                  Jadikan produk unggulan (tampil di beranda)
                </label>
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-muted-foreground">Deskripsi</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  placeholder="Deskripsi produk..."
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                onClick={save}
                disabled={busy}
                className="bg-[var(--color-brand)] text-[var(--color-brand-foreground)]"
              >
                {busy ? (
                  <>
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Menyimpan...
                  </>
                ) : (
                  "Simpan"
                )}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)} disabled={busy}>
                Batal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            {products.length === 0
              ? "Belum ada produk. Klik 'Tambah Produk' untuk memulai."
              : "Tidak ada produk yang cocok dengan pencarian."}
          </CardContent>
        </Card>
      ) : (
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
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {p.images[0] ? (
                        <img src={p.images[0]} alt="" className="h-12 w-12 rounded object-cover" />
                      ) : (
                        <div className="grid h-12 w-12 place-items-center rounded bg-muted text-[10px] text-muted-foreground">
                          No img
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold">{p.name}</p>
                        <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                          <BadgeKondisi condition={p.condition} conditionLabel={p.conditionLabel} />
                          {p.isFeatured && (
                            <span className="inline-flex items-center gap-1 rounded bg-[var(--color-accent-orange)]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[var(--color-accent-orange)]">
                              <Star className="h-2.5 w-2.5" /> Unggulan
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 capitalize">{PRODUCT_TYPE_LABELS[p.type] ?? p.type}</td>
                  <td className="p-3 font-bold text-[var(--color-accent-orange)]">
                    {formatIDR(p.price)}
                  </td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3">
                    <Badge
                      variant="outline"
                      className={
                        p.isActive
                          ? "border-green-600 text-green-700"
                          : "border-zinc-400 text-zinc-500"
                      }
                    >
                      {p.isActive ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => startEdit(p)}
                        className="rounded p-1.5 text-blue-600 hover:bg-blue-50"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toggleActive(p)}
                        className="rounded p-1.5 text-yellow-600 hover:bg-yellow-50"
                        title="Aktif / Nonaktif"
                      >
                        <Power className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => remove(p.id)}
                        className="rounded p-1.5 text-red-600 hover:bg-red-50"
                        title="Hapus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

type FormState = {
  name: string;
  type: Product["type"];
  price: number;
  compareAtPrice: number;
  stock: number;
  condition: Product["condition"];
  conditionNote: string;
  brandId: string;
  warranty: string;
  description: string;
  imageUrl: string;
  isFeatured: boolean;
};

const emptyForm: FormState = {
  name: "",
  type: "hp-bekas",
  price: 0,
  compareAtPrice: 0,
  stock: 1,
  condition: "normal",
  conditionNote: "",
  brandId: mockBrands[0]?.id ?? "",
  warranty: "3 hari garansi toko",
  description: "",
  imageUrl: "",
  isFeatured: false,
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

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-extrabold">{value}</p>
    </div>
  );
}
