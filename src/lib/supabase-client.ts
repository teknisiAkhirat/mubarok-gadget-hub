import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client (lazy singleton).
 *
 * Hanya butuh env placeholder — TIDAK ADA credential/secret di sini.
 * Value diisi lewat .env (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).
 * Jika env belum dikonfigurasi, getSupabaseClient() mengembalikan null
 * dan caller harus menangani gracefully (tidak crash).
 *
 * CATATAN: file ini TIDAK membuat/mengkoneksi project Supabase asli.
 * Tidak ada network call saat import — hanya saat getSupabaseClient() dipanggil.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** Nama bucket Storage untuk foto produk. */
export const PRODUCT_PHOTOS_BUCKET = "product-photos";

let cachedClient: SupabaseClient | null = null;

/**
 * Kembalikan Supabase client, atau null jika env belum dikonfigurasi.
 * Aman dipanggil berulang (singleton).
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return null;
  }
  if (!cachedClient) {
    cachedClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false },
    });
  }
  return cachedClient;
}

/** True jika env Supabase sudah dikonfigurasi (siap dipakai). */
export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}
