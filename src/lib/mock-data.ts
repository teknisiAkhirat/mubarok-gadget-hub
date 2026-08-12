import samsungM52 from "@/assets/samsung-m52.jpg";
import spenNote8 from "@/assets/spen-note8.jpg";

export type ProductType = "hp-bekas" | "sparepart" | "tablet";

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  "hp-bekas": "HP Bekas",
  sparepart: "Sparepart",
  tablet: "Tablet",
};

export interface InspectionItem {
  name: string;
  status: "Normal" | "Masalah" | "Tidak Dicek";
  note?: string;
}

export interface Product {
  id: string;
  sellerId: string;
  type: ProductType;
  name: string;
  slug: string;
  categoryId: string | null;
  compatibleWith: string[];
  brandId: string;
  modelId: string | null;
  condition: "mulus" | "normal" | "ori-copotan" | "compatible";
  conditionLabel: string;
  conditionNote: string;
  description: string;
  specifications: Record<string, string>;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  images: string[];
  warranty: string;
  weight: number;
  rating: number;
  reviewCount: number;
  soldCount: number;
  isFeatured: boolean;
  isActive: boolean;
  tags: string[];
  createdAt: Date;
  // Trust Layer fields
  inspection?: InspectionItem[];
  defects?: string[];
  grade?: string;
}

export interface PhoneModel {
  id: string;
  brandId: string;
  name: string;
  slug: string;
  releaseYear: number;
}

export interface PhoneBrand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  models: PhoneModel[];
}

export interface SparePartCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
}

export interface Seller {
  id: string;
  storeName: string;
  slug: string;
  ownerName: string;
  avatar: string;
  description: string;
  city: string;
  rating: number;
  ratingCount: number;
  totalSold: number;
  productCount: number;
  responseRate: number;
  responseTime: string;
  isVerified: boolean;
  joinedAt: Date;
  operationalHours: string;
  whatsapp: string;
  bannerImage: string;
}

export const mockSeller: Seller = {
  id: "seller-mubarok",
  storeName: "Mubarok Smartphone Sales & Service",
  slug: "mubarok-sms",
  ownerName: "Imam",
  avatar: "",
  description: "Menyediakan smartphone dan sparepart bekas bergaransi. Terima tukar-tambah.",
  city: "Blora, Jawa Tengah",
  rating: 4.9,
  ratingCount: 0,
  totalSold: 0,
  productCount: 8,
  responseRate: 100,
  responseTime: "< 1 jam",
  isVerified: true,
  joinedAt: new Date("2025-01-01"),
  operationalHours: "Senin–Sabtu 09.00–15.00",
  whatsapp: "62895604901090",
  bannerImage: "",
};

export const mockBrands: PhoneBrand[] = [
  {
    id: "brand-samsung",
    name: "Samsung",
    slug: "samsung",
    logo: "",
    models: [
      {
        id: "sam-m52",
        brandId: "brand-samsung",
        name: "Galaxy M52",
        slug: "galaxy-m52",
        releaseYear: 2021,
      },
      {
        id: "sam-note8",
        brandId: "brand-samsung",
        name: "Galaxy Note 8",
        slug: "galaxy-note-8",
        releaseYear: 2017,
      },
      {
        id: "sam-a32",
        brandId: "brand-samsung",
        name: "Galaxy A32",
        slug: "galaxy-a32",
        releaseYear: 2021,
      },
      {
        id: "sam-a53",
        brandId: "brand-samsung",
        name: "Galaxy A53",
        slug: "galaxy-a53",
        releaseYear: 2022,
      },
      {
        id: "sam-s23",
        brandId: "brand-samsung",
        name: "Galaxy S23",
        slug: "galaxy-s23",
        releaseYear: 2023,
      },
    ],
  },
  {
    id: "brand-xiaomi",
    name: "Xiaomi",
    slug: "xiaomi",
    logo: "",
    models: [
      {
        id: "xmi-redmi9",
        brandId: "brand-xiaomi",
        name: "Redmi 9",
        slug: "redmi-9",
        releaseYear: 2020,
      },
      {
        id: "xmi-redmi10",
        brandId: "brand-xiaomi",
        name: "Redmi 10",
        slug: "redmi-10",
        releaseYear: 2021,
      },
      {
        id: "xmi-poco-m3",
        brandId: "brand-xiaomi",
        name: "POCO M3",
        slug: "poco-m3",
        releaseYear: 2020,
      },
    ],
  },
  {
    id: "brand-oppo",
    name: "Oppo",
    slug: "oppo",
    logo: "",
    models: [
      { id: "oppo-a54", brandId: "brand-oppo", name: "A54", slug: "a54", releaseYear: 2021 },
      { id: "oppo-a55", brandId: "brand-oppo", name: "A55", slug: "a55", releaseYear: 2021 },
    ],
  },
  { id: "brand-vivo", name: "Vivo", slug: "vivo", logo: "", models: [] },
  { id: "brand-realme", name: "Realme", slug: "realme", logo: "", models: [] },
  { id: "brand-iphone", name: "iPhone", slug: "iphone", logo: "", models: [] },
  { id: "brand-tecno", name: "Tecno", slug: "tecno", logo: "", models: [] },
  { id: "brand-infinix", name: "Infinix", slug: "infinix", logo: "", models: [] },
  { id: "brand-motorola", name: "Motorola", slug: "motorola", logo: "", models: [] },
  { id: "brand-huawei", name: "Huawei", slug: "huawei", logo: "", models: [] },
];

