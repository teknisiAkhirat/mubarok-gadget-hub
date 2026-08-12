import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast, Toaster } from "sonner";
import { STATUS_ORDER, type ServiceStatus, type Ticket } from "@/lib/service-ticket-types";
import { insertTicket } from "@/lib/ticket-store";

export const Route = createFileRoute("/service-new")({
  ssr: false,
  head: () => ({ meta: [{ title: "Tiket Servis Baru · Mubarok Gadget Hub" }] }),
  component: ServiceNewPage,
});

function ServiceNewPage() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    device_model: "",
    issue_description: "",
    diagnosis: "",
    sparepart_cost: 0,
    service_cost: 0,
    status: "Menunggu" as ServiceStatus,
    notes: "",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const ticket_number = `SRV-${Date.now().toString().slice(-6)}`;
      const total_cost = form.sparepart_cost + form.service_cost;
      const now = new Date().toISOString();

      const ticket: Ticket = {
        id: `tkt-${Date.now()}`,
        ticket_number,
        customer_name: form.customer_name,
        customer_phone: form.customer_phone || null,
        device_model: form.device_model,
        issue_description: form.issue_description,
        diagnosis: form.diagnosis || null,
        sparepart_cost: form.sparepart_cost,
        service_cost: form.service_cost,
        total_cost,
        status: form.status,
        notes: form.notes || null,
        updated_at: now,
        created_at: now,
      };

      insertTicket(ticket);
      toast.success("Tiket servis dibuat: " + ticket_number);
      navigate({ to: "/repair-tracker" });
    } catch (e) {
      toast.error("Gagal membuat tiket: " + (e instanceof Error ? e.message : "unknown"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Toaster richColors position="top-center" />
      <div className="mb-6 flex items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link to="/repair-tracker">
            <ArrowLeft className="h-4 w-4" /> Kembali
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Tiket Servis Baru</h1>
      </div>

      <Card>
        <CardContent className="p-5">
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">
                  Nama Pelanggan
                </label>
                <Input
                  required
                  value={form.customer_name}
                  onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">
                  No. HP Pelanggan
                </label>
                <Input
                  value={form.customer_phone}
                  onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-muted-foreground">
                  Device / Model
                </label>
                <Input
                  required
                  value={form.device_model}
                  onChange={(e) => setForm({ ...form, device_model: e.target.value })}
                  placeholder="Contoh: Realme 9 RMX3521"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-muted-foreground">
                  Keluhan / Kerusakan Awal
                </label>
                <textarea
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  rows={3}
                  value={form.issue_description}
                  onChange={(e) => setForm({ ...form, issue_description: e.target.value })}
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-muted-foreground">
                  Diagnosa IC / Jumper
                </label>
                <textarea
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  rows={3}
                  value={form.diagnosis}
                  onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                  placeholder="Contoh: IC power rusak, jalankan jumper charge IC"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">
                  Biaya Sparepart (IDR)
                </label>
                <Input
                  type="number"
                  value={form.sparepart_cost}
                  onChange={(e) => setForm({ ...form, sparepart_cost: +e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">
                  Biaya Jasa (IDR)
                </label>
                <Input
                  type="number"
                  value={form.service_cost}
                  onChange={(e) => setForm({ ...form, service_cost: +e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Status Awal</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as ServiceStatus })}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                >
                  {STATUS_ORDER.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-muted-foreground">
                  Catatan Teknisi
                </label>
                <textarea
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={busy}
                className="bg-[var(--color-brand)] text-[var(--color-brand-foreground)]"
              >
                {busy ? "Menyimpan..." : "Buat Tiket"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: "/repair-tracker" })}
                disabled={busy}
              >
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
