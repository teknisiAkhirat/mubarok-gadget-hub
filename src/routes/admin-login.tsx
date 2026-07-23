import { createFileRoute, useNavigate } from "@tanstack/react-router";
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
  const [mode, setMode] = useState<"login" | "signup">("login");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  const handleSubmit = async () => {
    if (!email || !password) {
      toast.error("Email dan password wajib diisi");
      return;
    }
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/dashboard" });
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success("Akun berhasil dibuat! Silakan login.");
        setMode("login");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-[60vh] place-items-center px-4">
      <Toaster />
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold text-center">
          {mode === "login" ? "Login Admin" : "Daftar Akun Admin"}
        </h1>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button className="w-full" onClick={handleSubmit} disabled={loading}>
          {loading ? "Memproses..." : mode === "login" ? "Login" : "Daftar"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          {mode === "login" ? (
            <span>Belum punya akun?{" "}
              <button onClick={() => setMode("signup")} className="underline">
                Daftar di sini
              </button>
            </span>
          ) : (
            <span>Sudah punya akun?{" "}
              <button onClick={() => setMode("login")} className="underline">
                Login
              </button>
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
