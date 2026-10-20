-- =========================================================================
-- Supabase Database Schema for TravelMate AI (AI Adaptive Tourism Companion)
-- =========================================================================
-- Execute this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Trips Table
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    destination TEXT NOT NULL,
    duration_days INT NOT NULL DEFAULT 3,
    budget NUMERIC NOT NULL,
    group_size INT NOT NULL DEFAULT 1,
    traveler_type TEXT NOT NULL DEFAULT 'couple',
    interests TEXT[] DEFAULT ARRAY['culture', 'sightseeing', 'local food'],
    accessibility_requirements TEXT[] DEFAULT ARRAY[]::TEXT[],
    pace_preference TEXT DEFAULT 'moderate',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Itineraries Table
CREATE TABLE IF NOT EXISTS public.itineraries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
    trip_title TEXT NOT NULL,
    destination TEXT NOT NULL,
    duration_days INT NOT NULL,
    total_estimated_cost NUMERIC NOT NULL,
    budget_limit NUMERIC NOT NULL,
    traveler_type TEXT NOT NULL,
    days JSONB NOT NULL DEFAULT '[]'::jsonb,
    eco_score JSONB DEFAULT '{}'::jsonb,
    safety JSONB DEFAULT '{}'::jsonb,
    local_food_recommendations TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Hotel Bookings Table
CREATE TABLE IF NOT EXISTS public.hotel_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_name TEXT NOT NULL,
    destination TEXT NOT NULL,
    room_type TEXT NOT NULL,
    guests_count INT NOT NULL DEFAULT 1,
    price_per_person_inr NUMERIC,
    total_price_inr NUMERIC NOT NULL,
    check_in_date DATE DEFAULT CURRENT_DATE,
    guest_name TEXT,
    guest_email TEXT,
    guest_phone TEXT,
    booking_status TEXT NOT NULL DEFAULT 'confirmed',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Chat Logs & Companion Actions Table
CREATE TABLE IF NOT EXISTS public.chat_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    destination TEXT DEFAULT 'General',
    user_query TEXT NOT NULL,
    assistant_response TEXT NOT NULL,
    action_type TEXT,
    action_payload JSONB,
    language TEXT DEFAULT 'English',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Landmark Vision Scans Table
CREATE TABLE IF NOT EXISTS public.landmark_scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    landmark_name TEXT NOT NULL,
    city TEXT,
    country TEXT,
    confidence_score NUMERIC,
    estimated_entry_fee TEXT,
    wheelchair_accessible BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_trips_destination ON public.trips(destination);
CREATE INDEX IF NOT EXISTS idx_itineraries_destination ON public.itineraries(destination);
CREATE INDEX IF NOT EXISTS idx_hotel_bookings_destination ON public.hotel_bookings(destination);
CREATE INDEX IF NOT EXISTS idx_chat_created_at ON public.chat_interactions(created_at DESC);

-- Enable Row Level Security (RLS) with Public Access policies
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotel_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landmark_scans ENABLE ROW LEVEL SECURITY;

-- Public read/write policies for application access
DO $$
BEGIN
    DROP POLICY IF EXISTS "Allow public full access to trips" ON public.trips;
    CREATE POLICY "Allow public full access to trips" ON public.trips FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow public full access to itineraries" ON public.itineraries;
    CREATE POLICY "Allow public full access to itineraries" ON public.itineraries FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow public full access to hotel_bookings" ON public.hotel_bookings;
    CREATE POLICY "Allow public full access to hotel_bookings" ON public.hotel_bookings FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow public full access to chat_interactions" ON public.chat_interactions;
    CREATE POLICY "Allow public full access to chat_interactions" ON public.chat_interactions FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow public full access to landmark_scans" ON public.landmark_scans;
    CREATE POLICY "Allow public full access to landmark_scans" ON public.landmark_scans FOR ALL USING (true) WITH CHECK (true);
END $$;
