import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Wrench, Check, X } from "lucide-react";
import { toast, Toaster } from "sonner";
import {
  STATUS_ORDER,
  STATUS_STEPS,
  type Ticket,
  type ServiceStatus,
} from "@/lib/service-ticket-types";
import { getTickets, findTicketByNumber, updateTicketStatus } from "@/lib/ticket-store";

export const Route = createFileRoute("/admin/servis")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin Servis · Mubarok Gadget Hub" }] }),
  component: AdminServisPage,
});

function AdminServisPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [query, setQuery] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newStatus, setNewStatus] = useState<ServiceStatus>("Menunggu");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setTickets(getTickets());
  }, []);

  const filtered = query.trim()
    ? tickets.filter(
        (t) =>
          t.ticket_number.toLowerCase().includes(query.toLowerCase()) ||
          t.customer_name.toLowerCase().includes(query.toLowerCase()),
      )
    : tickets;

  function handleUpdateStatus() {
    if (!selectedTicket) return;
    const success = updateTicketStatus(selectedTicket.ticket_number, newStatus, notes || undefined);
    if (success) {
      toast.success(`Status tiket ${selectedTicket.ticket_number} diperbarui ke ${newStatus}`);
      setTickets(getTickets());
      setSelectedTicket(null);
      setNotes("");
    } else {
      toast.error("Gagal memperbarui status tiket");
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Toaster richColors position="top-center" />
      <div className="mb-6 flex items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4" /> Kembali
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Admin — Kelola Servis</h1>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari nomor tiket atau nama pelanggan..."
                className="pl-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            Belum ada tiket servis.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((ticket) => (
            <Card
              key={ticket.ticket_number}
              className={`cursor-pointer transition-all hover:border-[var(--color-accent-orange)] ${
                selectedTicket?.ticket_number === ticket.ticket_number
                  ? "border-[var(--color-accent-orange)] ring-1 ring-[var(--color-accent-orange)]"
                  : ""
              }`}
              onClick={() => {
                setSelectedTicket(ticket);
                setNewStatus(ticket.status);
                setNotes(ticket.notes ?? "");
              }}
            >
              <CardContent className="p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{ticket.ticket_number}</span>
                      <Badge variant="outline" className={STATUS_STEPS[ticket.status]?.color}>
                        <Wrench className="mr-1 h-3 w-3" />
                        {STATUS_STEPS[ticket.status]?.label ?? ticket.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {ticket.customer_name} · {ticket.device_model}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(ticket.created_at).toLocaleDateString("id-ID")}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedTicket && (
        <Card className="mt-6 border-[var(--color-accent-orange)]">
          <CardContent className="p-5">
            <h3 className="mb-4 font-bold">Update Status: {selectedTicket.ticket_number}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">Status Baru</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ServiceStatus)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                >
                  {STATUS_ORDER.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_STEPS[s]?.label ?? s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">
                  Catatan Teknisi
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  rows={2}
                  placeholder="Tambahkan catatan..."
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                onClick={handleUpdateStatus}
                className="bg-[var(--color-accent-orange)] text-white hover:bg-[var(--color-accent-orange)]/90"
              >
                <Check className="mr-1 h-4 w-4" /> Simpan
              </Button>
              <Button variant="outline" onClick={() => setSelectedTicket(null)}>
                <X className="mr-1 h-4 w-4" /> Batal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
