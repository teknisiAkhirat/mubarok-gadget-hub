import { describe, it, expect, beforeEach } from "vitest";
import { serviceTicketSchema } from "@/lib/schemas";
import { LocalStorageTicketRepository } from "@/lib/repositories/local-storage-ticket-repository";
import { type Ticket, STATUS_ORDER } from "@/lib/service-ticket-types";

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

describe("service-new -> repair-tracker flow", () => {
  let repository: LocalStorageTicketRepository;
  let storage: Storage;

  beforeEach(() => {
    storage = mockStorage();
    globalThis.localStorage = storage;
    repository = new LocalStorageTicketRepository();
  });

  it("produces valid ticket from valid form input", () => {
    const formInput = {
      customer_name: "Andi",
      customer_phone: "081234567890",
      device_model: "Samsung A32",
      issue_description: "Layar retak total",
      diagnosis: "IC display rusak",
      sparepart_cost: 350000,
      service_cost: 100000,
      status: "Menunggu",
      notes: "Siap dikerjakan",
    };

    const parsed = serviceTicketSchema.safeParse(formInput);
    expect(parsed.success).toBe(true);

    if (!parsed.success) return;

    const ticket_number = `SRV-${Date.now().toString().slice(-6)}`;
    const total_cost = parsed.data.sparepart_cost + parsed.data.service_cost;
    const now = new Date().toISOString();

    const ticket: Ticket = {
      id: `tkt-${Date.now()}`,
      ticket_number,
      customer_name: parsed.data.customer_name,
      customer_phone: parsed.data.customer_phone || null,
      device_model: parsed.data.device_model,
      issue_description: parsed.data.issue_description,
      diagnosis: parsed.data.diagnosis || null,
      sparepart_cost: parsed.data.sparepart_cost,
      service_cost: parsed.data.service_cost,
      total_cost,
      status: parsed.data.status,
      notes: parsed.data.notes || null,
      created_at: now,
      updated_at: now,
    };

    repository.insertTicket(ticket);
    const found = repository.findTicketByNumber(ticket_number);

    expect(found).toBeDefined();
    expect(found?.customer_name).toBe("Andi");
    expect(found?.device_model).toBe("Samsung A32");
    expect(found?.issue_description).toBe("Layar retak total");
    expect(found?.total_cost).toBe(450000);
    expect(found?.status).toBe("Menunggu");
  });

  it("rejects invalid form input", () => {
    const invalid = {
      customer_name: "",
      customer_phone: "",
      device_model: "",
      issue_description: "",
      sparepart_cost: -1,
      service_cost: -1,
      status: "Menunggu" as const,
    };

    const result = serviceTicketSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.errors.map((e) => e.path[0]);
      expect(paths).toContain("customer_name");
      expect(paths).toContain("device_model");
      expect(paths).toContain("issue_description");
    }
  });

  it("keeps core ticket data consistent through status transition", () => {
    const ticket: Ticket = {
      id: "tkt-flow-1",
      ticket_number: "SRV-888888",
      customer_name: "Siti",
      customer_phone: "081234567890",
      device_model: "Xiaomi Redmi Note 11",
      issue_description: "Tidak bisa charging",
      diagnosis: null,
      sparepart_cost: 50000,
      service_cost: 80000,
      total_cost: 130000,
      status: "Menunggu",
      notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    repository.insertTicket(ticket);
    const before = repository.findTicketByNumber("SRV-888888");
    expect(before?.status).toBe("Menunggu");

    repository.updateTicketStatus("SRV-888888", "Dikerjakan", "Sedang diperbaiki");
    const after = repository.findTicketByNumber("SRV-888888");
    expect(after?.status).toBe("Dikerjakan");
    expect(after?.customer_name).toBe("Siti");
    expect(after?.total_cost).toBe(130000);
    expect(after?.notes).toBe("Sedang diperbaiki");
  });
});
