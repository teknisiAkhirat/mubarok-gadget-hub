import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ChevronRight,
  MessageCircle,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  Search,
} from "lucide-react";
import { WA_LINK, STORE } from "@/config/constants";

export const Route = createFileRoute("/servis")({
  head: () => ({
    meta: [
      { title: "Servis HP · Mubarok Gadget Hub" },
      {
        name: "description",
        content:
          "Servis HP di Blora, Jawa Tengah. Perbaikan semua merek. Harga transparan setelah pemeriksaan.",
      },
    ],
  }),
  component: ServicePage,
});

type FormState = {
  nama: string;
  whatsapp: string;
  merek: string;
  model: string;
  keluhan: string;
  jenisKerusakan: string;
  catatan: string;
};

const emptyForm: FormState = {
  nama: "",
  whatsapp: "",
  merek: "",
  model: "",
  keluhan: "",
  jenisKerusakan: "",
  catatan: "",
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

const JENIS_KERUSAKAN = [
  "Layar / LCD",
  "Baterai",
  "Charging / Konektor",
  "Kamera",
  "Speaker / Microphone",
  "Software / Bootloop",
  "Motherboard / IC",
  "Tombol / Fingerprint",
  "Lainnya",
];

function ServicePage() {
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
      WA_LINK.service({
        nama: form.nama,
        merek: form.merek,
        model: form.model,
        keluhan: `[${form.jenisKerusakan}] ${form.keluhan}`,
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
          <h1 className="mt-4 text-2xl font-extrabold">Permintaan Servis Tercatat!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Selanjutnya, hubungi kami via WhatsApp untuk menjadwalkan pemeriksaan.
          </p>
          <div className="mt-4 rounded-lg bg-orange-50 p-3 text-xs text-orange-800">
            <AlertTriangle className="mr-1 inline h-4 w-4" />
            Harga dan tindakan perbaikan ditentukan setelah pemeriksaan kondisi perangkat.
          </div>
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
        <span className="text-foreground">Servis HP</span>
      </nav>

      {/* Hero */}
      <section className="mb-8 rounded-2xl bg-gradient-to-br from-[var(--color-brand)] to-[#0f2440] p-6 text-[var(--color-brand-foreground)] md:p-10">
        <div className="flex items-start gap-3">
          <Wrench className="mt-1 h-6 w-6 shrink-0 text-[var(--color-accent-orange)]" />
          <div>
            <h1 className="text-3xl font-extrabold md:text-4xl">Servis HP</h1>
            <p className="mt-3 max-w-xl text-sm opacity-90 md:text-base">
              Kirim keluhan Anda, biarkan kami memeriksanya terlebih dahulu. Harga dan tindakan
              perbaikan ditentukan setelah pemeriksaan.
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs opacity-80">
          <span>✓ Semua merek</span>
          <span>✓ Harga transparan</span>
          <span>✓ Garansi servis</span>
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
                Model / Tipe <span className="text-destructive">*</span>
              </label>
              <input
                required
                type="text"
                value={form.model}
                onChange={(e) => set("model", e.target.value)}
                placeholder="Contoh: Galaxy A53"
                className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm"
              />
            </div>
          </div>
        </fieldset>

        {/* Kerusakan */}
        <fieldset className="rounded-xl border border-border bg-card p-5">
          <legend className="px-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Kerusakan
          </legend>
          <div className="mt-3 space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">
                Jenis Kerusakan <span className="text-destructive">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {JENIS_KERUSAKAN.map((j) => (
                  <button
                    key={j}
                    type="button"
                    onClick={() => set("jenisKerusakan", j)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      form.jenisKerusakan === j
                        ? "border-[var(--color-brand)] bg-[var(--color-brand)] text-[var(--color-brand-foreground)]"
                        : "border-border hover:border-[var(--color-brand)]/40 hover:bg-muted"
                    }`}
                  >
                    {j}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">
                Jelaskan Keluhan <span className="text-destructive">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={form.keluhan}
                onChange={(e) => set("keluhan", e.target.value)}
                placeholder="Contoh: HP tiba-tiba mati, layar berkedip-kedip sebelum mati, sudah coba charge tapi tidak merespon"
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
                placeholder="Riwayat servis sebelumnya, hal lain yang perlu diketahui teknisi"
                className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm"
              />
            </div>
          </div>
        </fieldset>

        {/* Info Box */}
        <div className="flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4 text-sm text-orange-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            <strong>
              Harga dan tindakan perbaikan ditentukan setelah pemeriksaan kondisi perangkat.
            </strong>{" "}
            Kami akan menginformasikan estimasi biaya setelah teknisi memeriksa unit Anda.
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-accent-orange)] px-6 py-3 font-bold text-white shadow-lg hover:scale-[1.01]"
          >
            <MessageCircle className="h-5 w-5" /> Ajukan Pemeriksaan
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-6 py-3 font-semibold hover:bg-muted"
          >
            Batal
          </Link>
        </div>
      </form>

      {/* Proses Servis */}
      <section className="mt-12">
        <h2 className="mb-6 text-center text-2xl font-bold">Proses Servis</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              step: "1",
              title: "Kirim Keluhan",
              desc: "Isi form dengan keluhan dan foto perangkat Anda.",
            },
            {
              step: "2",
              title: "Pemeriksaan",
              desc: "Teknisi memeriksa kondisi perangkat secara menyeluruh.",
            },
            {
              step: "3",
              title: "Penjelasan & Persetujuan",
              desc: "Kami informasikan masalah dan biaya. Anda setuju, baru dikerjakan.",
            },
            {
              step: "4",
              title: "Perbaikan & Garansi",
              desc: "Perangkat diperbaiki dan mendapat garansi servis.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-xl border border-border bg-card p-5 text-center"
            >
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-brand)] text-sm font-bold text-[var(--color-brand-foreground)]">
                {item.step}
              </div>
              <h3 className="mt-3 font-bold">{item.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
