import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast, Toaster } from "sonner";

type InventoryItem = {
  id: string;
  seller_id: string;
  name: string;
  slug: string;
  type: string;
  condition: string;
  condition_label: string;
  condition_note: string;
  description: string;
  price: number;
  cost_price: number | null;
  imei_or_sn: string | null;
  merk: string | null;
  tipe: string | null;
  stock: number;
  sale_status: string | null;
  images: string[];
  warranty: string;
  weight: number;
  is_active: boolean;
  created_at: string;
};

type FormState = {
  name: string;
  type: string;
  merk: string;
  tipe: string;
  imei_or_sn: string;
  condition: string;
  condition_note: string;
  description: string;
  price: number;
  cost_price: number;
  stock: number;
  warranty: string;
};

const emptyForm: FormState = {
  name: "",
  type: "hp-bekas",
  merk: "",
  tipe: "",
  imei_or_sn: "",
  condition: "normal",
  condition_note: "",
  description: "",
  price: 0,
  cost_price: 0,
  stock: 1,
  warranty: "3 hari garansi toko",
};

export const Route = createFileRoute("/inventory")({
  ssr: false,
  head: () => ({ meta: [{ title: "Inventori · Mubarok Gadget Hub" }] }),
  beforeLoad: async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      throw redirect({ to: "/admin-login" });
    }
    const userEmail = sessionData.session.user.email;
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
    if (!adminEmail || userEmail !== adminEmail) {
      throw redirect({ to: "/" });
    }
    const { data: isAdmin, error: roleError } = await supabase.rpc("has_role", {
      _user_id: sessionData.session.user.id,
      _role: "admin",
    });
    if (roleError || isAdmin !== true) {
      throw redirect({ to: "/" });
    }
  },
  component: InventoryPage,
});

