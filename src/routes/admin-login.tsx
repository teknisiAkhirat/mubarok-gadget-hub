import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast, Toaster } from "sonner";

export const Route = createFileRoute("/admin-login")({
  head: () => ({ meta: [{ title: "Login Admin · Mubarok SMS&S" }] }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Login berhasil");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Toaster richColors position="top-center" />
      <h1 className="text-2xl font-extrabold">Login Admin</h1>
      <p className="mt-1 text-sm text-muted-foreground">Masuk untuk mengelola produk dan servis.</p>

      <form onSubmit={submit} className="mt-6 space-y-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground">Email</label>
          <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground">Password</label>
          <Input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--color-brand)] text-[var(--color-brand-foreground)]"
        >
          {loading ? "Memproses..." : "Login"}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <Link to="/" className="text-xs text-muted-foreground hover:underline">← Kembali ke beranda</Link>
      </div>
    </div>
  );
}
