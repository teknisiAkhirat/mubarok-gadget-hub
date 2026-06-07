export function formatIDR(value: number): string {
  return "Rp " + value.toLocaleString("id-ID");
}

export const WHATSAPP_NUMBER = "62895604901090";

export function waLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
