import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MessageCircle, ChevronDown } from "lucide-react";
import { useState } from "react";
import { waLink } from "@/lib/format";

export const Route = createFileRoute("/faq-garansi")({
  head: () => ({
    meta: [
      { title: "FAQ & Garansi Servis · Mubarok SMS&S" },
      {
        name: "description",
        content: "Pertanyaan umum seputar garansi servis HP di Mubarok Gadget Hub Blora.",
      },
    ],
  }),
  component: FAQGaransiPage,
});

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_LIST: FAQItem[] = [
  {
    question: "Berapa lama garansi servis di Mubarok Gadget Hub?",
    answer:
      "Garansi servis berlaku selama 7 hari kalender sejak tanggal pengambilan unit. Garansi mencakup penggantian komponen yang telah diganti selama servis.",
  },
  {
    question: "Apa yang tidak dicakup oleh garansi?",
    answer:
      "Garansi tidak berlaku untuk kerusakan baru akibat jatuh, terkena air, atau penanganan yang tidak sesuai. Garansi juga tidak mencakup kerusakan pada komponen lain yang tidak sedang dalam perbaikan.",
  },
  {
    question: "Bagaimana cara klaim garansi?",
    answer:
      "Bawa unit yang bermasalah beserta nota servis (digital atau cetak) ke toko kami. Tim teknisi akan memeriksa unit dan memproses klaim garansi Anda.",
  },
  {
    question: "Berapa lama estimasi waktu servis?",
    answer:
      "Waktu servis bervariasi tergantung kerusakan:\n- Penggantian LCD/Baterai: 30-60 menit\n- Perbaikan charging port: 1-2 jam\n- Perbaikan IC/motherboard: 1-3 hari\nKami akan menghubungi Anda jika diperlukan waktu lebih lama.",
  },
  {
    question: "Apakah bisa servis tanpa surat/kwitansi?",
    answer:
      "Bisa. Anda cukup menyebutkan nomor tiket servis (format: SRV-XXXXXX) saat mengambil unit. Nomor tiket bisa dicek di halaman Lacak Servis.",
  },
  {
    question: "Apakah ada garansi untuk sparepart?",
    answer:
      "Ya. Sparepart original copotan bergaransi 7 hari. Sparepart compatible bergaransi 3 hari. Garansi berlaku jika sparepart mengalami kerusakan fungsional, bukan kerusakan fisik akibat pemasangan.",
  },
  {
    question: "Bagaimana jika saya tidak puas dengan hasil servis?",
    answer:
      "Silakan hubungi kami via WhatsApp. Kami akan berusaha menyelesaikan masalah dengan baik. Jika unit masih dalam masa garansi, kami akan perbaiki ulang tanpa biaya tambahan.",
  },
  {
    question: "Apakah bisa servis HP merek apapun?",
    answer:
      "Ya, kami melayani servis hampir semua merek HP: Samsung, Xiaomi, Oppo, Vivo, Realme, iPhone, Tecno, Infinix, dan lainnya. Silakan tanya stok sparepart via WhatsApp.",
  },
];

function FAQGaransiPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 flex items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4" /> Kembali
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">FAQ & Garansi Servis</h1>
      </div>

      <p className="mb-6 text-sm text-muted-foreground">
        Berikut adalah pertanyaan yang sering diajukan seputar layanan servis dan garansi di Mubarok
        Gadget Hub.
      </p>

      <div className="space-y-3">
        {FAQ_LIST.map((faq, idx) => (
          <Card key={idx} className="overflow-hidden">
            <button
              className="flex w-full items-center justify-between p-4 text-left transition hover:bg-muted/50"
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            >
              <span className="pr-4 text-sm font-semibold">{faq.question}</span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                  openIndex === idx ? "rotate-180" : ""
                }`}
              />
            </button>
            {openIndex === idx && (
              <CardContent className="border-t border-border px-4 pt-4 pb-4">
                <p className="whitespace-pre-line text-sm text-muted-foreground">{faq.answer}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* CTA */}
      <Card className="mt-8 border-[var(--color-accent-orange)]">
        <CardContent className="flex flex-col items-start gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-bold">Pertanyaan Lainnya?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Hubungi kami via WhatsApp untuk konsultasi langsung.
            </p>
          </div>
          <Button asChild className="bg-green-500 text-white hover:bg-green-600">
            <a
              href={waLink("Halo Mubarok SMS&S, saya punya pertanyaan tentang servis.")}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="mr-2 h-4 w-4" /> Chat WhatsApp
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
