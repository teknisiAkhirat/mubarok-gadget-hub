import { WHATSAPP_NUMBER } from "@/config/constants";

export function formatIDR(value: number): string {
  return "Rp " + value.toLocaleString("id-ID");
}

export function waLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
