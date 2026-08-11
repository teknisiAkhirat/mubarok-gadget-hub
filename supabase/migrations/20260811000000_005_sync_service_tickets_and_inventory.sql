-- Migration: Sync service_tickets schema + inventory columns (idempotent)
-- Description: Align live DB with code expectations for Mubarok Gadget Hub
-- Date: 2026-08-11
-- Safe to run multiple times.

-- 1) service_tickets: add missing columns used by the code
ALTER TABLE public.service_tickets
  ADD COLUMN IF NOT EXISTS diagnosis text,
  ADD COLUMN IF NOT EXISTS sparepart_cost integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS service_cost integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_cost integer NOT NULL DEFAULT 0;

-- 2) service_tickets: replace old status CHECK with the statuses used by the code
--    The inline CHECK gets an auto-generated name (usually service_tickets_status_check),
--    so drop any CHECK on the status column before adding the new one.
DO $$
DECLARE
  c record;
BEGIN
  FOR c IN
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'public.service_tickets'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) ILIKE '%status%'
  LOOP
    EXECUTE format('ALTER TABLE public.service_tickets DROP CONSTRAINT %I', c.conname);
  END LOOP;
END $$;

ALTER TABLE public.service_tickets
  ADD CONSTRAINT service_tickets_status_check
  CHECK (status IN ('Menunggu', 'Dikerjakan', 'Selesai', 'Gagal'));

-- 3) products: add inventory columns used by the code
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS cost_price integer,
  ADD COLUMN IF NOT EXISTS imei_or_sn text,
  ADD COLUMN IF NOT EXISTS merk text,
  ADD COLUMN IF NOT EXISTS tipe text,
  ADD COLUMN IF NOT EXISTS sale_status text;

-- 4) Tighten service_tickets RLS: anon keeps SELECT (tracking) + INSERT (create),
--    UPDATE/DELETE now admin-only. Policies from the create migration are dropped
--    first so this is safe on both fresh and existing databases.
DROP POLICY IF EXISTS "anon_update_service_tickets" ON public.service_tickets;
DROP POLICY IF EXISTS "anon_delete_service_tickets" ON public.service_tickets;
DROP POLICY IF EXISTS "admin_update_service_tickets" ON public.service_tickets;
DROP POLICY IF EXISTS "admin_delete_service_tickets" ON public.service_tickets;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'service_tickets' AND policyname = 'admin_update_service_tickets') THEN
    EXECUTE 'CREATE POLICY "admin_update_service_tickets" ON public.service_tickets FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), ''admin'')) WITH CHECK (public.has_role(auth.uid(), ''admin''))';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'service_tickets' AND policyname = 'admin_delete_service_tickets') THEN
    EXECUTE 'CREATE POLICY "admin_delete_service_tickets" ON public.service_tickets FOR DELETE TO authenticated USING (public.has_role(auth.uid(), ''admin''))';
  END IF;
END $$;
