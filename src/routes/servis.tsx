import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Camera, CheckCircle2, Loader2, MessageCircle, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { mockBrands } from "@/lib/mock-data";
import { waLink } from "@/lib/format";

export const Route = createFileRoute("/servis")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Servis HP — Ajukan Pemeriksaan · Mubarok Gadget Hub" },
      {
        name: "description",
        content:
          "Kirim keluhan dan biarkan kami memeriksanya terlebih dahulu. Harga dan tindakan perbaikan ditentukan setelah pemeriksaan kondisi perangkat.",
      },
    ],
  }),
  component: ServisPage,
});

const DAMAGE_TYPES = [
  "Layar",
  "Battery",
  "Charging",
  "Kamera",
  "Speaker/Mic",
  "Software",
  "Motherboard/IC",
  "Lainnya",
];

interface FormState {
  nama: string;
  wa: string;
  merek: string;
  model: string;
  keluhan: string;
  jenisKerusakan: string;
  catatan: string;
  files: File[];
}

const EMPTY_FORM: FormState = {
  nama: "",
  wa: "",
  merek: "",
  model: "",
  keluhan: "",
  jenisKerusakan: "",
  catatan: "",
  files: [],
};

function ServisPage() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = (key: keyof FormState, value: string | File[]) =>
    setForm((f) => ({ ...f, [key]: value }));

  function validate(): boolean {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.nama.trim()) e.nama = "Nama wajib diisi.";
    if (!/^(\+?62|08)\d{8,12}$/.test(form.wa.replace(/[\s-]/g, "")))
      e.wa = "Nomor WhatsApp tidak valid (contoh: 081234567890).";
    if (!form.merek) e.merek = "Pilih merek perangkat.";
    if (!form.model.trim()) e.model = "Model perangkat wajib diisi.";
    if (!form.keluhan.trim()) e.keluhan = "Keluhan/kerusakan wajib diisi.";
    if (!form.jenisKerusakan) e.jenisKerusakan = "Pilih jenis kerusakan.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setBusy(true);
    // Simulasi submit — arahkan ke WhatsApp dengan ringkasan keluhan.
    const msg =
      `Halo Mubarok Gadget Hub, saya ingin mengajukan pemeriksaan servis.\n\n` +
      `Nama: ${form.nama}\n` +
      `WhatsApp: ${form.wa}\n` +
      `Perangkat: ${form.merek} ${form.model}\n` +
      `Jenis Kerusakan: ${form.jenisKerusakan}\n` +
      `Keluhan: ${form.keluhan}\n` +
      (form.catatan ? `Catatan: ${form.catatan}\n` : "") +
      (form.files.length
        ? `Foto/video terlampir: ${form.files.length} file (dikirim manual).\n`
        : "") +
      `\nMohon konfirmasi jadwal pemeriksaan.`;
    setTimeout(() => {
      setBusy(false);
      setSubmitted(true);
      window.open(waLink(msg), "_blank");
    }, 600);
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="mt-5 text-2xl font-extrabold">Permintaan Pemeriksaan Terkirim</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Terima kasih, {form.nama}. Kami sudah menerima keluhan Anda dan akan memeriksa perangkat
          setelah dikonfirmasi. Jangan lupa kirim foto/video perangkat via WhatsApp untuk
          mempercepat penilaian.
        </p>
        <p className="mt-4 rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
          <strong>
            Harga dan tindakan perbaikan ditentukan setelah pemeriksaan kondisi perangkat.
          </strong>
        </p>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft className="mr-1 h-4 w-4" /> Kembali ke Beranda
            </Link>
          </Button>
          <Button
            onClick={() => {
              setForm(EMPTY_FORM);
              setSubmitted(false);
            }}
          >
            Ajukan Pemeriksaan Lain
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 flex items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4" /> Kembali
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Servis HP</h1>
      </div>

      <p className="mb-6 text-sm text-muted-foreground">
        HP bermasalah? Kirim keluhan dan biarkan kami memeriksanya terlebih dahulu.{" "}
        <strong>
          Harga dan tindakan perbaikan ditentukan setelah pemeriksaan kondisi perangkat.
        </strong>
      </p>

      <form
        onSubmit={submit}
        className="space-y-5 rounded-xl border border-border bg-card p-5 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="servis-nama">Nama</Label>
            <Input
              id="servis-nama"
              value={form.nama}
              onChange={(e) => update("nama", e.target.value)}
              placeholder="Nama lengkap"
              aria-invalid={!!errors.nama}
            />
            {errors.nama && <p className="text-xs text-red-600">{errors.nama}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="servis-wa">Nomor WhatsApp</Label>
            <Input
              id="servis-wa"
              value={form.wa}
              onChange={(e) => update("wa", e.target.value)}
              placeholder="081234567890"
              inputMode="tel"
              aria-invalid={!!errors.wa}
            />
            {errors.wa && <p className="text-xs text-red-600">{errors.wa}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="servis-merek">Merek</Label>
            <select
              id="servis-merek"
              value={form.merek}
              onChange={(e) => update("merek", e.target.value)}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              aria-invalid={!!errors.merek}
            >
              <option value="">Pilih merek...</option>
              {mockBrands.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
            {errors.merek && <p className="text-xs text-red-600">{errors.merek}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="servis-model">Model</Label>
            <Input
              id="servis-model"
              value={form.model}
              onChange={(e) => update("model", e.target.value)}
              placeholder="Contoh: Galaxy A32 / Redmi Note 11"
              aria-invalid={!!errors.model}
            />
            {errors.model && <p className="text-xs text-red-600">{errors.model}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Jenis Kerusakan</Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {DAMAGE_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => update("jenisKerusakan", t)}
                className={`rounded-md border px-3 py-3 text-sm transition min-h-[44px] ${
                  form.jenisKerusakan === t
                    ? "border-[var(--color-accent-orange)] bg-[var(--color-accent-orange)]/10 font-semibold"
                    : "border-border hover:border-[var(--color-accent-orange)]/50"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          {errors.jenisKerusakan && <p className="text-xs text-red-600">{errors.jenisKerusakan}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="servis-keluhan">Keluhan / Kerusakan</Label>
          <Textarea
            id="servis-keluhan"
            rows={3}
            value={form.keluhan}
            onChange={(e) => update("keluhan", e.target.value)}
            placeholder="Ceritakan masalah pada HP Anda..."
            aria-invalid={!!errors.keluhan}
          />
          {errors.keluhan && <p className="text-xs text-red-600">{errors.keluhan}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="servis-catatan">Catatan (opsional)</Label>
          <Textarea
            id="servis-catatan"
            rows={2}
            value={form.catatan}
            onChange={(e) => update("catatan", e.target.value)}
            placeholder="Riwayat servis, kelengkapan, dll."
          />
        </div>

        <div className="space-y-1.5">
          <Label>Foto / Video Perangkat</Label>
          <div className="flex flex-col gap-2 rounded-md border border-dashed border-border p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-11 min-h-11"
                onClick={() => document.getElementById("servis-upload")?.click()}
              >
                <Camera className="mr-1 h-4 w-4" /> Pilih Foto / Video
              </Button>
              <input
                id="servis-upload"
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  update("files", [...form.files, ...files]);
                  e.target.value = "";
                }}
              />
              <span className="text-xs text-muted-foreground">
                {form.files.length} file dipilih (mock, belum diunggah)
              </span>
            </div>
            {form.files.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {form.files.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs"
                  >
                    <Upload className="h-3 w-3" /> {f.name}
                    <button
                      type="button"
                      onClick={() =>
                        update(
                          "files",
                          form.files.filter((_, j) => j !== i),
                        )
                      }
                      className="text-muted-foreground hover:text-red-600"
                      aria-label={`Hapus ${f.name}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={busy}
          className="h-11 w-full bg-[var(--color-brand)] text-[var(--color-brand-foreground)]"
        >
          {busy ? (
            <>
              <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Mengirim...
            </>
          ) : (
            "Ajukan Pemeriksaan"
          )}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Pengajuan akan dikirim ke WhatsApp toko untuk dikonfirmasi.
        </p>
      </form>
    </div>
  );
}
