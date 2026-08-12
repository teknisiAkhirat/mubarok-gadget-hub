const AUTH_KEY = "mubarok_admin_auth";

export function isAdminLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(AUTH_KEY) === "true";
}

export function adminLogin(_pin: string): boolean {
  const validPin = import.meta.env.VITE_ADMIN_PIN as string | undefined;
  if (!validPin) {
    // If no PIN configured, deny access (fail-safe)
    return false;
  }
  if (_pin === validPin) {
    sessionStorage.setItem(AUTH_KEY, "true");
    return true;
  }
  return false;
}

export function adminLogout(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(AUTH_KEY);
}
