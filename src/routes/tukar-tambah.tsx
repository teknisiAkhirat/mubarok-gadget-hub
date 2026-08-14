import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Camera, CheckCircle2, Loader2, Upload, X } from "lucide-react";
import { mockBrands } from "@/lib/mock-data";
import { waLink } from "@/lib/format";
import { tradeInSchema } from "@/lib/schemas";
import { toast } from "sonner";

export const Route = createFileRoute("/tukar-tambah")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Tukar Tambah HP · Mubarok Gadget Hub" },
      {
        name: "description",
        content:
          "Ajukan tukar tambah HP lama atau rusak. Ceritakan kondisi HP Anda, kirim foto, dan dapatkan penilaian awal dari Mubarok Gadget Hub Blora.",
      },
    ],
  }),
  component: TukarTambahPage,
});

const CONDITION_QUESTIONS = [
  "Apakah HP menyala?",
  "Apakah layar normal?",
  "Apakah touchscreen normal?",
  "Apakah ada kerusakan fisik (retak/penyok)?",
  "Apakah pernah diperbaiki?",
];

interface FormState {
  nama: string;
  wa: string;
  merek: string;
  model: string;
  kondisi: string;
  kerusakan: string;
  catatan: string;
  files: File[];
  answers: Record<string, boolean>;
}

const EMPTY_FORM: FormState = {
  nama: "",
  wa: "",
  merek: "",
  model: "",
  kondisi: "",
  kerusakan: "",
  catatan: "",
  files: [],
  answers: { "0": true, "1": true, "2": true, "3": false, "4": false },
};

