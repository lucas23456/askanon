    -- Create questions table
    CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'answered', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Create admins table
    CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Create initial admin user (password: imadminfrfrfr)
    INSERT INTO admins (username, password_hash)
    VALUES ('admin', 'fe80face0ca5a323fc0d95f52f9a3c9f8a5a8f25cdee88c79fec69c81c6b5bc6') 
    ON CONFLICT (username) DO NOTHING;

    -- Create Row Level Security (RLS) Policies
    ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

    -- Create policy for questions table - anyone can create questions (including unauthenticated users)
    CREATE POLICY "Anyone can create questions" ON questions
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

    -- Create policy for questions table - anyone can read questions
    CREATE POLICY "Anyone can read questions" ON questions
    FOR SELECT TO anon, authenticated
    USING (true);

    -- Create policy for questions table - only authenticated users can update
    CREATE POLICY "Only authenticated users can update questions" ON questions
    FOR UPDATE TO authenticated
    USING (true);

    -- Create policy for questions table - only authenticated users can delete
    CREATE POLICY "Only authenticated users can delete questions" ON questions
    FOR DELETE TO authenticated
    USING (true);

    -- Create policy for admins table - only authenticated users can read
    ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Only authenticated users can read admins" ON admins
    FOR SELECT TO authenticated
    USING (true); 