// ============================================================
// Global Configuration — Mubarok Gadget Hub
// Semua CTA WhatsApp dan data kontak HARUS merujuk file ini.
// ============================================================

export const WHATSAPP_NUMBER = "62895604901090";

export const STORE = {
  name: "Mubarok Gadget Hub",
  shortName: "Mubarok GH",
  owner: "Imam",
  city: "Blora, Jawa Tengah",
  address: "Blora, Jawa Tengah, Indonesia",
  operationalHours: "Senin–Sabtu 09.00–15.00 WIB",
  responseTime: "< 1 jam",
  rating: 4.9,
  joinedYear: 2025,
} as const;

export const WA_LINK = {
  /** Chat umum / tanya produk */
  general: (msg?: string) =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      msg ?? "Halo Mubarok Gadget Hub, saya ingin bertanya.",
    )}`,

  /** Tukar tambah — data diisi dari form */
  tradeIn: (data: {
    nama: string;
    merek: string;
    model: string;
    kondisi: string;
    kerusakan: string;
  }) => {
    const text = [
      `Halo Mubarok Gadget Hub, saya ingin tukar tambah.`,
      ``,
      `Nama: ${data.nama}`,
      `Merek: ${data.merek}`,
      `Model: ${data.model}`,
      `Kondisi: ${data.kondisi}`,
      `Kerusakan: ${data.kerusakan}`,
      ``,
      `Mohon info lebih lanjut. Terima kasih.`,
    ].join("\n");
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  },

  /** Servis — data diisi dari form */
  service: (data: { nama: string; merek: string; model: string; keluhan: string }) => {
    const text = [
      `Halo Mubarok Gadget Hub, saya ingin servis HP.`,
      ``,
      `Nama: ${data.nama}`,
      `Merek: ${data.merek}`,
      `Model: ${data.model}`,
      `Keluhan: ${data.keluhan}`,
      ``,
      `Mohon info lebih lanjut. Terima kasih.`,
    ].join("\n");
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  },

  /** Beli produk */
  buy: (productName: string, price: string, pageUrl?: string) => {
    const lines = [
      `Halo Mubarok Gadget Hub, saya tertarik dengan produk:`,
      ``,
      `Produk: ${productName}`,
      `Harga: ${price}`,
    ];
    if (pageUrl) lines.push(`Link: ${pageUrl}`);
    lines.push(``, `Apakah masih tersedia?`);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  },
} as const;
