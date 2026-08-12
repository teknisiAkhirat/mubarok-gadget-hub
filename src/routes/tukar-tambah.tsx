import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MessageCircle, ArrowRight } from "lucide-react";
import { mockBrands } from "@/lib/mock-data";
import { formatIDR, waLink } from "@/lib/format";

export const Route = createFileRoute("/tukar-tambah")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Tukar Tambah HP · Mubarok SMS&S" },
      {
        name: "description",
        content:
          "Estimasi harga tukar tambah HP bekas kamu. Dapatkan penawaran terbaik di Mubarok Gadget Hub Blora.",
      },
    ],
  }),
  component: TukarTambahPage,
});

type Condition = "mulus" | "normal" | "rusak-ringan" | "rusak-berat";

const CONDITION_OPTIONS: { value: Condition; label: string; multiplier: number }[] = [
  { value: "mulus", label: "Mulus (seperti baru)", multiplier: 0.7 },
  { value: "normal", label: "Normal (ada minor)", multiplier: 0.55 },
  { value: "rusak-ringan", label: "Rusak Ringan (retak/lecet)", multiplier: 0.35 },
  { value: "rusak-berat", label: "Rusak Berat (mati/IC)", multiplier: 0.15 },
];

const BASE_PRICES: Record<string, number> = {
  // Samsung
  "sam-a53": 3800000,
  "sam-a32": 2000000,
  "sam-a22": 1700000,
  "sam-a12": 1400000,
  "sam-m52": 2500000,
  "sam-s20": 3200000,
  "sam-note8": 1200000,
  // Xiaomi
  "xmi-note11": 2000000,
  "xmi-redmi10": 1500000,
  "xmi-redmi9": 1200000,
  "xmi-poco-m3": 1300000,
  // Oppo
  "oppo-a76": 1500000,
  "oppo-a54": 1400000,
  "oppo-a16": 1200000,
  // Vivo
  "vivo-y33s": 1600000,
  "vivo-y21": 1100000,
  "vivo-y20": 1000000,
  // Realme
  "realme-8i": 1800000,
  "realme-c21": 1100000,
  "realme-narzo50": 1400000,
  // iPhone
  "iphone-11": 3500000,
  "iphone-xr": 2800000,
  "iphone-se2020": 2500000,
  // Tecno
  "tecno-spark7": 1000000,
  "tecno-pova2": 1300000,
  // Infinix
  "infinix-note10": 1100000,
  "infinix-hot11": 900000,
};

function TukarTambahPage() {
  const [brandId, setBrandId] = useState("");
  const [modelId, setModelId] = useState("");
  const [condition, setCondition] = useState<Condition>("normal");

  const selectedBrand = mockBrands.find((b) => b.id === brandId);
  const models = selectedBrand?.models ?? [];
  const selectedModel = models.find((m) => m.id === modelId);

  const basePrice = modelId ? (BASE_PRICES[modelId] ?? 1000000) : 0;
  const conditionMultiplier =
    CONDITION_OPTIONS.find((c) => c.value === condition)?.multiplier ?? 0.5;
  const estimatedPrice =
    basePrice > 0 ? Math.round((basePrice * conditionMultiplier) / 10000) * 10000 : 0;

  const waMsg = selectedModel
    ? `Halo Mubarok SMS&S, saya mau tukar-tambah HP:\n\nMerek: ${selectedBrand?.name}\nTipe: ${selectedModel.name}\nKondisi: ${CONDITION_OPTIONS.find((c) => c.value === condition)?.label}\n\nEstimasi harga dari website: ${formatIDR(estimatedPrice)}\n\nApakah masih bisa ditawar? Mohon konfirmasi.`
    : "Halo Mubarok SMS&S, saya mau tukar-tambah HP.";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 flex items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4" /> Kembali
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Tukar Tambah HP</h1>
      </div>

      <p className="mb-6 text-sm text-muted-foreground">
        Pilih merek, tipe, dan kondisi HP kamu untuk mendapatkan estimasi harga tukar-tambah. Harga
        final akan dikonfirmasi via WhatsApp.
      </p>

      <Card className="mb-6">
        <CardContent className="space-y-5 p-5">
          {/* Brand */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Merek HP</label>
            <select
              value={brandId}
              onChange={(e) => {
                setBrandId(e.target.value);
                setModelId("");
              }}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="">Pilih merek...</option>
              {mockBrands
                .filter((b) => b.models.length > 0)
                .map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Model */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Tipe / Model</label>
            <select
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
              disabled={!brandId}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm disabled:opacity-50"
            >
              <option value="">{brandId ? "Pilih tipe..." : "Pilih merek terlebih dahulu"}</option>
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.releaseYear})
                </option>
              ))}
            </select>
          </div>

          {/* Condition */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground">Kondisi HP</label>
            <div className="grid gap-2 sm:grid-cols-2">
              {CONDITION_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setCondition(opt.value)}
                  className={`rounded-md border px-4 py-3 text-left text-sm transition ${
                    condition === opt.value
                      ? "border-[var(--color-accent-orange)] bg-[var(--color-accent-orange)]/10 font-semibold"
                      : "border-border hover:border-[var(--color-accent-orange)]/50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estimation Result */}
      {estimatedPrice > 0 && (
        <Card className="mb-6 border-[var(--color-accent-orange)]">
          <CardContent className="p-5">
            <h3 className="mb-3 font-bold">Estimasi Harga Tukar Tambah</h3>
            <div className="rounded-lg bg-gradient-to-r from-orange-50 to-yellow-50 p-5">
              <p className="text-sm text-muted-foreground">Harga estimasi kasar:</p>
              <p className="text-3xl font-extrabold text-[var(--color-accent-orange)]">
                {formatIDR(estimatedPrice)}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                *Harga final bisa berbeda tergantung kondisi fisik dan kelengkapan. Konfirmasi via
                WhatsApp.
              </p>
            </div>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Button asChild className="bg-green-500 text-white hover:bg-green-600">
                <a href={waLink(waMsg)} target="_blank" rel="noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" /> Konfirmasi via WhatsApp
                </a>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setBrandId("");
                  setModelId("");
                  setCondition("normal");
                }}
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info */}
      <Card>
        <CardContent className="p-5">
          <h3 className="mb-3 font-bold">Bagaimana Prosesnya?</h3>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand)] text-[11px] font-bold text-[var(--color-brand-foreground)]">
                1
              </span>
              <span>Pilih merek, tipe, dan kondisi HP kamu di atas.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand)] text-[11px] font-bold text-[var(--color-brand-foreground)]">
                2
              </span>
              <span>Lihat estimasi harga yang ditampilkan.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand)] text-[11px] font-bold text-[var(--color-brand-foreground)]">
                3
              </span>
              <span>
                Klik "Konfirmasi via WhatsApp" untuk mendapatkan penawaran final dari kami.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand)] text-[11px] font-bold text-[var(--color-brand-foreground)]">
                4
              </span>
              <span>
                Bawa HP kamu ke toko kami di Blora, Jawa Tengah untuk verifikasi dan transaksi.
              </span>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
