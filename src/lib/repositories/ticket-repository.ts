import { type Ticket, type ServiceStatus } from "@/lib/service-ticket-types";

export interface TicketRepository {
  getTickets(): Ticket[];
  findTicketByNumber(ticketNumber: string): Ticket | undefined;
  insertTicket(ticket: Ticket): void;
  updateTicketStatus(ticketNumber: string, status: ServiceStatus, notes?: string): boolean;
}
