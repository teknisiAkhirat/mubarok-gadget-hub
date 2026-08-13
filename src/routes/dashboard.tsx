import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { mockSeller, mockBrands, type Product, PRODUCT_TYPE_LABELS } from "@/lib/mock-data";
import { formatIDR } from "@/lib/format";
import { getOrders, seedOrdersIfEmpty, updateOrderStatus, type Order } from "@/lib/order-store";
import { ticketRepository } from "@/lib/repositories";
import type { Ticket } from "@/lib/service-ticket-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BadgeKondisi } from "@/components/BadgeKondisi";
import { fetchProducts, insertProduct, updateProduct, deleteProduct } from "@/lib/products-db";
import { toast } from "sonner";
import {
  Package,
  Plus,
  Star,
  Pencil,
  Trash2,
  TrendingUp,
  ShoppingBag,
  Power,
  LogOut,
  Loader2,
  Wrench,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  head: () => ({ meta: [{ title: "Dashboard Penjual · Mubarok SMS&S" }] }),
  component: DashboardPage,
});

const ORDER_STATUS_COLORS: Record<Order["status"], string> = {
  "Menunggu Konfirmasi": "bg-yellow-100 text-yellow-700",
  Diproses: "bg-blue-100 text-blue-700",
  Dikirim: "bg-purple-100 text-purple-700",
  Selesai: "bg-green-100 text-green-700",
};

function DashboardPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"overview" | "produk" | "pesanan" | "toko" | "servis">("overview");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        setProducts(await fetchProducts());
        seedOrdersIfEmpty();
        setOrders(getOrders());
        setTickets(ticketRepository.getTickets());
      } catch (e) {
        toast.error("Gagal memuat data: " + (e instanceof Error ? e.message : "unknown"));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function refresh() {
    try {
      setProducts(await fetchProducts());
    } catch (e) {
      toast.error("Gagal memuat produk: " + (e instanceof Error ? e.message : "unknown"));
    }
  }

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const stats = [
    {
      label: "Total Penjualan",
      value: formatIDR(totalRevenue),
      icon: TrendingUp,
      color: "from-orange-500 to-red-500",
    },
    {
      label: "Produk Aktif",
      value: products.filter((p) => p.isActive).length,
      icon: Package,
      color: "from-blue-500 to-indigo-500",
    },
    {
      label: "Pesanan Masuk",
      value: orders.length,
      icon: ShoppingBag,
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Rating Toko",
      value: mockSeller.rating,
      icon: Star,
      color: "from-yellow-400 to-orange-400",
    },
  ];

  const ticketStats = [
    {
      label: "Total Tiket",
      value: tickets.length,
      icon: Wrench,
      color: "from-gray-600 to-gray-700",
    },
    {
      label: "Menunggu",
      value: tickets.filter((t) => t.status === "Menunggu").length,
      icon: Wrench,
      color: "from-gray-500 to-gray-600",
    },
    {
      label: "Dikerjakan",
      value: tickets.filter((t) => t.status === "Dikerjakan").length,
      icon: Wrench,
      color: "from-yellow-500 to-yellow-600",
    },
    {
      label: "Selesai",
      value: tickets.filter((t) => t.status === "Selesai").length,
      icon: Wrench,
      color: "from-green-500 to-green-600",
    },
    {
      label: "Gagal",
      value: tickets.filter((t) => t.status === "Gagal").length,
      icon: Wrench,
      color: "from-red-500 to-red-600",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-3xl font-extrabold">Dashboard Penjual</h1>
          <p className="text-sm text-muted-foreground">
            {mockSeller.storeName} · {mockSeller.city}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
            ✓ Terverifikasi
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`rounded-xl bg-gradient-to-br ${s.color} p-4 text-white shadow-md`}
          >
            <s.icon className="h-5 w-5 opacity-80" />
            <p className="mt-2 text-xs opacity-90">{s.label}</p>
            <p className="text-xl font-extrabold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-1 overflow-x-auto border-b border-border">
        {(["overview", "produk", "pesanan", "toko", "servis"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`whitespace-nowrap px-4 py-2 text-sm font-semibold capitalize transition ${
              tab === t
                ? "border-b-2 border-[var(--color-accent-orange)] text-[var(--color-accent-orange)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "overview"
              ? "Ringkasan"
              : t === "produk"
                ? "Manajemen Produk"
                : t === "pesanan"
                  ? "Pesanan"
                  : t === "servis"
                    ? "Status Servis"
                    : "Pengaturan Toko"}
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
              <li>
                💬 Tingkat respon: {mockSeller.responseRate}% · {mockSeller.responseTime}
              </li>
            </ul>
          </div>
        )}

        {tab === "produk" && (
          <ProdukManager products={products} loading={loading} refresh={refresh} />
        )}

        {tab === "pesanan" && (
          <OrdersPanel orders={orders} refresh={() => setOrders(getOrders())} />
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
            <Button className="bg-[var(--color-brand)] text-[var(--color-brand-foreground)] md:col-span-2">
              Simpan Perubahan
            </Button>
          </div>
        )}

        {tab === "servis" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Statistik Servis</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {ticketStats.map((s) => (
                <StatCard
                  key={s.label}
                  label={s.label}
                  value={s.value}
                  icon={s.icon}
                  color={s.color}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function OrdersPanel({ orders, refresh }: { orders: Order[]; refresh: () => void }) {
  const [statusDrafts, setStatusDrafts] = useState<Record<string, Order["status"]>>({});
  const [busyOrder, setBusyOrder] = useState<string | null>(null);

  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-12 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
        <p className="mt-3 font-semibold">Belum ada pesanan masuk</p>
        <p className="text-sm text-muted-foreground">Pesanan baru akan muncul di sini.</p>
      </div>
    );
  }

  function handleUpdateStatus(order: Order) {
    setBusyOrder(order.orderNumber);
    try {
      const next = statusDrafts[order.orderNumber] ?? order.status;
      updateOrderStatus(order.orderNumber, next);
      toast.success(`Pesanan ${order.orderNumber} diubah ke ${next}`);
      refresh();
    } catch (e) {
      toast.error("Gagal ubah status: " + (e instanceof Error ? e.message : "unknown"));
    } finally {
      setBusyOrder(null);
    }
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const currentStatus = statusDrafts[order.orderNumber] ?? order.status;
        return (
          <div key={order.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold">
                  {order.orderNumber}
                  {order.status === "Menunggu Konfirmasi" && (
                    <span className="ml-2 rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-bold text-yellow-700">
                      BARU
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  · {order.address.name} · {order.address.city}
                </p>
              </div>
              <span className="text-lg font-extrabold text-[var(--color-accent-orange)]">
                {formatIDR(order.total)}
              </span>
            </div>

            <ul className="mt-3 space-y-1 border-t border-border pt-3 text-sm">
              {order.items.map((item) => (
                <li key={item.productId} className="flex justify-between gap-2">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-semibold">{formatIDR(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3 text-xs">
              <span className="text-muted-foreground">
                {order.payment.toUpperCase()} · {order.shippingMethod.toUpperCase()}
                {order.shippingCost > 0 ? ` · ${formatIDR(order.shippingCost)}` : " · Gratis"}
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 font-bold ${ORDER_STATUS_COLORS[order.status]}`}
                >
                  {order.status}
                </span>
                <select
                  value={currentStatus}
                  onChange={(e) =>
                    setStatusDrafts((d) => ({
                      ...d,
                      [order.orderNumber]: e.target.value as Order["status"],
                    }))
                  }
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs font-medium"
                >
                  {(["Menunggu Konfirmasi", "Diproses", "Dikirim", "Selesai"] as const).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <Button
                  size="sm"
                  disabled={busyOrder === order.orderNumber || currentStatus === order.status}
                  onClick={() => handleUpdateStatus(order)}
                  className="bg-[var(--color-brand)] text-[var(--color-brand-foreground)]"
                >
                  {busyOrder === order.orderNumber ? "Menyimpan..." : "Simpan"}
                </Button>
              </div>
            </div>
          </div>
        );
      })}
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

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  return (
    <div className={`rounded-xl bg-gradient-to-br ${color} p-4 text-white shadow-md`}>
      <Icon className="h-5 w-5 opacity-80" />
      <p className="mt-2 text-xs opacity-90">{label}</p>
      <p className="text-xl font-extrabold">{value}</p>
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

function ProdukManager({
  products,
  loading,
  refresh,
}: {
  products: Product[];
  loading: boolean;
  refresh: () => Promise<void>;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [busy, setBusy] = useState(false);

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

  async function save() {
    setBusy(true);
    try {
      if (editId) {
        await updateProduct(editId, {
          name: form.name,
          price: form.price,
          stock: form.stock,
          type: form.type,
          images: form.imageUrl ? [form.imageUrl] : [],
          description: form.description,
          condition: form.condition,
          conditionLabel: capitalize(form.condition),
          conditionNote: form.conditionNote,
          brandId: form.brandId,
          warranty: form.warranty,
        });
        toast.success("Produk diperbarui");
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
        await insertProduct(newP);
        toast.success("Produk ditambahkan");
      }
      await refresh();
      setShowAdd(false);
    } catch (e) {
      toast.error("Gagal simpan: " + (e instanceof Error ? e.message : "unknown"));
    } finally {
      setBusy(false);
    }
  }

  async function toggleActive(p: Product) {
    try {
      await updateProduct(p.id, { isActive: !p.isActive });
      await refresh();
    } catch (e) {
      toast.error("Gagal update: " + (e instanceof Error ? e.message : "unknown"));
    }
  }

  async function remove(id: string) {
    if (!confirm("Hapus produk ini?")) return;
    try {
      await deleteProduct(id);
      toast.success("Produk dihapus");
      await refresh();
    } catch (e) {
      toast.error("Gagal hapus: " + (e instanceof Error ? e.message : "unknown"));
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold">
          Manajemen Produk ({products.length})
          {loading && (
            <Loader2 className="ml-2 inline h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </h2>
        <Button
          onClick={startAdd}
          className="bg-[var(--color-accent-orange)] text-white hover:bg-[var(--color-accent-orange)]/90"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Tambah Produk
        </Button>
      </div>

      {showAdd && (
        <div className="rounded-xl border border-[var(--color-accent-orange)] bg-orange-50 p-5">
          <h3 className="mb-3 font-bold">{editId ? "Edit Produk" : "Produk Baru"}</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Nama Produk</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                <option value="sparepart">Sparepart</option>
                <option value="tablet">Tablet</option>
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
              <label className="text-xs font-semibold text-muted-foreground">Stok</label>
              <Input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: +e.target.value })}
              />
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
            <Button
              onClick={save}
              disabled={busy}
              className="bg-[var(--color-brand)] text-[var(--color-brand-foreground)]"
            >
              {busy ? "Menyimpan..." : "Simpan"}
            </Button>
            <Button variant="outline" onClick={() => setShowAdd(false)} disabled={busy}>
              Batal
            </Button>
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
                <div className="mt-1">
                  <BadgeKondisi condition={p.condition} conditionLabel={p.conditionLabel} />
                </div>
                <p className="mt-1 text-sm font-bold text-[var(--color-accent-orange)]">
                  {formatIDR(p.price)}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Stok: <b className="text-foreground">{p.stock}</b>
              </span>
              <span className="capitalize text-muted-foreground">
                {PRODUCT_TYPE_LABELS[p.type]}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 font-bold ${p.isActive ? "bg-green-100 text-green-700" : "bg-zinc-200 text-zinc-600"}`}
              >
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
                onClick={() => toggleActive(p)}
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
                      <div className="grid h-12 w-12 place-items-center rounded bg-muted text-[10px] text-muted-foreground">
                        No img
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">{p.name}</p>
                      <BadgeKondisi condition={p.condition} conditionLabel={p.conditionLabel} />
                    </div>
                  </div>
                </td>
                <td className="p-3 capitalize">{PRODUCT_TYPE_LABELS[p.type] || p.type}</td>
                <td className="p-3 font-bold text-[var(--color-accent-orange)]">
                  {formatIDR(p.price)}
                </td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-bold ${p.isActive ? "bg-green-100 text-green-700" : "bg-zinc-200 text-zinc-600"}`}
                  >
                    {p.isActive ? "Aktif" : "Nonaktif"}
                  </span>
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
                      className="flex flex-col items-center rounded px-1.5 py-1 text-yellow-600 hover:bg-yellow-50"
                      title="Toggle status aktif"
                    >
                      <Power className="h-4 w-4" />
                      <span className="text-[9px] font-semibold leading-tight">Aktif/Nonaktif</span>
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
    </div>
  );
}
