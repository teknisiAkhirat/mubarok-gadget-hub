import { z } from "zod";

export const inventoryItemSchema = z.object({
  name: z.string().min(1, "Nama produk wajib diisi"),
  type: z.enum(["hp-bekas", "sparepart", "tablet"]),
  merk: z.string().nullable(),
  tipe: z.string().nullable(),
  imei_or_sn: z.string().nullable(),
  condition: z.enum(["mulus", "normal", "ori-copotan", "compatible"]),
  condition_note: z.string(),
  description: z.string(),
  price: z.number().positive("Harga harus lebih dari 0"),
  cost_price: z.number().nullable(),
  stock: z.number().int().min(0, "Stok tidak boleh negatif"),
  warranty: z.string().min(1, "Garansi wajib diisi"),
});

export type InventoryItemForm = z.infer<typeof inventoryItemSchema>;

export const serviceTicketSchema = z.object({
  customer_name: z.string().min(1, "Nama pelanggan wajib diisi"),
  customer_phone: z.string().optional(),
  device_model: z.string().min(1, "Device/model wajib diisi"),
  issue_description: z.string().min(1, "Keluhan/kerusakan wajib diisi"),
  diagnosis: z.string().optional(),
  sparepart_cost: z.number().min(0).default(0),
  service_cost: z.number().min(0).default(0),
  status: z.enum(["Menunggu", "Dikerjakan", "Selesai", "Gagal"]),
  notes: z.string().optional(),
});

export type ServiceTicketForm = z.infer<typeof serviceTicketSchema>;

export const tradeInSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi."),
  wa: z
    .string()
    .regex(/^(\+?62|08)\d{8,12}$/, "Nomor WhatsApp tidak valid (contoh: 081234567890)."),
  merek: z.string().min(1, "Pilih merek HP."),
  model: z.string().min(1, "Model HP wajib diisi."),
  kondisi: z.string().min(1, "Pilih kondisi HP."),
  kerusakan: z.string().optional(),
  catatan: z.string().optional(),
});

export type TradeInForm = z.infer<typeof tradeInSchema>;
