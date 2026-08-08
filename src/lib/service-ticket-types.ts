export type ServiceStatus = "Menunggu" | "Dikerjakan" | "Selesai" | "Gagal";

export type Ticket = {
  id: string;
  ticket_number: string;
  customer_name: string;
  customer_phone: string | null;
  device_model: string;
  issue_description: string;
  diagnosis: string | null;
  sparepart_cost: number;
  service_cost: number;
  total_cost: number;
  status: ServiceStatus;
  notes: string | null;
  updated_at: string;
  created_at: string;
};

export const STATUS_ORDER: ServiceStatus[] = ["Menunggu", "Dikerjakan", "Selesai", "Gagal"];

export const STATUS_STEPS: Record<ServiceStatus, { label: string; color: string }> = {
  Menunggu: { label: "Menunggu", color: "bg-gray-100 text-gray-700" },
  Dikerjakan: { label: "Dikerjakan", color: "bg-blue-100 text-blue-700" },
  Selesai: { label: "Selesai", color: "bg-green-100 text-green-700" },
  Gagal: { label: "Gagal", color: "bg-red-100 text-red-700" },
};
