import { useRef, useState } from "react";
import { Upload, Loader2, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSupabaseClient, PRODUCT_PHOTOS_BUCKET } from "@/lib/supabase-client";
import { isAdminLoggedIn } from "@/lib/admin-auth";
import { toast } from "sonner";

interface ProductPhotoUploadProps {
  /** URL foto produk yang sudah ada (Product.images). */
  value: string[];
  /** Dipanggil dengan array URL baru (lama + hasil upload). */
  onChange: (urls: string[]) => void;
  /** Batas jumlah file per upload. */
  maxFiles?: number;
  disabled?: boolean;
}

/**
 * Komponen upload foto produk ke Supabase Storage (bucket "product-photos").
 *
 * - Admin only: jika belum login admin, kembalikan null (tidak render).
 * - Tidak mengubah struktur data/backend lain — hanya menerima value/onChange
 *   seperti field form biasa. Parent yang menyimpan ke Product.images[].
 * - Jika Supabase belum dikonfigurasi (env kosong), tampilkan pesan & blokir.
 */
export function ProductPhotoUpload({
  value,
  onChange,
  maxFiles = 5,
  disabled = false,
}: ProductPhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Admin-only guard
  if (!isAdminLoggedIn()) {
    return null;
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    const client = getSupabaseClient();
    if (!client) {
      toast.error("Supabase belum dikonfigurasi (cek .env).");
      return;
    }

    const fileList = Array.from(files).slice(0, maxFiles);
    setUploading(true);
    const uploaded: string[] = [];

    try {
      for (const file of fileList) {
        const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

        const { error } = await client.storage
          .from(PRODUCT_PHOTOS_BUCKET)
          .upload(path, file, { upsert: false, contentType: file.type });

        if (error) {
          toast.error(`Gagal upload ${file.name}: ${error.message}`);
          continue;
        }

        const { data } = client.storage.from(PRODUCT_PHOTOS_BUCKET).getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }

      if (uploaded.length > 0) {
        onChange([...value, ...uploaded]);
        toast.success(`${uploaded.length} foto berhasil diupload`);
      }
    } catch (e) {
      toast.error("Gagal upload: " + (e instanceof Error ? e.message : "unknown"));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          disabled={disabled || uploading}
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Button
          type="button"
          variant="outline"
          disabled={disabled || uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
          ) : (
            <ImagePlus className="mr-1.5 h-4 w-4" />
          )}
          {uploading ? "Mengupload..." : "Upload Foto"}
        </Button>
        <span className="text-xs text-muted-foreground">
          Maks {maxFiles} file, ke bucket "{PRODUCT_PHOTOS_BUCKET}"
        </span>
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((url, i) => (
            <div
              key={`${url}-${i}`}
              className="relative h-16 w-16 overflow-hidden rounded border border-border"
            >
              <img src={url} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      )}

      <p className="flex items-center gap-1 text-xs text-muted-foreground">
        <Upload className="h-3 w-3" />
        URL publik otomatis disimpan ke field images[] produk.
      </p>
    </div>
  );
}
