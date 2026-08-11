-- Migration: Create service_tickets table
-- Description: Customer repair tracker module for Mubarok Gadget Hub
-- Date: 2026-07-22

-- Create service_tickets table
CREATE TABLE IF NOT EXISTS service_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number text NOT NULL UNIQUE,
  customer_name text NOT NULL,
  customer_phone text,
  device_model text NOT NULL,
  issue_description text NOT NULL,
  diagnosis text,
  sparepart_cost integer NOT NULL DEFAULT 0,
  service_cost integer NOT NULL DEFAULT 0,
  total_cost integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'Menunggu' CHECK (status IN ('Menunggu', 'Dikerjakan', 'Selesai', 'Gagal')),
  notes text,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE service_tickets ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_service_tickets_ticket_number ON service_tickets(ticket_number);
CREATE INDEX IF NOT EXISTS idx_service_tickets_status ON service_tickets(status);
CREATE INDEX IF NOT EXISTS idx_service_tickets_updated_at ON service_tickets(updated_at DESC);

-- Policies for service_tickets table
-- Public can search/view tickets by ticket number and create new tickets
DROP POLICY IF EXISTS "anon_select_service_tickets" ON service_tickets;
CREATE POLICY "anon_select_service_tickets" ON service_tickets FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_service_tickets" ON service_tickets;
CREATE POLICY "anon_insert_service_tickets" ON service_tickets FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Only admins can update/delete tickets
DROP POLICY IF EXISTS "anon_update_service_tickets" ON service_tickets;
CREATE POLICY "admin_update_service_tickets" ON service_tickets FOR UPDATE
  TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "anon_delete_service_tickets" ON service_tickets;
CREATE POLICY "admin_delete_service_tickets" ON service_tickets FOR DELETE
  TO authenticated USING (public.has_role(auth.uid(), 'admin'));
