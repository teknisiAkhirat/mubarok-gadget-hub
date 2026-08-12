/**
 * @deprecated Use "@/lib/repositories" instead.
 * This file re-exports from the repository for backward compatibility.
 */
import { ticketRepository } from "@/lib/repositories";
import type { Ticket, ServiceStatus } from "@/lib/service-ticket-types";

export function getTickets(): Ticket[] {
  return ticketRepository.getTickets();
}

export function findTicketByNumber(ticketNumber: string): Ticket | undefined {
  return ticketRepository.findTicketByNumber(ticketNumber);
}

export function insertTicket(ticket: Ticket): void {
  ticketRepository.insertTicket(ticket);
}

export function updateTicketStatus(
  ticketNumber: string,
  status: ServiceStatus,
  notes?: string,
): boolean {
  return ticketRepository.updateTicketStatus(ticketNumber, status, notes);
}
