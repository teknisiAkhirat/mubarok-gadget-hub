import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, MessageCircle, Upload, CheckCircle2 } from "lucide-react";
import { WA_LINK, STORE } from "@/config/constants";

export const Route = createFileRoute("/tukar-tambah")({
  head: () => ({
    meta: [
      { title: "Tukar Tambah HP · Mubarok Gadget Hub" },
      {
        name: "description",
        content:
          "Tukar tambah HP bekas atau rusak di Mubarok Gadget Hub Blora. Dapatkan penawaran harga terbaik.",
      },
    ],
  }),
  component: TradeInPage,
});

type FormState = {
  nama: string;
  whatsapp: string;
  merek: string;
  model: string;
  kondisi: string;
  kerusakan: string;
  catatan: string;
  // Pertanyaan kondisi
  menyala: string;
  layarNormal: string;
  touchscreenNormal: string;
  kerusakanFisik: string;
  pernahDiperbaiki: string;
};

const emptyForm: FormState = {
  nama: "",
  whatsapp: "",
  merek: "",
  model: "",
  kondisi: "",
  kerusakan: "",
  catatan: "",
  menyala: "",
  layarNormal: "",
  touchscreenNormal: "",
  kerusakanFisik: "",
  pernahDiperbaiki: "",
};

const MEREK_OPTIONS = [
  "Samsung",
  "Xiaomi",
  "Oppo",
  "Vivo",
  "Realme",
  "iPhone",
  "Tecno",
  "Infinix",
  "Motorola",
  "Huawei",
  "Lainnya",
];

