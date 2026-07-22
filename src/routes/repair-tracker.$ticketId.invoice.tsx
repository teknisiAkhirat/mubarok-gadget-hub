import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeKondisi } from "@/components/BadgeKondisi";
import { formatIDR } from "@/lib/format";
import { Search, Wrench } from "lucide-react";
import type { Ticket, STATUS_ORDER, STATUS_STEPS } from "@/lib/service-ticket-types";

export const Route = createFileRoute("/repair-tracker.$ticketId.invoice")({
  component: RepairTrackerDetailPage,
});

function RepairTrackerDetailPage() {
  const { ticketId } = Route.useParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("service_tickets")
          .select("*")
          .eq("ticket_number", ticketId)
          .maybeSingle();

        if (cancelled) return;

        if (error || !data) {
          setError("Data nota servis tidak ditemukan.");
        } else {
          setTicket(data as Ticket);
        }
      } catch (e) {
        if (!cancelled) {
          setError("Gagal memuat data nota servis.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ticketId]);

  function handlePrint() {
    window.print();
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-sm text-muted-foreground">Memuat nota servis...</p>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-sm text-muted-foreground">{error ?? "Data tidak tersedia."}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-4 flex items-center justify-between print:hidden">
        <h1 className="text-2xl font-bold">Nota Servis</h1>
        <button
          onClick={handlePrint}
          className="rounded-md bg-[var(--color-brand)] px-4 py-2 text-sm font-semibold text-[var(--color-brand-foreground)] hover:opacity-90"
        >
          Cetak Nota
        </button>
      </div>

      <div className="rounded-xl border border-border bg-white p-6 shadow-sm print:border-0 print:shadow-none">
        <div className="mb-6 border-b border-border pb-4">
          <h2 className="text-xl font-bold">Mubarok Gadget Hub</h2>
          <p className="text-xs text-muted-foreground">Nota Servis Digital</p>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Nomor Tiket</p>
            <p className="text-sm font-semibold">{ticket.ticket_number}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Tanggal</p>
            <p className="text-sm font-medium">
              {new Date(ticket.created_at).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Nama Pelanggan</p>
            <p className="text-sm font-medium">{ticket.customer_name}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">No. HP Pelanggan</p>
            <p className="text-sm font-medium">{ticket.customer_phone ?? "—"}</p>
          </div>
        </div>

        <div className="mb-6 rounded-lg bg-muted/50 p-4">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Detail Perangkat</p>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Model / Device</p>
              <p className="text-sm font-medium">{ticket.device_model}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Keluhan</p>
              <p className="text-sm font-medium">{ticket.issue_description}</p>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-1">
          <p className="text-xs text-muted-foreground">Status Servis</p>
          <span className="inline-flex w-fit rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
            {ticket.status}
          </span>
          <p className="text-[11px] text-muted-foreground">
            Terakhir diperbarui: {new Date(ticket.updated_at).toLocaleString("id-ID")}
          </p>
        </div>

        {ticket.notes && (
          <div className="mb-6 rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground">Catatan Teknisi</p>
            <p className="mt-1 text-sm whitespace-pre-line">{ticket.notes}</p>
          </div>
        )}

        <div className="mt-8 border-t border-border pt-4 text-[11px] text-muted-foreground">
          <p>
            Nota ini digenerate secara digital. Untuk pertanyaan lebih lanjut, hubungi Mubarok Gadget Hub.
          </p>
        </div>
      </div>
    </div>
  );
}