function TukarTambahPage() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = (
    key: keyof FormState,
    value: string | boolean | File[] | Record<string, boolean>,
  ) => setForm((f) => ({ ...f, [key]: value }));

  const selectedBrand = mockBrands.find((b) => b.name === form.merek);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);

    const raw: Record<string, unknown> = {
      nama: form.nama,
      wa: form.wa,
      merek: form.merek,
      model: form.model,
      kondisi: form.kondisi,
      kerusakan: form.kerusakan || undefined,
      catatan: form.catatan || undefined,
    };

    const result = tradeInSchema.safeParse(raw);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormState, string>> = {};
      for (const issue of result.error.errors) {
        const path = issue.path[0] as keyof FormState;
        fieldErrors[path] = issue.message;
      }
      setErrors(fieldErrors);
      toast.error("Perbaiki data berikut sebelum mengirim.");
      setBusy(false);
      return;
    }

    const answerText = CONDITION_QUESTIONS.map(
      (q, i) => `${q} ${form.answers[String(i)] ? "Ya" : "Tidak"}`,
    ).join("\n");

    const msg =
      `Halo Mubarok Gadget Hub, saya ingin tukar tambah HP.\n\n` +
      `Nama: ${form.nama}\n` +
      `WhatsApp: ${form.wa}\n` +
      `HP: ${form.merek} ${form.model}\n` +
      `Kondisi: ${form.kondisi}\n` +
      `Kerusakan: ${form.kerusakan || "-"}\n` +
      `\nChecklist kondisi:\n${answerText}\n` +
      (form.catatan ? `\nCatatan: ${form.catatan}` : "") +
      (form.files.length ? `\nFoto terlampir: ${form.files.length} file (dikirim manual).` : "");

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
        <h1 className="mt-5 text-2xl font-extrabold">Pengajuan Tukar Tambah Terkirim</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Terima kasih, {form.nama}. Pengajuan tukar tambah Anda sudah kami terima. Kami akan
          menghubungi Anda via WhatsApp untuk penilaian manual dan konfirmasi.
        </p>
        <p className="mt-4 rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
          Foto di aplikasi masih mock — mohon kirim foto HP via WhatsApp untuk mempercepat
          penilaian.
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
            Ajukan Lagi
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
        <h1 className="text-2xl font-bold">Tukar Tambah HP</h1>
      </div>

      <p className="mb-6 text-sm text-muted-foreground">
        Punya HP lama atau HP rusak? Ceritakan kondisi HP Anda, kirim pengajuan, dan kami akan
        memberikan penilaian awal via WhatsApp.
      </p>

      <form
        onSubmit={submit}
        className="space-y-5 rounded-xl border border-border bg-card p-5 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="tt-nama">Nama</Label>
            <Input
              id="tt-nama"
              value={form.nama}
              onChange={(e) => update("nama", e.target.value)}
              placeholder="Nama lengkap"
              aria-invalid={!!errors.nama}
            />
            {errors.nama && <p className="text-xs text-red-600">{errors.nama}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tt-wa">Nomor WhatsApp</Label>
            <Input
              id="tt-wa"
              value={form.wa}
              onChange={(e) => update("wa", e.target.value)}
              placeholder="081234567890"
              inputMode="tel"
              aria-invalid={!!errors.wa}
            />
            {errors.wa && <p className="text-xs text-red-600">{errors.wa}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tt-merek">Merek HP</Label>
            <select
              id="tt-merek"
              value={form.merek}
              onChange={(e) => {
                update("merek", e.target.value);
                update("model", "");
              }}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              aria-invalid={!!errors.merek}
            >
              <option value="">Pilih merek...</option>
              {mockBrands
                .filter((b) => b.models.length > 0)
                .map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))}
            </select>
            {errors.merek && <p className="text-xs text-red-600">{errors.merek}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tt-model">Tipe / Model</Label>
            <select
              id="tt-model"
              value={form.model}
              onChange={(e) => update("model", e.target.value)}
              disabled={!selectedBrand}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
              aria-invalid={!!errors.model}
            >
              <option value="">
                {selectedBrand ? "Pilih tipe..." : "Pilih merek terlebih dahulu"}
              </option>
              {selectedBrand?.models.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name} ({m.releaseYear})
                </option>
              ))}
            </select>
            {errors.model && <p className="text-xs text-red-600">{errors.model}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Kondisi HP</Label>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { v: "Mulus (seperti baru)", d: "Bodi dan layar mulus" },
              { v: "Normal (ada minor)", d: "Pemakaian wajar, gores halus" },
              { v: "Rusak Ringan", d: "Retak / lecet / fungsi sebagian" },
              { v: "Rusak Berat", d: "Mati / IC / kerusakan besar" },
            ].map((opt) => (
              <button
                key={opt.v}
                type="button"
                onClick={() => update("kondisi", opt.v)}
                className={`rounded-md border px-4 py-3 text-left text-sm transition min-h-[44px] ${
                  form.kondisi === opt.v
                    ? "border-[var(--color-accent-orange)] bg-[var(--color-accent-orange)]/10 font-semibold"
                    : "border-border hover:border-[var(--color-accent-orange)]/50"
                }`}
              >
                <span className="font-semibold">{opt.v}</span>
                <span className="block text-xs text-muted-foreground">{opt.d}</span>
              </button>
            ))}
          </div>
          {errors.kondisi && <p className="text-xs text-red-600">{errors.kondisi}</p>}
        </div>

        <div className="space-y-2">
          <Label>Checklist Kondisi</Label>
          <div className="space-y-2 rounded-md border border-border p-4">
            {CONDITION_QUESTIONS.map((q, i) => (
              <div key={q} className="flex items-center justify-between gap-3">
                <span className="text-sm">{q}</span>
                <div className="flex gap-2">
                  {(["Ya", "Tidak"] as const).map((ans) => (
                    <button
                      key={ans}
                      type="button"
                      onClick={() =>
                        update("answers", { ...form.answers, [String(i)]: ans === "Ya" })
                      }
                      className={`rounded-md border px-3 py-2 text-xs font-medium transition min-h-[44px] ${
                        (form.answers[String(i)] ? "Ya" : "Tidak") === ans
                          ? "border-[var(--color-accent-orange)] bg-[var(--color-accent-orange)]/10"
                          : "border-border"
                      }`}
                    >
                      {ans}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tt-kerusakan">Kerusakan yang diketahui (opsional)</Label>
          <Textarea
            id="tt-kerusakan"
            rows={2}
            value={form.kerusakan}
            onChange={(e) => update("kerusakan", e.target.value)}
            placeholder="Contoh: layar retak, tidak bisa charging"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tt-catatan">Catatan (opsional)</Label>
          <Textarea
            id="tt-catatan"
            rows={2}
            value={form.catatan}
            onChange={(e) => update("catatan", e.target.value)}
            placeholder="Kelengkapan, riwayat servis, dll."
          />
        </div>

        <div className="space-y-1.5">
          <Label>Foto HP</Label>
          <div className="flex flex-col gap-2 rounded-md border border-dashed border-border p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-11 min-h-11"
                onClick={() => document.getElementById("tt-upload")?.click()}
              >
                <Camera className="mr-1 h-4 w-4" /> Pilih Foto
              </Button>
              <input
                id="tt-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  update("files", [...form.files, ...files]);
                  e.target.value = "";
                }}
              />
              <span className="text-xs text-muted-foreground">
                {form.files.length} foto dipilih (mock, belum diunggah)
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
            "Kirim Pengajuan"
          )}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Pengajuan akan dikirim ke WhatsApp toko untuk penilaian manual.
        </p>
      </form>
    </div>
  );
}