export const mockCategories: SparePartCategory[] = [
  {
    id: "cat-aksesori",
    name: "Aksesori",
    slug: "aksesori",
    icon: "🖊️",
    description: "S Pen, stylus, aksesori HP lainnya",
  },
  {
    id: "cat-lcd",
    name: "LCD / Display",
    slug: "lcd-display",
    icon: "📱",
    description: "LCD, AMOLED, touchscreen",
  },
  {
    id: "cat-baterai",
    name: "Baterai",
    slug: "baterai",
    icon: "🔋",
    description: "Baterai original dan compatible",
  },
  {
    id: "cat-kamera",
    name: "Kamera",
    slug: "kamera",
    icon: "📷",
    description: "Modul kamera depan & belakang",
  },
  {
    id: "cat-charging",
    name: "Charging Port",
    slug: "charging-port",
    icon: "⚡",
    description: "Konektor charger, flex charging",
  },
  {
    id: "cat-casing",
    name: "Casing & Frame",
    slug: "casing-frame",
    icon: "🔲",
    description: "Back cover, middle frame, housing",
  },
  {
    id: "cat-ic",
    name: "IC & Board",
    slug: "ic-board",
    icon: "🔧",
    description: "IC power, IC charging, mainboard",
  },
  {
    id: "cat-flex",
    name: "Flex Cable",
    slug: "flex-cable",
    icon: "🔌",
    description: "Flexible kamera, tombol, sensor",
  },
  {
    id: "cat-audio",
    name: "Speaker & Mic",
    slug: "speaker-mic",
    icon: "🔊",
    description: "Loud speaker, earpiece, mikrofon",
  },
];