function TradeInPage() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitted, setSubmitted] = useState(false);

  const set = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleWhatsApp = () => {
    window.open(
      WA_LINK.tradeIn({
        nama: form.nama,
        merek: form.merek,
        model: form.model,
        kondisi: [
          form.menyala && `Menyala: ${form.menyala}`,
          form.layarNormal && `Layar: ${form.layarNormal}`,
          form.touchscreenNormal && `Touchscreen: ${form.touchscreenNormal}`,
          form.kerusakanFisik && `Fisik: ${form.kerusakanFisik}`,
          form.pernahDiperbaiki && `Servis: ${form.pernahDiperbaiki}`,
        ]
          .filter(Boolean)
          .join(", "),
        kerusakan: form.kerusakan,
      }),
      "_blank",
    );
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="rounded-2xl border border-green-200 bg-green-50 p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold">Pengajuan Tercatat!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Langkah selanjutnya, hubungi kami via WhatsApp untuk mendapatkan penawaran harga
            terbaik.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={handleWhatsApp}
              className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-bold text-white shadow-lg hover:bg-green-600"
            >
              <MessageCircle className="h-5 w-5" /> Chat WhatsApp Sekarang
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-6 py-3 font-semibold hover:bg-muted"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Beranda
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">Tukar Tambah</span>
      </nav>

      {/* Hero */}
      <section className="mb-8 rounded-2xl bg-gradient-to-br from-[var(--color-brand)] to-[#0f2440] p-6 text-[var(--color-brand-foreground)] md:p-10">
        <h1 className="text-3xl font-extrabold md:text-4xl">Tukar Tambah HP</h1>
        <p className="mt-3 max-w-xl text-sm opacity-90 md:text-base">
          Punya HP lama atau HP rusak? Tukar tambah di {STORE.name}. Kami terima berbagai kondisi —
          dari normal sampai rusak parah.
        </p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs opacity-80">
          <span>✓ Harga transparan</span>
          <span>✓ Proses cepat</span>
          <span>✓ Terima semua kondisi</span>
        </div>
      </section>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Data Diri */}
        <fieldset className="rounded-xl border border-border bg-card p-5">
          <legend className="px-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Data Diri
          </legend>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">
                Nama Lengkap <span className="text-destructive">*</span>
              </label>
              <input
                required
                type="text"
                value={form.nama}
                onChange={(e) => set("nama", e.target.value)}
                placeholder="Contoh: Ahmad"
                className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">
                Nomor WhatsApp <span className="text-destructive">*</span>
              </label>
              <input
                required
                type="tel"
                value={form.whatsapp}
                onChange={(e) => set("whatsapp", e.target.value)}
                placeholder="08xxxxxxxxxx"
                className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm"
              />
            </div>
          </div>
        </fieldset>

        {/* Perangkat */}
        <fieldset className="rounded-xl border border-border bg-card p-5">
          <legend className="px-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Perangkat
          </legend>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">
                Merek HP <span className="text-destructive">*</span>
              </label>
              <select
                required
                value={form.merek}
                onChange={(e) => set("merek", e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm"
              >
                <option value="">Pilih merek</option>
                {MEREK_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">
                Model <span className="text-destructive">*</span>
              </label>
              <input
                required
                type="text"
                value={form.model}
                onChange={(e) => set("model", e.target.value)}
                placeholder="Contoh: Galaxy M52"
                className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm"
              />
            </div>
          </div>
        </fieldset>

        {/* Kondisi Perangkat */}
        <fieldset className="rounded-xl border border-border bg-card p-5">
          <legend className="px-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Kondisi Perangkat
          </legend>
          <div className="mt-3 space-y-4">
            <RadioQuestion
              label="Apakah HP masih menyala?"
              value={form.menyala}
              onChange={(v) => set("menyala", v)}
              options={["Ya, menyala normal", "Ya, tapi bermasalah", "Tidak menyala"]}
            />
            <RadioQuestion
              label="Apakah layar normal?"
              value={form.layarNormal}
              onChange={(v) => set("layarNormal", v)}
              options={[
                "Normal, tidak ada masalah",
                "Ada gores/retak ringan",
                "Retak parah / pecah",
                "Layar gelap / tidak tampil",
              ]}
            />
            <RadioQuestion
              label="Apakah touchscreen normal?"
              value={form.touchscreenNormal}
              onChange={(v) => set("touchscreenNormal", v)}
              options={[
                "Normal",
                "Tidak responsif di bagian tertentu",
                "Tidak berfungsi sama sekali",
              ]}
            />
            <RadioQuestion
              label="Apakah ada kerusakan fisik?"
              value={form.kerusakanFisik}
              onChange={(v) => set("kerusakanFisik", v)}
              options={[
                "Tidak ada",
                "Lecet/penyok ringan",
                "Penyok / frame bengkok",
                "Pecah / hancur",
              ]}
            />
            <RadioQuestion
              label="Apakah pernah diperbaiki/di.servis?"
              value={form.pernahDiperbaiki}
              onChange={(v) => set("pernahDiperbaiki", v)}
              options={["Belum pernah", "Pernah sekali", "Pernah beberapa kali"]}
            />
          </div>
        </fieldset>

        {/* Kerusakan & Catatan */}
        <fieldset className="rounded-xl border border-border bg-card p-5">
          <legend className="px-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Detail Kerusakan
          </legend>
          <div className="mt-3 space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">
                Jelaskan kerusakan / masalah yang dialami{" "}
                <span className="text-destructive">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={form.kerusakan}
                onChange={(e) => set("kerusakan", e.target.value)}
                placeholder="Contoh: Layar retak di pojok kiri atas, baterai boros, tombol power kadang tidak fungsi"
                className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">
                Catatan Tambahan (opsional)
              </label>
              <textarea
                rows={2}
                value={form.catatan}
                onChange={(e) => set("catatan", e.target.value)}
                placeholder="Kelengkapan (kotak, charger), alasan jual, dll."
                className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm"
              />
            </div>
          </div>
        </fieldset>

        {/* Upload Foto */}
        <div className="rounded-xl border border-dashed border-border bg-card p-5 text-center">
          <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm font-semibold">Foto Perangkat (opsional)</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Upload foto dari beberapa sisi untuk mempercepat penilaian.
            <br />
            Bisa juga kirim langsung via WhatsApp setelah pengajuan.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="rounded-lg bg-muted/50 p-4 text-xs text-muted-foreground">
          <strong className="text-foreground">Catatan:</strong> Penilaian harga dilakukan secara
          manual oleh tim kami setelah memeriksa kondisi perangkat. Harga final akan dikomunikasikan
          via WhatsApp.
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-accent-orange)] px-6 py-3 font-bold text-white shadow-lg hover:scale-[1.01]"
          >
            <MessageCircle className="h-5 w-5" /> Kirim Pengajuan
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-6 py-3 font-semibold hover:bg-muted"
          >
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}

function RadioQuestion({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-foreground">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              value === opt
                ? "border-[var(--color-brand)] bg-[var(--color-brand)] text-[var(--color-brand-foreground)]"
                : "border-border hover:border-[var(--color-brand)]/40 hover:bg-muted"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
