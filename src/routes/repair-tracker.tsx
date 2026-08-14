import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { Search, Wrench, Printer } from "lucide-react";
import { Ticket, STATUS_ORDER, STATUS_STEPS } from "@/lib/service-ticket-types";
import { ticketRepository } from "@/lib/repositories";

export const Route = createFileRoute("/repair-tracker")({
  head: () => ({
    meta: [
      { title: "Lacak Servis HP · Mubarok Gadget Hub" },
      {
        name: "description",
        content:
          "Masukkan nomor tiket servis untuk melihat perkembangan terbaru perbaikan HP Anda di Mubarok Gadget Hub Blora.",
      },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({
    q: typeof s.q === "string" ? s.q : undefined,
  }),
  component: RepairTrackerPage,
});

function RepairTrackerPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [query, setQuery] = useState(search.q ?? "");
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (search.q) {
      setQuery(search.q);
      handleSearch(search.q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.q]);

  async function handleSearch(q?: string) {
    const needle = (q ?? query).trim();
    setLoading(true);
    setNotFound(false);
    setTicket(null);

    if (!needle) {
      setLoading(false);
      return;
    }

    const found = ticketRepository.findTicketByNumber(needle);
    setTicket(found ?? null);
    setNotFound(!found);
    setLoading(false);

    navigate({
      search: (prev: { q?: string }) => ({ ...prev, q: needle || undefined }),
      replace: true,
    });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Lacak Status Servis HP</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Masukkan nomor tiket/nota servismu untuk melihat perkembangan terbaru.
          </p>
        </div>
        <Button
          asChild
          className="bg-[var(--color-accent-orange)] text-white hover:bg-[var(--color-accent-orange)]/90"
        >
          <Link to="/service-new">+ Tiket Baru</Link>
        </Button>
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
          <Button onClick={() => handleSearch()} disabled={loading}>
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

            <div className="flex items-center gap-2">
              <Button variant="outline" asChild className="gap-1.5">
                <Link
                  to="/repair-tracker/$ticketId/invoice"
                  params={{ ticketId: ticket.ticket_number }}
                  search={{ q: undefined }}
                >
                  <Printer className="h-4 w-4" /> Nota Servis
                </Link>
              </Button>
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
