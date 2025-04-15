-- Create songs table
CREATE TABLE songs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    artist TEXT,
    bpm INTEGER,
    key TEXT,
    genre TEXT,
    youtubeUrl TEXT,
    lyrics TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create setlists table
CREATE TABLE setlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create setlist_songs junction table
CREATE TABLE setlist_songs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setlist_id UUID REFERENCES setlists(id) ON DELETE CASCADE,
    song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
    order_number INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(setlist_id, song_id)
);

-- Create indexes
CREATE INDEX idx_songs_title ON songs(title);
CREATE INDEX idx_setlists_date ON setlists(date);
CREATE INDEX idx_setlist_songs_order ON setlist_songs(order_number);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_songs_updated_at
    BEFORE UPDATE ON songs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_setlists_updated_at
    BEFORE UPDATE ON setlists
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE setlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE setlist_songs ENABLE ROW LEVEL SECURITY;

-- Create policies for songs
CREATE POLICY "Allow public read access to songs"
    ON songs FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow authenticated users to create songs"
    ON songs FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update their songs"
    ON songs FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete their songs"
    ON songs FOR DELETE
    TO authenticated
    USING (true);

-- Create policies for setlists
CREATE POLICY "Allow public read access to setlists"
    ON setlists FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow authenticated users to create setlists"
    ON setlists FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update their setlists"
    ON setlists FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete their setlists"
    ON setlists FOR DELETE
    TO authenticated
    USING (true);

-- Create policies for setlist_songs
CREATE POLICY "Allow public read access to setlist_songs"
    ON setlist_songs FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow authenticated users to manage setlist_songs"
    ON setlist_songs FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true); 