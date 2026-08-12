import { type Ticket, type ServiceStatus } from "@/lib/service-ticket-types";

const STORAGE_KEY = "mubarok_service_tickets";

function loadTickets(): Ticket[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Ticket[];
  } catch {
    return [];
  }
}

function saveTickets(tickets: Ticket[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  } catch {
    // localStorage may be full or disabled
  }
}

export function getTickets(): Ticket[] {
  return loadTickets();
}

export function findTicketByNumber(number: string): Ticket | undefined {
  return loadTickets().find((t) => t.ticket_number === number);
}

export function insertTicket(ticket: Ticket): void {
  const tickets = loadTickets();
  saveTickets([ticket, ...tickets]);
}

export function updateTicketStatus(
  ticketNumber: string,
  status: ServiceStatus,
  notes?: string,
): boolean {
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
