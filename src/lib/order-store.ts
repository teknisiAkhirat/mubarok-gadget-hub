export type OrderStatus = "Menunggu Konfirmasi" | "Diproses" | "Dikirim" | "Selesai";

export interface OrderItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderAddress {
  name: string;
  phone: string;
  street: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  shippingMethod: string;
  shippingCost: number;
  payment: string;
  address: OrderAddress;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

const STORAGE_KEY = "mubarok_orders";

function isOrder(value: unknown): value is Order {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.orderNumber === "string" &&
    typeof v.total === "number" &&
    Array.isArray(v.items)
  );
}

export function getOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Order[];
    return Array.isArray(parsed) ? parsed.filter(isOrder) : [];
  } catch {
    return [];
  }
}

export function insertOrder(order: Order): void {
  if (typeof window === "undefined") return;
  try {
    const orders = getOrders();
    localStorage.setItem(STORAGE_KEY, JSON.stringify([order, ...orders]));
  } catch {
    // localStorage may be full or disabled
  }
}

export function updateOrderStatus(orderNumber: string, status: OrderStatus): boolean {
  if (typeof window === "undefined") return false;
  try {
    const orders = getOrders();
    const idx = orders.findIndex((o) => o.orderNumber === orderNumber);
    if (idx === -1) return false;
    orders[idx] = { ...orders[idx], status };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    return true;
  } catch {
    return false;
  }
}

export function findOrderByNumber(orderNumber: string): Order | undefined {
  return getOrders().find((o) => o.orderNumber === orderNumber);
}

const SEEDED_FLAG_KEY = "mubarok_orders_seeded";

export function seedOrdersIfEmpty(): void {
  if (typeof window === "undefined") return;
  try {
    if (localStorage.getItem(STORAGE_KEY) || localStorage.getItem(SEEDED_FLAG_KEY)) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedOrders));
    localStorage.setItem(SEEDED_FLAG_KEY, "1");
  } catch {
    // localStorage may be full or disabled
  }
}

const now = Date.now();
const day = 24 * 60 * 60 * 1000;

const seedOrders: Order[] = [
  {
    id: "ord-seed-1",
    orderNumber: "MUB-10000001",
    items: [
      {
        productId: "hp-001",
        slug: "samsung-galaxy-m52-5g-bekas",
        name: "Samsung Galaxy M52 5G Bekas",
        price: 1750000,
        quantity: 1,
      },
    ],
    subtotal: 1750000,
    shippingMethod: "jne",
    shippingCost: 15000,
    payment: "transfer",
    address: {
      name: "Andi Pratama",
      phone: "6281234567890",
      street: "Jl. Raya Blora No. 10",
      district: "Blora Kota",
      city: "Blora",
      province: "Jawa Tengah",
      postalCode: "58211",
    },
    total: 1765000,
    status: "Selesai",
    createdAt: new Date(now - 3 * day).toISOString(),
  },
  {
    id: "ord-seed-2",
    orderNumber: "MUB-10000002",
    items: [
      {
        productId: "sp-001",
        slug: "lcd-samsung-galaxy-a32-original",
        name: "LCD Samsung Galaxy A32 Original",
        price: 350000,
        quantity: 2,
      },
    ],
    subtotal: 700000,
    shippingMethod: "jnt",
    shippingCost: 14000,
    payment: "qris",
    address: {
      name: "Siti Rahma",
      phone: "6281234554321",
      street: "Gg. Melati No. 3",
      district: "Cepu",
      city: "Blora",
      province: "Jawa Tengah",
      postalCode: "58311",
    },
    total: 714000,
    status: "Diproses",
    createdAt: new Date(now - 2 * day).toISOString(),
  },
  {
    id: "ord-seed-3",
    orderNumber: "MUB-10000003",
    items: [
      {
        productId: "hp-003",
        slug: "samsung-galaxy-a32-bekas",
        name: "Samsung Galaxy A32 Bekas",
        price: 1100000,
        quantity: 1,
      },
    ],
    subtotal: 1100000,
    shippingMethod: "ambil",
    shippingCost: 0,
    payment: "cod",
    address: {
      name: "Budi Santoso",
      phone: "6281288776655",
      street: "Jl. Pemuda No. 21",
      district: "Blora Kota",
      city: "Blora",
      province: "Jawa Tengah",
      postalCode: "58211",
    },
    total: 1100000,
    status: "Menunggu Konfirmasi",
    createdAt: new Date(now - 1 * day).toISOString(),
  },
];
