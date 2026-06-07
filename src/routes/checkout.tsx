import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useCart } from "@/lib/cart-store";
import { formatIDR, waLink } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, MapPin, Truck, Wallet } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout · Mubarok SMS&S" }] }),
  component: CheckoutPage,
});

const STEPS = ["Alamat", "Pengiriman", "Pembayaran", "Konfirmasi"];

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    district: "",
    city: "",
    province: "Jawa Tengah",
    postalCode: "",
  });
  const [shipping, setShipping] = useState({ method: "jne", cost: 15000 });
  const [payment, setPayment] = useState("transfer");

  const grandTotal = subtotal + shipping.cost;

  if (items.length === 0 && !done) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Keranjang kosong</h1>
        <p className="mt-2 text-muted-foreground">Yuk pilih produk dulu sebelum checkout.</p>
        <Button asChild className="mt-6 bg-[var(--color-brand)]">
          <Link to="/produk">Lihat Produk</Link>
        </Button>
      </div>
    );
  }

  if (done) {
    const orderNumber = `MUB-${Date.now().toString().slice(-8)}`;
    const waMsg = `Halo Mubarok SMS&S, saya baru saja melakukan pemesanan:\n\nNo. Order: ${orderNumber}\nTotal: ${formatIDR(grandTotal)}\nMetode bayar: ${payment}\n\nMohon konfirmasi.`;
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white">
            <Check className="h-8 w-8" />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold">Pesanan Berhasil Dibuat!</h1>
          <p className="mt-2 text-sm text-muted-foreground">No. Pesanan</p>
          <p className="text-lg font-bold">{orderNumber}</p>
          <p className="mt-4 text-sm">
            Total: <strong>{formatIDR(grandTotal)}</strong>
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Status: Menunggu Konfirmasi · Silakan hubungi penjual via WhatsApp untuk konfirmasi pembayaran.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button asChild className="bg-green-500 hover:bg-green-600">
              <a href={waLink(waMsg)} target="_blank" rel="noreferrer">Konfirmasi via WhatsApp</a>
            </Button>
            <Button asChild variant="outline">
              <Link to="/">Kembali ke Beranda</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-extrabold">Checkout</h1>

      {/* Stepper */}
      <div className="mb-8 flex items-center justify-between">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
              i <= step ? "bg-[var(--color-brand)] text-[var(--color-brand-foreground)]" : "bg-muted text-muted-foreground"
            }`}>
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={`ml-2 hidden text-sm font-medium md:inline ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
            {i < STEPS.length - 1 && <div className={`mx-3 h-0.5 flex-1 ${i < step ? "bg-[var(--color-brand)]" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_360px]">
        <div className="rounded-xl border border-border bg-card p-6">
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="flex items-center gap-2 text-lg font-bold"><MapPin className="h-5 w-5" /> Alamat Pengiriman</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nama Penerima" value={address.name} onChange={(v) => setAddress({ ...address, name: v })} />
                <Field label="No. WhatsApp" value={address.phone} onChange={(v) => setAddress({ ...address, phone: v })} />
                <div className="sm:col-span-2">
                  <Field label="Alamat Lengkap" value={address.street} onChange={(v) => setAddress({ ...address, street: v })} />
                </div>
                <Field label="Kecamatan" value={address.district} onChange={(v) => setAddress({ ...address, district: v })} />
                <Field label="Kota/Kabupaten" value={address.city} onChange={(v) => setAddress({ ...address, city: v })} />
                <Field label="Provinsi" value={address.province} onChange={(v) => setAddress({ ...address, province: v })} />
                <Field label="Kode Pos" value={address.postalCode} onChange={(v) => setAddress({ ...address, postalCode: v })} />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="flex items-center gap-2 text-lg font-bold"><Truck className="h-5 w-5" /> Metode Pengiriman</h2>
              {[
                { id: "jne", label: "JNE Reguler", desc: "Estimasi 2-4 hari", cost: 15000 },
                { id: "sicepat", label: "SiCepat", desc: "Estimasi 1-3 hari", cost: 18000 },
                { id: "jnt", label: "J&T Express", desc: "Estimasi 2-4 hari", cost: 14000 },
                { id: "gosend", label: "Gosend (Blora & sekitar)", desc: "Sameday", cost: 25000 },
                { id: "ambil", label: "Ambil Langsung di Toko (Blora)", desc: "Gratis ongkir", cost: 0 },
              ].map((opt) => (
                <label key={opt.id} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 ${shipping.method === opt.id ? "border-[var(--color-accent-orange)] bg-orange-50" : "border-border"}`}>
                  <input
                    type="radio"
                    name="ship"
                    checked={shipping.method === opt.id}
                    onChange={() => setShipping({ method: opt.id, cost: opt.cost })}
                    className="accent-[var(--color-accent-orange)]"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">{opt.label}</div>
                    <div className="text-xs text-muted-foreground">{opt.desc}</div>
                  </div>
                  <div className="font-bold">{opt.cost === 0 ? "Gratis" : formatIDR(opt.cost)}</div>
                </label>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="flex items-center gap-2 text-lg font-bold"><Wallet className="h-5 w-5" /> Metode Pembayaran</h2>
              {[
                { id: "transfer", label: "Transfer Bank", desc: "BCA / BRI / Mandiri" },
                { id: "qris", label: "QRIS", desc: "Scan QR semua e-wallet" },
                { id: "cod", label: "COD (khusus Blora)", desc: "Bayar saat barang diterima" },
              ].map((opt) => (
                <label key={opt.id} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 ${payment === opt.id ? "border-[var(--color-accent-orange)] bg-orange-50" : "border-border"}`}>
                  <input type="radio" name="pay" checked={payment === opt.id} onChange={() => setPayment(opt.id)} className="accent-[var(--color-accent-orange)]" />
                  <div>
                    <div className="font-semibold">{opt.label}</div>
                    <div className="text-xs text-muted-foreground">{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Konfirmasi Pesanan</h2>
              <Info title="Alamat" body={`${address.name} (${address.phone}) — ${address.street}, ${address.district}, ${address.city}, ${address.province} ${address.postalCode}`} />
              <Info title="Pengiriman" body={`${shipping.method.toUpperCase()} · ${formatIDR(shipping.cost)}`} />
              <Info title="Pembayaran" body={payment.toUpperCase()} />
              <div className="space-y-2 rounded-md border border-border p-3">
                {items.map((i) => (
                  <div key={i.productId} className="flex justify-between text-sm">
                    <span>{i.name} × {i.quantity}</span>
                    <span className="font-semibold">{formatIDR(i.price * i.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>Kembali</Button>
            {step < 3 ? (
              <Button className="bg-[var(--color-brand)] text-[var(--color-brand-foreground)]" onClick={() => setStep((s) => s + 1)}>
                Lanjut
              </Button>
            ) : (
              <Button
                className="bg-[var(--color-accent-orange)] text-white hover:bg-[var(--color-accent-orange)]/90"
                onClick={() => { clear(); setDone(true); }}
              >
                Buat Pesanan
              </Button>
            )}
          </div>
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-xl border border-border bg-card p-5 md:sticky md:top-32">
          <h3 className="text-base font-bold">Ringkasan Pesanan</h3>
          <ul className="mt-3 space-y-2">
            {items.map((i) => (
              <li key={i.productId} className="flex gap-2 text-sm">
                <img src={i.image} className="h-12 w-12 rounded object-cover" alt="" />
                <div className="flex-1">
                  <p className="line-clamp-2 text-xs font-medium">{i.name}</p>
                  <p className="text-xs text-muted-foreground">{i.quantity} × {formatIDR(i.price)}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm">
            <Row label="Subtotal" value={formatIDR(subtotal)} />
            <Row label="Ongkir" value={shipping.cost === 0 ? "Gratis" : formatIDR(shipping.cost)} />
            <div className="mt-2 flex justify-between border-t border-border pt-2 text-base font-bold">
              <span>Total</span>
              <span className="text-[var(--color-accent-orange)]">{formatIDR(grandTotal)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function Info({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-md border border-border p-3">
      <p className="text-xs font-semibold uppercase text-muted-foreground">{title}</p>
      <p className="mt-0.5 text-sm">{body}</p>
    </div>
  );
}
