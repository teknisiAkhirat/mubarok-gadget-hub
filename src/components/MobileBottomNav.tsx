import { Link, useMatchRoute } from "@tanstack/react-router";
import { Home, Repeat, Wrench, Package } from "lucide-react";

const items = [
  { to: "/", icon: Home, label: "Beranda" },
  { to: "/tukar-tambah", icon: Repeat, label: "Tukar Tambah" },
  { to: "/servis", icon: Wrench, label: "Servis" },
  { to: "/sparepart", icon: Package, label: "Sparepart" },
] as const;

export function MobileBottomNav() {
  const matchRoute = useMatchRoute();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md md:hidden">
      <div className="grid grid-cols-4">
        {items.map((item) => {
          const active = matchRoute({ to: item.to, fuzzy: item.to === "/" });
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-1 py-2 text-[10px] font-medium transition-colors ${
                active ? "text-[var(--color-brand)]" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
