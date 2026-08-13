import type { TicketRepository } from "./ticket-repository";
import { LocalStorageTicketRepository } from "./local-storage-ticket-repository";
import type { ProductRepository } from "./product-repository";
import { LocalStorageProductRepository } from "./local-storage-product-repository";

// Active repository instances.
// To switch to a different backend (e.g., database), replace these with the
// new implementations. All consumers import from this file.
export const ticketRepository: TicketRepository = new LocalStorageTicketRepository();
export const productRepository: ProductRepository = new LocalStorageProductRepository();
