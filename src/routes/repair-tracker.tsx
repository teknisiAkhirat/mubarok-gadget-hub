import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Wrench } from "lucide-react";

export const Route = createFileRoute("/repair-tracker")({
  component: RepairTrackerPage,
});

const STATUS_ORDER = ["Masuk", "Diagnosa", "Proses Perbaikan", "Selesai", "Diambil"] as const;

const STATUS_STEPS: Record<string, { label: string; color: string }> = {
  Masuk: { label: "Baru Masuk", color: "bg-gray-100 text-gray-700" },
  Diagnosa: { label: "Sedang Didiagnosa", color: "bg-yellow-100 text-yellow-800" },
  "Proses Perbaikan": { label: "Proses Perbaikan", color: "bg-blue-100 text-blue-800" },
  Selesai: { label: "Selesai", color: "bg-green-100 text-green-800" },
  Diambil: { label: "Sudah Diambil", color: "bg-emerald-100 text-emerald-800" },
};

type Ticket = {
  id: string;
  ticket_number: string;
  customer_name: string;
  customer_phone: string | null;
  device_model: string;
  issue_description: string;
  status: string;
  notes: string | null;
  updated_at: string;
  created_at: string;
};

function RepairTrackerPage() {
  const [query, setQuery] = useState("");
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  async function handleSearch() {
    setLoading(true);
    setNotFound(false);
    setTicket(null);

    const trimmed = query.trim();
    if (!trimmed) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("service_tickets")
      .select("*")
      .eq("ticket_number", trimmed)
      .maybeSingle();

    if (error) {
      console.error("Gagal memuat tiket:", error);
      setLoading(false);
      return;
    }

    setTicket(data as Ticket | null);
    setNotFound(!data);
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Lacak Status Servis HP</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Masukkan nomor tiket/nota servismu untuk melihat perkembangan terbaru.
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Contoh: SRV-00001"
              className="pl-9"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
          </div>
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? "Mencari..." : "Cari Tiket"}
          </Button>
        </CardContent>
      </Card>

      {notFound && (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            Nomor tiket tidak ditemukan. Periksa kembali nomor tiket/notamu.
          </CardContent>
        </Card>
      )}

      {ticket && (
        <Card>
          <CardContent className="space-y-6 p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Nomor Tiket</p>
                <p className="text-lg font-semibold">{ticket.ticket_number}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Terakhir diperbarui</p>
                <p className="text-sm font-medium">
                  {new Date(ticket.updated_at).toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Nama Customer</p>
                <p className="text-sm font-medium">{ticket.customer_name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">No. HP Customer</p>
                <p className="text-sm font-medium">{ticket.customer_phone ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Device / Model</p>
                <p className="text-sm font-medium">{ticket.device_model}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Keluhan</p>
                <p className="text-sm font-medium">{ticket.issue_description}</p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Status</p>
              <div className="flex flex-wrap gap-2">
                {STATUS_ORDER.map((step) => {
                  const currentIndex = STATUS_ORDER.indexOf(ticket.status);
                  const stepIndex = STATUS_ORDER.indexOf(step);
                  const isActive = stepIndex <= currentIndex;
                  const isCurrent = stepIndex === currentIndex;

                  return (
                    <Badge
                      key={step}
                      variant={isCurrent ? "default" : "outline"}
                      className={
                        isCurrent
                          ? "bg-emerald-600 text-white hover:bg-emerald-700"
                          : isActive
                            ? "border-emerald-600 text-emerald-700"
                            : "opacity-60"
                      }
                    >
                      <Wrench className="mr-1 h-3.5 w-3.5" />
                      {STATUS_STEPS[step]?.label ?? step}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {ticket.notes && (
              <div>
                <p className="text-xs text-muted-foreground">Catatan Teknisi</p>
                <p className="text-sm">{ticket.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
