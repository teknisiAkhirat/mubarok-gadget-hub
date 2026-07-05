import samsungM52 from "@/assets/samsung-m52.jpg";
import spenNote8 from "@/assets/spen-note8.jpg";

export type ProductType = "hp-bekas" | "sparepart" | "tablet";

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  "hp-bekas": "HP Bekas",
  sparepart: "Sparepart",
  tablet: "Tablet",
};

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
  description:
    "Menyediakan smartphone dan sparepart bekas bergaransi. Terima tukar-tambah.",
  city: "Blora, Jawa Tengah",
  rating: 4.9,
  ratingCount: 0,
  totalSold: 0,
  productCount: 2,
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
      { id: "sam-m52", brandId: "brand-samsung", name: "Galaxy M52", slug: "galaxy-m52", releaseYear: 2021 },
      { id: "sam-note8", brandId: "brand-samsung", name: "Galaxy Note 8", slug: "galaxy-note-8", releaseYear: 2017 },
      { id: "sam-a32", brandId: "brand-samsung", name: "Galaxy A32", slug: "galaxy-a32", releaseYear: 2021 },
      { id: "sam-a53", brandId: "brand-samsung", name: "Galaxy A53", slug: "galaxy-a53", releaseYear: 2022 },
    ],
  },
  {
    id: "brand-xiaomi", name: "Xiaomi", slug: "xiaomi", logo: "",
    models: [
      { id: "xmi-redmi9", brandId: "brand-xiaomi", name: "Redmi 9", slug: "redmi-9", releaseYear: 2020 },
      { id: "xmi-redmi10", brandId: "brand-xiaomi", name: "Redmi 10", slug: "redmi-10", releaseYear: 2021 },
    ],
  },
  { id: "brand-oppo", name: "Oppo", slug: "oppo", logo: "", models: [
      { id: "oppo-a54", brandId: "brand-oppo", name: "A54", slug: "a54", releaseYear: 2021 },
  ]},
  { id: "brand-vivo", name: "Vivo", slug: "vivo", logo: "", models: [] },
  { id: "brand-realme", name: "Realme", slug: "realme", logo: "", models: [] },
  { id: "brand-iphone", name: "iPhone", slug: "iphone", logo: "", models: [] },
  { id: "brand-tecno", name: "Tecno", slug: "tecno", logo: "", models: [] },
  { id: "brand-infinix", name: "Infinix", slug: "infinix", logo: "", models: [] },
  { id: "brand-motorola", name: "Motorola", slug: "motorola", logo: "", models: [] },
  { id: "brand-huawei", name: "Huawei", slug: "huawei", logo: "", models: [] },
  { id: "brand-oppo", name: "Oppo", slug: "oppo", logo: "", models: [] },
];

export const mockCategories: SparePartCategory[] = [
  { id: "cat-aksesori", name: "Aksesori", slug: "aksesori", icon: "🖊️", description: "S Pen, stylus, aksesori HP lainnya" },
  { id: "cat-lcd", name: "LCD / Display", slug: "lcd-display", icon: "📱", description: "LCD, AMOLED, touchscreen" },
  { id: "cat-baterai", name: "Baterai", slug: "baterai", icon: "🔋", description: "Baterai original dan compatible" },
  { id: "cat-kamera", name: "Kamera", slug: "kamera", icon: "📷", description: "Modul kamera depan & belakang" },
  { id: "cat-charging", name: "Charging Port", slug: "charging-port", icon: "⚡", description: "Konektor charger, flex charging" },
  { id: "cat-casing", name: "Casing & Frame", slug: "casing-frame", icon: "🔲", description: "Back cover, middle frame, housing" },
  { id: "cat-ic", name: "IC & Board", slug: "ic-board", icon: "🔧", description: "IC power, IC charging, mainboard" },
  { id: "cat-flex", name: "Flex Cable", slug: "flex-cable", icon: "🔌", description: "Flexible kamera, tombol, sensor" },
  { id: "cat-audio", name: "Speaker & Mic", slug: "speaker-mic", icon: "🔊", description: "Loud speaker, earpiece, mikrofon" },
];

export const mockProducts: Product[] = [
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
      Garansi: "3 hari garansi toko",
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
  },
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
      Garansi: "3 hari",
    },
    price: 75000,
    compareAtPrice: null,
    stock: 1,
    images: [spenNote8],
    warranty: "3 hari",
    weight: 20,
    rating: 0,
    reviewCount: 0,
    soldCount: 0,
    isFeatured: true,
    isActive: true,
    tags: ["s pen", "stylus", "samsung", "note 8", "aksesori"],
    createdAt: new Date("2025-06-01"),
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
