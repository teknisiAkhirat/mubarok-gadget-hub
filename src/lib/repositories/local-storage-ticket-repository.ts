import { type Ticket, type ServiceStatus } from "@/lib/service-ticket-types";
import type { TicketRepository } from "./ticket-repository";

const STORAGE_KEY = "mubarok_service_tickets";

function loadTickets(): Ticket[] {
  if (typeof globalThis.localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Ticket[];
  } catch {
    return [];
  }
}

function saveTickets(tickets: Ticket[]): void {
  if (typeof globalThis.localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  } catch {
    // localStorage may be full or disabled
  }
}

export class LocalStorageTicketRepository implements TicketRepository {
  getTickets(): Ticket[] {
    return loadTickets();
  }

  findTicketByNumber(ticketNumber: string): Ticket | undefined {
    const normalized = ticketNumber.trim().toLowerCase();
    if (!normalized) return undefined;
    return loadTickets().find((t) => t.ticket_number.trim().toLowerCase() === normalized);
  }

  insertTicket(ticket: Ticket): void {
    const tickets = loadTickets();
    saveTickets([ticket, ...tickets]);
  }

  updateTicketStatus(ticketNumber: string, status: ServiceStatus, notes?: string): boolean {
    const tickets = loadTickets();
    const idx = tickets.findIndex((t) => t.ticket_number === ticketNumber);
    if (idx === -1) return false;
    tickets[idx] = {
      ...tickets[idx],
      status,
      notes: notes ?? tickets[idx].notes,
      updated_at: new Date().toISOString(),
    };
    saveTickets(tickets);
    return true;
  }
}
