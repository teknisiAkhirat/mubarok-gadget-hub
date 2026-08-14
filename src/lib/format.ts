export function formatIDR(value: number): string {
  return "Rp " + value.toLocaleString("id-ID");
}

export const WHATSAPP_NUMBER = "62895604901090";

export function waLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function formatWA(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("62")) {
    const rest = cleaned.slice(2);
    return `+62 ${rest.slice(0, 3)} ${rest.slice(3, 7)} ${rest.slice(7)}`;
  }
  return cleaned;
}