function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [busy, setBusy] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems((data ?? []) as InventoryItem[]);
    } catch (e) {
      toast.error("Gagal memuat inventori: " + (e instanceof Error ? e.message : "unknown"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function startAdd() {
    setEditId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function startEdit(item: InventoryItem) {
    setEditId(item.id);
    setForm({
      name: item.name,
      type: item.type,
      merk: item.merk ?? "",
      tipe: item.tipe ?? "",
      imei_or_sn: item.imei_or_sn ?? "",
      condition: item.condition,
      condition_note: item.condition_note ?? "",
      description: item.description ?? "",
      price: item.price,
      cost_price: item.cost_price ?? 0,
      stock: item.stock,
      warranty: item.warranty ?? "",
    });
    setShowForm(true);
  }

  async function save() {
    setBusy(true);
    try {
      const payload: Record<string, unknown> = {
        name: form.name || "Produk Baru",
        type: form.type,
        condition: form.condition,
        condition_label: form.condition.replace(/^(.)/, (c) => c.toUpperCase()),
        condition_note: form.condition_note,
        description: form.description,
        price: form.price,
        cost_price: form.cost_price,
        stock: form.stock,
        warranty: form.warranty,
        images: [],
        weight: 300,
        is_active: true,
        sale_status: form.stock > 0 ? "tersedia" : "terjual",
        imei_or_sn: form.imei_or_sn || null,
        merk: form.merk || null,
        tipe: form.tipe || null,
      };

      if (editId) {
        const { error } = await supabase.from("products").update(payload).eq("id", editId);
        if (error) throw error;
        toast.success("Inventori diperbarui");
      } else {
        const { error } = await supabase
          .from("products")
          .insert([{ ...payload, seller_id: "seller-mubarok" }]);
        if (error) throw error;
        toast.success("Barang masuk ditambahkan");
      }

      await load();
      setShowForm(false);
    } catch (e) {
      toast.error("Gagal simpan: " + (e instanceof Error ? e.message : "unknown"));
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Hapus item ini?")) return;
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      toast.success("Item dihapus");
      await load();
    } catch (e) {
      toast.error("Gagal hapus: " + (e instanceof Error ? e.message : "unknown"));
    }
  }

  async function markSold(id: string) {
    try {
      const { error } = await supabase
        .from("products")
        .update({ stock: 0, sale_status: "terjual", is_active: false })
        .eq("id", id);
      if (error) throw error;
      toast.success("Ditandai terjual");
      await load();
    } catch (e) {
      toast.error("Gagal update status: " + (e instanceof Error ? e.message : "unknown"));
    }
  }

  const available = items.filter((i) => i.sale_status !== "terjual");
  const sold = items.filter((i) => i.sale_status === "terjual");

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Toaster richColors position="top-center" />
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold">Inventori</h1>
          <p className="text-sm text-muted-foreground">
            Barang masuk, stok tersedia, dan status penjualan.
          </p>
        </div>
        <Button
          onClick={startAdd}
          className="bg-[var(--color-accent-orange)] text-white hover:bg-[var(--color-accent-orange)]/90"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Barang Masuk
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardContent className="p-5">
            <h3 className="mb-3 font-bold">{editId ? "Edit Item" : "Barang Masuk"}</h3>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Merk</label>
                <Input
                  value={form.merk}
                  onChange={(e) => setForm({ ...form, merk: e.target.value })}
                  placeholder="Samsung"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Tipe / Model</label>
                <Input
                  value={form.tipe}
                  onChange={(e) => setForm({ ...form, tipe: e.target.value })}
                  placeholder="Galaxy M52"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-muted-foreground">
                  IMEI / Serial Number
                </label>
                <Input
                  value={form.imei_or_sn}
                  onChange={(e) => setForm({ ...form, imei_or_sn: e.target.value })}
                  placeholder="IMEI atau SN"
                />
              </div>
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
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                >
                  <option value="hp-bekas">HP Bekas</option>
                  <option value="sparepart">Sparepart</option>
                  <option value="tablet">Tablet</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Kondisi Fisik</label>
                <select
                  value={form.condition}
                  onChange={(e) => setForm({ ...form, condition: e.target.value })}
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
                  value={form.condition_note}
                  onChange={(e) => setForm({ ...form, condition_note: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">
                  Harga Modal (IDR)
                </label>
                <Input
                  type="number"
                  value={form.cost_price}
                  onChange={(e) => setForm({ ...form, cost_price: +e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">
                  Harga Jual (IDR)
                </label>
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
                <label className="text-xs font-semibold text-muted-foreground">Deskripsi</label>
                <textarea
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
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
              <Button variant="outline" onClick={() => setShowForm(false)} disabled={busy}>
                Batal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mb-4">
        <h2 className="text-xl font-bold">Stok Tersedia ({available.length})</h2>
        <p className="text-xs text-muted-foreground">
          Item yang masih bisa dijual atau ditukar-tambah.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {available.map((item) => (
          <Card key={item.id} className="flex flex-col">
            <CardContent className="flex flex-1 flex-col gap-2 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.merk} · {item.tipe}
                  </p>
                  <p className="text-xs text-muted-foreground">IMEI/SN: {item.imei_or_sn ?? "—"}</p>
                </div>
                <Badge variant="outline" className="capitalize">
                  {item.condition_label}
                </Badge>
              </div>
              <div className="text-sm">
                <p className="text-xs text-muted-foreground">Modal</p>
                <p className="font-semibold">
                  {(item.cost_price ?? 0) > 0
                    ? new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        maximumFractionDigits: 0,
                      }).format(item.cost_price as number)
                    : "—"}
                </p>
              </div>
              <div className="text-lg font-bold text-[var(--color-accent-orange)]">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumFractionDigits: 0,
                }).format(item.price)}
              </div>
              <p className="text-xs text-muted-foreground">Stok: {item.stock}</p>
              <div className="mt-2 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => startEdit(item)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => markSold(item.id)}
                  className="border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                >
                  Terjual
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => remove(item.id)}
                  className="border-red-600 text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold">Terjual / Diambil ({sold.length})</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {sold.map((item) => (
            <Card key={item.id} className="opacity-80">
              <CardContent className="p-4">
                <p className="font-semibold">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.merk} · {item.tipe}
                </p>
                <p className="text-sm font-bold">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(item.price)}
                </p>
                <Badge className="mt-2 bg-emerald-600 text-white">Terjual</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
