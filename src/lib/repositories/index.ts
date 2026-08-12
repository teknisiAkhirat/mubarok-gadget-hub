import type { TicketRepository } from "./ticket-repository";
import { LocalStorageTicketRepository } from "./local-storage-ticket-repository";

// Active repository instance.
// To switch to a different backend (e.g., database), replace this with the
// new implementation. All consumers import from this file.
export const ticketRepository: TicketRepository = new LocalStorageTicketRepository();
