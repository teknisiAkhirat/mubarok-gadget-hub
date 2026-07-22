import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { MapPin, MessageCircle, Clock, ShieldCheck } from "lucide-react";
import { mockSeller } from "@/lib/mock-data";
import { waLink } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";

export function Footer() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAdmin = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session || !mounted) {
          setIsAdmin(false);
          setAuthChecked(true);
          return;
        }

        const userId = sessionData.session.user.id;
        const { data: roleRow } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId)
          .eq("role", "admin")
          .maybeSingle();

        if (mounted) {
          setIsAdmin(!!roleRow);
          setAuthChecked(true);
        }
      } catch {
        if (mounted) {
          setIsAdmin(false);
          setAuthChecked(true);
        }
      }
    };

    checkAdmin();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      checkAdmin();
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <footer className="mt-16 border-t border-border bg-[var(--color-brand)] text-[var(--color-brand-foreground)]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <h3 className="text-lg font-bold">{mockSeller.storeName}</h3>
          <p className="mt-2 text-sm opacity-80">{mockSeller.description}</p>
          <div className="mt-4 space-y-1.5 text-sm opacity-90">
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {mockSeller.city}</div>
            <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> {mockSeller.operationalHours}</div>
            <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Toko terverifikasi · Respon {mockSeller.responseTime}</div>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Jelajahi</h4>
          <ul className="mt-3 space-y-2 text-sm opacity-80">
            <li><Link to="/produk" className="hover:underline">Semua Produk</Link></li>
            <li><Link to="/produk" search={{ type: "hp-bekas" } as never} className="hover:underline">HP Bekas</Link></li>
            <li><Link to="/produk" search={{ type: "sparepart" } as never} className="hover:underline">Sparepart</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Hubungi Kami</h4>
          <a
            href={waLink("Halo Mubarok SMS&S, saya ingin bertanya.")}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white hover:bg-green-600"
          >
            <MessageCircle className="h-4 w-4" /> Chat WhatsApp
          </a>
          <p className="mt-3 text-xs opacity-70">+{mockSeller.whatsapp}</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs opacity-70">
        © {new Date().getFullYear()} {mockSeller.storeName} · Blora, Jawa Tengah
      </div>
    </footer>
  );
}
