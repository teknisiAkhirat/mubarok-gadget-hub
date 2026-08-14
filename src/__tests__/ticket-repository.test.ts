import { describe, it, expect, beforeEach } from "vitest";
import { LocalStorageTicketRepository } from "@/lib/repositories/local-storage-ticket-repository";
import { type Ticket } from "@/lib/service-ticket-types";

const STORAGE_KEY = "mubarok_service_tickets";

function mockStorage(initial: Record<string, string> = {}): Storage {
  let store = { ...initial };
  return {
    getItem: (key: string) => (key in store ? store[key] : null),
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
  } as Storage;
}

describe("LocalStorageTicketRepository", () => {
  let repository: LocalStorageTicketRepository;
  let storage: Storage;

  beforeEach(() => {
    storage = mockStorage();
    globalThis.localStorage = storage;
    repository = new LocalStorageTicketRepository();
  });

  function seedTicket(overrides: Partial<Ticket> = {}): Ticket {
    return {
      id: `tkt-${Date.now()}-${Math.random()}`,
      ticket_number: `SRV-${Date.now().toString().slice(-6)}`,
      customer_name: "Imam",
      customer_phone: "081234567890",
      device_model: "Samsung A32",
      issue_description: "Layar retak",
      diagnosis: null,
      sparepart_cost: 150000,
      service_cost: 50000,
      total_cost: 200000,
      status: "Menunggu",
      notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...overrides,
    };
  }

  it("inserts and retrieves a ticket", () => {
    const ticket = seedTicket();
    repository.insertTicket(ticket);
    const found = repository.findTicketByNumber(ticket.ticket_number);
    expect(found).toBeDefined();
    expect(found?.customer_name).toBe("Imam");
    expect(found?.total_cost).toBe(200000);
  });

  it("returns undefined for unknown ticket number", () => {
    const found = repository.findTicketByNumber("SRV-000000");
    expect(found).toBeUndefined();
  });

  it("lists all tickets", () => {
    const t1 = seedTicket({ ticket_number: "SRV-111111" });
    const t2 = seedTicket({ ticket_number: "SRV-222222" });
    repository.insertTicket(t1);
    repository.insertTicket(t2);
    const all = repository.getTickets();
    expect(all.length).toBe(2);
    expect(all.map((t) => t.ticket_number)).toContain("SRV-111111");
    expect(all.map((t) => t.ticket_number)).toContain("SRV-222222");
  });

  it("updates ticket status", () => {
    const ticket = seedTicket({ ticket_number: "SRV-333333", status: "Menunggu" });
    repository.insertTicket(ticket);
    const updated = repository.updateTicketStatus("SRV-333333", "Selesai", "Fixed");
    expect(updated).toBe(true);
    const found = repository.findTicketByNumber("SRV-333333");
    expect(found?.status).toBe("Selesai");
    expect(found?.notes).toBe("Fixed");
  });

  it("returns false when updating unknown ticket", () => {
    const updated = repository.updateTicketStatus("SRV-999999", "Selesai");
    expect(updated).toBe(false);
  });
});
