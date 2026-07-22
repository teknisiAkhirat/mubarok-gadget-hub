export type ServiceStatus = "Masuk" | "Diagnosa" | "Proses Perbaikan" | "Selesai" | "Diambil";

export type Ticket = {
  id: string;
  ticket_number: string;
  customer_name: string;
  customer_phone: string | null;
  device_model: string;
  issue_description: string;
  status: ServiceStatus;
  notes: string | null;
  updated_at: string;
  created_at: string;
};

export const STATUS_ORDER: ServiceStatus[] = ["Masuk", "Diagnosa", "Proses Perbaikan", "Selesai", "Diambil"];

export const STATUS_STEPS: Record<ServiceStatus, { label: string; color: string }> = {
  Masuk: { label: "Baru Masuk", color: "bg-gray-100 text-gray-700" },
  Diagnosa: { label: "Sedang Didiagnosa", color: "bg-yellow-100 text-yellow-800" },
  "Proses Perbaikan": { label: "Proses Perbaikan", color: "bg-blue-100 text-blue-800" },
  Selesai: { label: "Selesai", color: "bg-green-100 text-green-800" },
  Diambil: { label: "Sudah Diambil", color: "bg-emerald-100 text-emerald-800" },
};
