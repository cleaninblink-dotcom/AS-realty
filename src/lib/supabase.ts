import { createClient } from '@supabase/supabase-js';

// Supabase Project Configuration provided by user
export const SUPABASE_PROJECT_ID = 'oxjwlzlsjiplexlcxjmf';
export const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || `https://${SUPABASE_PROJECT_ID}.supabase.co`;
export const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_8pwi6e9hpGgqZUsUkRxTYw_UrrMsEh2';

// Create Supabase Client instance
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface BookVisitInput {
  fullName: string;
  phone: string;
  email?: string;
  propertyName: string;
  visitDate: string;
  visitTime: string;
  notes?: string;
}

export interface BookVisitRecord {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  propertyName: string;
  visitDate: string;
  visitTime: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  source?: 'supabase' | 'local_backup';
}

const LOCAL_STORAGE_KEY = 'asrealty_book_visits';

// Read locally saved bookings (fallback / backup store)
export function getLocalBookings(): BookVisitRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read local bookings:', err);
    return [];
  }
}

// Save booking to local storage backup
function saveLocalBooking(record: BookVisitRecord) {
  try {
    const existing = getLocalBookings();
    const updated = [record, ...existing.filter((b) => b.id !== record.id)];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to write local booking:', err);
  }
}

/**
 * Save a site visit booking to the Supabase database.
 * Attempts standard table 'book_visits' first, and falls back to alternate table names if needed.
 * Also persists locally to ensure no customer lead is ever lost.
 */
export async function saveBookVisit(input: BookVisitInput): Promise<{
  success: boolean;
  data: BookVisitRecord;
  syncedToDatabase: boolean;
  error?: string;
  tableNameUsed?: string;
}> {
  const generatedId = `ASR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const nowIso = new Date().toISOString();

  const record: BookVisitRecord = {
    id: generatedId,
    fullName: input.fullName.trim(),
    phone: input.phone.trim(),
    email: input.email?.trim() || '',
    propertyName: input.propertyName,
    visitDate: input.visitDate,
    visitTime: input.visitTime,
    notes: input.notes?.trim() || '',
    status: 'pending',
    createdAt: nowIso,
    source: 'local_backup',
  };

  // Always save backup to local storage first
  saveLocalBooking(record);

  // Candidate tables in order of preference
  const candidateTables = [
    'book_visits',
    'book_visit_details',
    'visit_details',
    'site_visits',
    'visits',
    'bookings',
  ];

  let synced = false;
  let usedTable = '';
  let lastErrorMessage = '';

  for (const table of candidateTables) {
    try {
      // Standard database payload
      const dbPayload = {
        full_name: record.fullName,
        phone: record.phone,
        email: record.email || null,
        property_name: record.propertyName,
        visit_date: record.visitDate,
        visit_time: record.visitTime,
        notes: record.notes || null,
        status: record.status,
      };

      const { data, error } = await supabase
        .from(table)
        .insert([dbPayload])
        .select()
        .single();

      if (!error && data) {
        synced = true;
        usedTable = table;
        record.id = data.id ? String(data.id) : record.id;
        record.source = 'supabase';
        saveLocalBooking(record);
        break;
      } else if (error) {
        lastErrorMessage = error.message;
        // If error is NOT "table not found", log and stop trying different table names
        if (error.code !== 'PGRST205') {
          console.warn(`Supabase insert to '${table}' error:`, error);
        }
      }
    } catch (err: any) {
      lastErrorMessage = err?.message || 'Network error';
    }
  }

  return {
    success: true,
    data: record,
    syncedToDatabase: synced,
    tableNameUsed: usedTable,
    error: synced ? undefined : lastErrorMessage || 'Table pending initialization in Supabase SQL editor',
  };
}

/**
 * Fetch all booked visits. Queries Supabase database, and merges with local backup.
 */
export async function getBookVisits(): Promise<{
  data: BookVisitRecord[];
  fromDatabase: boolean;
}> {
  const localList = getLocalBookings();

  try {
    const { data, error } = await supabase
      .from('book_visits')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data) && data.length > 0) {
      const dbRecords: BookVisitRecord[] = data.map((row: any) => ({
        id: String(row.id || row.full_name),
        fullName: row.full_name || row.name || 'Anonymous Client',
        phone: row.phone || row.phone_number || 'N/A',
        email: row.email || '',
        propertyName: row.property_name || row.property || 'Luxury Property',
        visitDate: row.visit_date || row.date || '',
        visitTime: row.visit_time || row.time || '',
        notes: row.notes || row.message || '',
        status: row.status || 'pending',
        createdAt: row.created_at || new Date().toISOString(),
        source: 'supabase',
      }));

      // Merge avoiding duplicates
      const seenIds = new Set(dbRecords.map((r) => r.id));
      const merged = [
        ...dbRecords,
        ...localList.filter((l) => !seenIds.has(l.id)),
      ];

      return { data: merged, fromDatabase: true };
    }
  } catch (err) {
    console.warn('Could not fetch from Supabase database table, returning local backups:', err);
  }

  return { data: localList, fromDatabase: false };
}

/**
 * SQL Schema definition to help the user set up the table in Supabase SQL editor if needed.
 */
export const SUPABASE_SQL_SETUP = `-- Run this in your Supabase SQL Editor (Project ID: oxjwlzlsjiplexlcxjmf)
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

-- Enable Row Level Security
ALTER TABLE public.book_visits ENABLE ROW LEVEL SECURITY;

-- Allow anonymous visitors to insert booking details
CREATE POLICY "Allow anonymous booking submissions" 
ON public.book_visits 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Allow reading bookings
CREATE POLICY "Allow public read bookings" 
ON public.book_visits 
FOR SELECT 
TO anon, authenticated 
USING (true);
`;
