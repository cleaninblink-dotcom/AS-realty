-- Supabase Database Schema for AS Realty Book Visit Details
-- Project ID: oxjwlzlsjiplexlcxjmf
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/oxjwlzlsjiplexlcxjmf/sql

-- 1. Create table for book visit details
CREATE TABLE IF NOT EXISTS public.book_visits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    property_name TEXT NOT NULL,
    visit_date TEXT NOT NULL,
    visit_time TEXT NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.book_visits ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow any client/visitor (anon or authenticated) to insert site visit requests
CREATE POLICY "Allow public booking submissions" 
ON public.book_visits 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- 4. Policy: Allow reading booked visits
CREATE POLICY "Allow reading site visits" 
ON public.book_visits 
FOR SELECT 
TO anon, authenticated 
USING (true);

-- Optional: Create index on property_name and created_at for fast retrieval
CREATE INDEX IF NOT EXISTS idx_book_visits_property ON public.book_visits(property_name);
CREATE INDEX IF NOT EXISTS idx_book_visits_created_at ON public.book_visits(created_at DESC);
