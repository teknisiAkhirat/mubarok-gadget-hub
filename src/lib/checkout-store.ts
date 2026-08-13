export interface CheckoutAddress {
  name: string;
  phone: string;
  street: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface CheckoutShipping {
  method: string;
  cost: number;
}

export interface CheckoutDraft {
  step: number;
  done: boolean;
  lastOrderNumber: string | null;
  lastOrderTotal: number;
  lastOrderPayment: string;
  address: CheckoutAddress;
  shipping: CheckoutShipping;
  payment: string;
}

const STORAGE_KEY = "mubarok_checkout_draft";

export const DEFAULT_SHIPPING: CheckoutShipping = { method: "jne", cost: 15000 };

export function createDefaultCheckoutDraft(): CheckoutDraft {
  return {
    step: 0,
    done: false,
    lastOrderNumber: null,
    lastOrderTotal: 0,
    lastOrderPayment: "",
    address: {
      name: "",
      phone: "",
      street: "",
      district: "",
      city: "",
      province: "Jawa Tengah",
      postalCode: "",
    },
    shipping: { ...DEFAULT_SHIPPING },
    payment: "transfer",
  };
}

export function generateOrderNumber(): string {
  return `MUB-${Date.now().toString().slice(-8)}`;
}

export function loadCheckoutDraft(): CheckoutDraft {
  if (typeof window === "undefined") return createDefaultCheckoutDraft();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultCheckoutDraft();
    const parsed = JSON.parse(raw) as Partial<CheckoutDraft>;
    const def = createDefaultCheckoutDraft();
    return {
      ...def,
      ...parsed,
      address: { ...def.address, ...(parsed.address ?? {}) },
      shipping: { ...def.shipping, ...(parsed.shipping ?? {}) },
    };
  } catch {
    return createDefaultCheckoutDraft();
  }
}

export function saveCheckoutDraft(draft: CheckoutDraft): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // localStorage may be full or disabled
  }
}

export function clearCheckoutDraft(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage may be full or disabled
  }
}
