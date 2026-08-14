import { describe, it, expect } from "vitest";
import { serviceTicketSchema } from "@/lib/schemas";
import { inventoryItemSchema } from "@/lib/schemas";
import { tradeInSchema } from "@/lib/schemas";

describe("serviceTicketSchema", () => {
  it("accepts valid input", () => {
    const result = serviceTicketSchema.safeParse({
      customer_name: "Imam",
      customer_phone: "081234567890",
      device_model: "Samsung A32",
      issue_description: "Layar retak",
      diagnosis: "IC power rusak",
      sparepart_cost: 150000,
      service_cost: 50000,
      status: "Menunggu",
      notes: "Segera",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing required fields", () => {
    const result = serviceTicketSchema.safeParse({
      customer_name: "",
      device_model: "",
      issue_description: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.errors.map((e) => e.path.join("."));
      expect(paths).toContain("customer_name");
      expect(paths).toContain("device_model");
      expect(paths).toContain("issue_description");
    }
  });

  it("allows optional fields to be empty", () => {
    const result = serviceTicketSchema.safeParse({
      customer_name: "Imam",
      customer_phone: undefined,
      device_model: "Samsung A32",
      issue_description: "Layar retak",
      diagnosis: undefined,
      sparepart_cost: 0,
      service_cost: 0,
      status: "Menunggu",
      notes: undefined,
    });
    expect(result.success).toBe(true);
  });
});

describe("inventoryItemSchema", () => {
  it("accepts valid input", () => {
    const result = inventoryItemSchema.safeParse({
      name: "Samsung A32 Bekas",
      type: "hp-bekas",
      merk: "Samsung",
      tipe: "A32",
      imei_or_sn: "354678091234567",
      condition: "normal",
      condition_note: "Layar AMOLED",
      description: "Kondisi normal",
      price: 1500000,
      cost_price: 1200000,
      stock: 1,
      warranty: "3 hari",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing name", () => {
    const result = inventoryItemSchema.safeParse({
      name: "",
      type: "hp-bekas",
      merk: null,
      tipe: null,
      imei_or_sn: null,
      condition: "normal",
      condition_note: "",
      description: "",
      price: 1500000,
      cost_price: null,
      stock: 1,
      warranty: "3 hari",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors.some((e) => e.path[0] === "name")).toBe(true);
    }
  });

  it("allows nullable fields", () => {
    const result = inventoryItemSchema.safeParse({
      name: "Test",
      type: "sparepart",
      merk: null,
      tipe: null,
      imei_or_sn: null,
      condition: "ori-copotan",
      condition_note: "Bagus",
      description: "Test",
      price: 50000,
      cost_price: null,
      stock: 0,
      warranty: "3 hari",
    });
    expect(result.success).toBe(true);
  });
});

describe("tradeInSchema", () => {
  it("accepts valid input", () => {
    const result = tradeInSchema.safeParse({
      nama: "Budi",
      wa: "081234567890",
      merek: "Samsung",
      model: "A32",
      kondisi: "Normal (ada minor)",
      kerusakan: "Layar gores",
      catatan: "Fullset",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid WhatsApp format", () => {
    const result = tradeInSchema.safeParse({
      nama: "Budi",
      wa: "12345",
      merek: "Samsung",
      model: "A32",
      kondisi: "Normal (ada minor)",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors.some((e) => e.path[0] === "wa")).toBe(true);
    }
  });

  it("rejects missing required fields", () => {
    const result = tradeInSchema.safeParse({
      nama: "",
      wa: "",
      merek: "",
      model: "",
      kondisi: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.errors.map((e) => e.path[0]);
      expect(paths).toContain("nama");
      expect(paths).toContain("wa");
      expect(paths).toContain("merek");
      expect(paths).toContain("model");
      expect(paths).toContain("kondisi");
    }
  });
});