export const mockProducts: Product[] = [
  // ── HP Bekas ──────────────────────────────────────────────
  {
    id: "hp-001",
    sellerId: "seller-mubarok",
    type: "hp-bekas",
    name: "Samsung Galaxy M52 Bekas",
    slug: "samsung-galaxy-m52-bekas",
    categoryId: null,
    compatibleWith: [],
    brandId: "brand-samsung",
    modelId: "sam-m52",
    condition: "normal",
    conditionLabel: "Normal",
    conditionNote: "Mesin belum pernah servis. Layar non AMOLED.",
    grade: "B+",
    description:
      "Samsung Galaxy M52 bekas kondisi normal. Mesin mulus belum pernah servis. Layar non AMOLED. Unit berfungsi sempurna. Garansi toko 3 hari.",
    specifications: {
      Merek: "Samsung",
      Tipe: "Galaxy M52",
      Chipset: "Snapdragon 778G",
      RAM: "6 GB",
      Storage: "128 GB",
      Baterai: "5000 mAh",
      Layar: "6.7 inch FHD+ (non AMOLED)",
      "Kamera Belakang": "64 MP + 12 MP + 5 MP",
      "Kondisi Mesin": "Normal, belum pernah servis",
    },
    price: 1500000,
    compareAtPrice: null,
    stock: 1,
    images: [samsungM52],
    warranty: "3 hari garansi toko",
    weight: 300,
    rating: 0,
    reviewCount: 0,
    soldCount: 0,
    isFeatured: true,
    isActive: true,
    tags: ["samsung", "m52", "galaxy", "hp bekas", "android"],
    createdAt: new Date("2025-06-01"),
    inspection: [
      { name: "Layar", status: "Normal" },
      { name: "Touchscreen", status: "Normal" },
      { name: "Kamera Depan", status: "Normal" },
      { name: "Kamera Belakang", status: "Normal" },
      { name: "Speaker", status: "Normal" },
      { name: "Microphone", status: "Normal" },
      { name: "Charging", status: "Normal" },
      { name: "Wi-Fi", status: "Normal" },
      { name: "Bluetooth", status: "Normal" },
      { name: "SIM", status: "Normal" },
      { name: "Fingerprint", status: "Normal" },
      { name: "Baterai", status: "Normal", note: "Kapasitas masih bagus" },
      { name: "Tombol Power", status: "Normal" },
      { name: "Tombol Volume", status: "Normal" },
    ],
    defects: [],
  },
  {
    id: "hp-002",
    sellerId: "seller-mubarok",
    type: "hp-bekas",
    name: "Samsung Galaxy A32 Bekas",
    slug: "samsung-galaxy-a32-bekas",
    categoryId: null,
    compatibleWith: [],
    brandId: "brand-samsung",
    modelId: "sam-a32",
    condition: "normal",
    conditionLabel: "Normal",
    conditionNote: "Layar AMOLED normal. Body ada lecet ringan di samping.",
    grade: "B",
    description:
      "Samsung Galaxy A32 bekas kondisi normal. Layar AMOLED masih bagus. Body ada lecet ringan di frame samping. Mesin normal, semua fungsi jalan.",
    specifications: {
      Merek: "Samsung",
      Tipe: "Galaxy A32",
      Chipset: "Helio G80",
      RAM: "6 GB",
      Storage: "128 GB",
      Baterai: "5000 mAh",
      Layar: "6.4 inch Super AMOLED",
      "Kamera Belakang": "64 MP + 8 MP + 5 MP + 5 MP",
    },
    price: 1200000,
    compareAtPrice: null,
    stock: 2,
    images: [samsungM52],
    warranty: "7 hari garansi toko",
    weight: 185,
    rating: 0,
    reviewCount: 0,
    soldCount: 1,
    isFeatured: false,
    isActive: true,
    tags: ["samsung", "a32", "galaxy", "hp bekas", "amoleed"],
    createdAt: new Date("2025-07-15"),
    inspection: [
      { name: "Layar", status: "Normal" },
      { name: "Touchscreen", status: "Normal" },
      { name: "Kamera Depan", status: "Normal" },
      { name: "Kamera Belakang", status: "Normal" },
      { name: "Speaker", status: "Normal" },
      { name: "Microphone", status: "Normal" },
      { name: "Charging", status: "Normal" },
      { name: "Wi-Fi", status: "Normal" },
      { name: "Bluetooth", status: "Normal" },
      { name: "SIM", status: "Normal" },
      { name: "Fingerprint", status: "Normal" },
      { name: "Baterai", status: "Normal" },
      { name: "Tombol Power", status: "Normal" },
      { name: "Tombol Volume", status: "Normal" },
    ],
    defects: ["Frame samping kanan terdapat lecet ringan sepanjang ~2cm"],
  },
  {
    id: "hp-003",
    sellerId: "seller-mubarok",
    type: "hp-bekas",
    name: "Xiaomi Redmi 10 Bekas",
    slug: "xiaomi-redmi-10-bekas",
    categoryId: null,
    compatibleWith: [],
    brandId: "brand-xiaomi",
    modelId: "xmi-redmi10",
    condition: "normal",
    conditionLabel: "Normal",
    conditionNote: "Baterai sudah agak drop. Fungsi semua normal.",
    grade: "B",
    description:
      "Xiaomi Redmi 10 bekas. Fungsi semua normal — touchscreen, kamera, speaker, WiFi, Bluetooth. Baterai sudah mulai agak drop (kapasitas ~80%). Cocok untuk daily use.",
    specifications: {
      Merek: "Xiaomi",
      Tipe: "Redmi 10",
      Chipset: "Helio G88",
      RAM: "4 GB",
      Storage: "64 GB",
      Baterai: "5000 mAh",
      Layar: "6.5 inch FHD+",
      "Kamera Belakang": "50 MP + 8 MP + 2 MP + 2 MP",
    },
    price: 850000,
    compareAtPrice: null,
    stock: 2,
    images: [samsungM52],
    warranty: "3 hari garansi toko",
    weight: 181,
    rating: 0,
    reviewCount: 0,
    soldCount: 0,
    isFeatured: false,
    isActive: true,
    tags: ["xiaomi", "redmi 10", "hp bekas", "android"],
    createdAt: new Date("2025-08-01"),
    inspection: [
      { name: "Layar", status: "Normal" },
      { name: "Touchscreen", status: "Normal" },
      { name: "Kamera Depan", status: "Normal" },
      { name: "Kamera Belakang", status: "Normal" },
      { name: "Speaker", status: "Normal" },
      { name: "Microphone", status: "Normal" },
      { name: "Charging", status: "Normal" },
      { name: "Wi-Fi", status: "Normal" },
      { name: "Bluetooth", status: "Normal" },
      { name: "SIM", status: "Normal" },
      { name: "Fingerprint", status: "Normal" },
      { name: "Baterai", status: "Masalah", note: "Kapasitas ~80%, agak drop" },
      { name: "Tombol Power", status: "Normal" },
      { name: "Tombol Volume", status: "Normal" },
    ],
    defects: ["Baterai sudah mulai agak drop (kapasitas estimasi ~80%)"],
  },
  {
    id: "hp-004",
    sellerId: "seller-mubarok",
    type: "hp-bekas",
    name: "Oppo A55 Bekas",
    slug: "oppo-a55-bekas",
    categoryId: null,
    compatibleWith: [],
    brandId: "brand-oppo",
    modelId: "oppo-a55",
    condition: "mulus",
    conditionLabel: "Mulus",
    conditionNote: "Kondisi sangat mulus, jarang dipakai. Fullset.",
    grade: "A",
    description:
      "Oppo A55 bekas kondisi mulus. Pemakaian jarang, tidak ada lecet sama sekali. Fullset dengan kotak dan charger original. Baterai masih normal.",
    specifications: {
      Merek: "Oppo",
      Tipe: "A55",
      Chipset: "Helio G35",
      RAM: "4 GB",
      Storage: "64 GB",
      Baterai: "5000 mAh",
      Layar: "6.5 inch HD+",
      "Kamera Belakang": "50 MP + 2 MP + 2 MP",
    },
    price: 950000,
    compareAtPrice: 1100000,
    stock: 1,
    images: [samsungM52],
    warranty: "14 hari garansi toko",
    weight: 193,
    rating: 0,
    reviewCount: 0,
    soldCount: 0,
    isFeatured: true,
    isActive: true,
    tags: ["oppo", "a55", "hp bekas", "mulus", "fullset"],
    createdAt: new Date("2025-08-10"),
    inspection: [
      { name: "Layar", status: "Normal" },
      { name: "Touchscreen", status: "Normal" },
      { name: "Kamera Depan", status: "Normal" },
      { name: "Kamera Belakang", status: "Normal" },
      { name: "Speaker", status: "Normal" },
      { name: "Microphone", status: "Normal" },
      { name: "Charging", status: "Normal" },
      { name: "Wi-Fi", status: "Normal" },
      { name: "Bluetooth", status: "Normal" },
      { name: "SIM", status: "Normal" },
      { name: "Fingerprint", status: "Normal" },
      { name: "Baterai", status: "Normal" },
      { name: "Tombol Power", status: "Normal" },
      { name: "Tombol Volume", status: "Normal" },
    ],
    defects: [],
  },
  {
    id: "hp-005",
    sellerId: "seller-mubarok",
    type: "hp-bekas",
    name: "Samsung Galaxy A53 Bekas",
    slug: "samsung-galaxy-a53-bekas",
    categoryId: null,
    compatibleWith: [],
    brandId: "brand-samsung",
    modelId: "sam-a53",
    condition: "normal",
    conditionLabel: "Normal",
    conditionNote: "Pernah ganti LCD. Fungsi normal.",
    grade: "B-",
    description:
      "Samsung Galaxy A53 bekas. Pernah ganti LCD (compatible, bukan original Samsung). Fungsi lain normal — kamera, speaker, WiFi, Bluetooth, fingerprint. Cocok untuk yang mencari harga terjangkau.",
    specifications: {
      Merek: "Samsung",
      Tipe: "Galaxy A53",
      Chipset: "Exynos 1280",
      RAM: "6 GB",
      Storage: "128 GB",
      Baterai: "5000 mAh",
      Layar: "6.5 inch Super AMOLED",
      "Kamera Belakang": "64 MP + 12 MP + 5 MP + 5 MP",
    },
    price: 1350000,
    compareAtPrice: null,
    stock: 1,
    images: [samsungM52],
    warranty: "3 hari garansi toko",
    weight: 189,
    rating: 0,
    reviewCount: 0,
    soldCount: 0,
    isFeatured: false,
    isActive: true,
    tags: ["samsung", "a53", "galaxy", "hp bekas", "amoleed"],
    createdAt: new Date("2025-07-20"),
    inspection: [
      { name: "Layar", status: "Normal", note: "LCD compatible (bukan original)" },
      { name: "Touchscreen", status: "Normal" },
      { name: "Kamera Depan", status: "Normal" },
      { name: "Kamera Belakang", status: "Normal" },
      { name: "Speaker", status: "Normal" },
      { name: "Microphone", status: "Normal" },
      { name: "Charging", status: "Normal" },
      { name: "Wi-Fi", status: "Normal" },
      { name: "Bluetooth", status: "Normal" },
      { name: "SIM", status: "Normal" },
      { name: "Fingerprint", status: "Normal" },
      { name: "Baterai", status: "Normal" },
      { name: "Tombol Power", status: "Normal" },
      { name: "Tombol Volume", status: "Normal" },
    ],
    defects: ["LCD pernah diganti dengan unit compatible (bukan original Samsung)"],
  },
  {
    id: "hp-006",
    sellerId: "seller-mubarok",
    type: "hp-bekas",
    name: "Xiaomi POCO M3 Bekas",
    slug: "xiaomi-poco-m3-bekas",
    categoryId: null,
    compatibleWith: [],
    brandId: "brand-xiaomi",
    modelId: "xmi-poco-m3",
    condition: "normal",
    conditionLabel: "Normal",
    conditionNote: "Layar ada gores ringan. Fungsi normal semua.",
    grade: "B",
    description:
      "Xiaomi POCO M3 bekas. Layar ada gores ringan tapi tidak mengganggu tampilan. Fungsi semua normal. Baterai besar 6000 mAh, tahan lama.",
    specifications: {
      Merek: "Xiaomi",
      Tipe: "POCO M3",
      Chipset: "Snapdragon 662",
      RAM: "4 GB",
      Storage: "64 GB",
      Baterai: "6000 mAh",
      Layar: "6.53 inch FHD+",
      "Kamera Belakang": "48 MP + 2 MP + 2 MP",
    },
    price: 750000,
    compareAtPrice: null,
    stock: 3,
    images: [samsungM52],
    warranty: "3 hari garansi toko",
    weight: 198,
    rating: 0,
    reviewCount: 0,
    soldCount: 2,
    isFeatured: false,
    isActive: true,
    tags: ["xiaomi", "poco", "m3", "hp bekas", "baterai besar"],
    createdAt: new Date("2025-07-25"),
    inspection: [
      { name: "Layar", status: "Normal", note: "Ada gores ringan" },
      { name: "Touchscreen", status: "Normal" },
      { name: "Kamera Depan", status: "Normal" },
      { name: "Kamera Belakang", status: "Normal" },
      { name: "Speaker", status: "Normal" },
      { name: "Microphone", status: "Normal" },
      { name: "Charging", status: "Normal" },
      { name: "Wi-Fi", status: "Normal" },
      { name: "Bluetooth", status: "Normal" },
      { name: "SIM", status: "Normal" },
      { name: "Fingerprint", status: "Normal" },
      { name: "Baterai", status: "Normal" },
      { name: "Tombol Power", status: "Normal" },
      { name: "Tombol Volume", status: "Normal" },
    ],
    defects: ["Layar terdapat gores ringan di pojok kiri atas (tidak mengganggu tampilan)"],
  },
  // ── Sparepart ─────────────────────────────────────────────
  {
    id: "sp-001",
    sellerId: "seller-mubarok",
    type: "sparepart",
    name: "S Pen Samsung Galaxy Note 8 - Original Copotan",
    slug: "s-pen-samsung-galaxy-note-8-ori-copotan",
    categoryId: "cat-aksesori",
    compatibleWith: ["sam-note8"],
    brandId: "brand-samsung",
    modelId: null,
    condition: "ori-copotan",
    conditionLabel: "Ori Copotan",
    conditionNote: "Kondisi normal, berfungsi baik.",
    description:
      "S Pen Samsung Galaxy Note 8 original copotan. Kondisi normal, stylus berfungsi baik. Cocok untuk pengganti S Pen yang hilang atau rusak.",
    specifications: {
      Kompatibel: "Samsung Galaxy Note 8",
      Tipe: "S Pen Stylus",
      Kondisi: "Original Copotan — Normal",
      Warna: "Hitam",
    },
    price: 75000,
    compareAtPrice: null,
    stock: 1,
    images: [spenNote8],
    warranty: "3 hari garansi toko",
    weight: 20,
    rating: 0,
    reviewCount: 0,
    soldCount: 0,
    isFeatured: false,
    isActive: true,
    tags: ["s pen", "stylus", "samsung", "note 8", "aksesori"],
    createdAt: new Date("2025-06-01"),
  },
  {
    id: "sp-002",
    sellerId: "seller-mubarok",
    type: "sparepart",
    name: "Baterai Samsung Galaxy A32 - Compatible",
    slug: "baterai-samsung-galaxy-a32-compatible",
    categoryId: "cat-baterai",
    compatibleWith: ["sam-a32"],
    brandId: "brand-samsung",
    modelId: null,
    condition: "compatible",
    conditionLabel: "Compatible",
    conditionNote: "Baterai aftermarket, kapasitas normal.",
    description:
      "Baterai Samsung Galaxy A32 compatible. Kapasitas 5000mAh, sudah diuji. Cocok untuk baterai yang sudah drop.",
    specifications: {
      Kompatibel: "Samsung Galaxy A32",
      Tipe: "Li-Po Battery",
      Kapasitas: "5000 mAh",
      Kondisi: "Compatible — Sudah Diuji",
    },
    price: 85000,
    compareAtPrice: null,
    stock: 4,
    images: [],
    warranty: "3 hari garansi toko",
    weight: 70,
    rating: 0,
    reviewCount: 0,
    soldCount: 1,
    isFeatured: false,
    isActive: true,
    tags: ["baterai", "samsung", "a32", "battery"],
    createdAt: new Date("2025-07-01"),
  },
];

export function findProductBySlug(slug: string): Product | undefined {
  return mockProducts.find((p) => p.slug === slug);
}

export function findBrand(id: string): PhoneBrand | undefined {
  return mockBrands.find((b) => b.id === id);
}

export function findModel(id: string | null): PhoneModel | undefined {
  if (!id) return undefined;
  for (const b of mockBrands) {
    const m = b.models.find((mm) => mm.id === id);
    if (m) return m;
  }
  return undefined;
}

export function findCategory(id: string | null): SparePartCategory | undefined {
  if (!id) return undefined;
  return mockCategories.find((c) => c.id === id);
}
