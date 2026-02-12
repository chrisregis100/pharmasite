-- Create the pharmacies_garde table
CREATE TABLE IF NOT EXISTS pharmacies_garde (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    neighborhood TEXT,
    phone TEXT,
    region TEXT NOT NULL,
    is_24h BOOLEAN DEFAULT FALSE,
    start_date DATE,
    end_date DATE,
    group_name TEXT, -- e.g., 'Groupe B'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE pharmacies_garde ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON pharmacies_garde
    FOR SELECT USING (true);
