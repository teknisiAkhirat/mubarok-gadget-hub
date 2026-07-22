import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast, Toaster } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Login Admin · Mubarok SMS&S" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
      else navigate({ to: "/admin-login" });
    });
  }, [navigate]);

  return (
    <div className="grid min-h-[60vh] place-items-center">
      <p className="text-sm text-muted-foreground">Mengarahkan ke halaman login...</p>
    </div>
  );
}
