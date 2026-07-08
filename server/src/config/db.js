import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";
const { Pool } = pkg;

if (!process.env.DATABASE_URL) {
  console.error("❌ Error: DATABASE_URL environment variable is not defined!");
  console.error("👉 Please ensure you have set the DATABASE_URL environment variable (e.g., in your .env file or Render dashboard).");
  process.exit(1);
}

const isProduction = process.env.NODE_ENV === "production" || 
                     process.env.DATABASE_URL.includes("render.com") || 
                     process.env.DATABASE_URL.includes("supabase") || 
                     process.env.DATABASE_URL.includes("neon");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

const connectDB = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("✅ PostgreSQL Connected Successfully");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'buyer' CHECK (role IN ('admin', 'agent', 'buyer', 'user')),
        phone VARCHAR(50),
        avatar TEXT,
        bio TEXT,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    await pool.query(`ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;`);
    await pool.query(`ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('admin', 'agent', 'buyer', 'user'));`);
    await pool.query(`ALTER TABLE users ALTER COLUMN role SET DEFAULT 'buyer';`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT;`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;`);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS listings (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        description TEXT,
        location VARCHAR(255),
        address TEXT,
        city VARCHAR(120),
        state VARCHAR(120),
        property_type VARCHAR(80) DEFAULT 'Apartment',
        status VARCHAR(80) DEFAULT 'available',
        price NUMERIC,
        total_sqft NUMERIC,
        bath INTEGER,
        bhk INTEGER,
        latitude DOUBLE PRECISION,
        longitude DOUBLE PRECISION,
        agent_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        images TEXT[] DEFAULT '{}',
        amenities TEXT[] DEFAULT '{}',
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    await pool.query(`ALTER TABLE listings ADD COLUMN IF NOT EXISTS description TEXT;`);
    await pool.query(`ALTER TABLE listings ADD COLUMN IF NOT EXISTS address TEXT;`);
    await pool.query(`ALTER TABLE listings ADD COLUMN IF NOT EXISTS city VARCHAR(120);`);
    await pool.query(`ALTER TABLE listings ADD COLUMN IF NOT EXISTS state VARCHAR(120);`);
    await pool.query(`ALTER TABLE listings ADD COLUMN IF NOT EXISTS property_type VARCHAR(80) DEFAULT 'Apartment';`);
    await pool.query(`ALTER TABLE listings ADD COLUMN IF NOT EXISTS status VARCHAR(80) DEFAULT 'available';`);
    await pool.query(`ALTER TABLE listings ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;`);
    await pool.query(`ALTER TABLE listings ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;`);
    await pool.query(`ALTER TABLE listings ADD COLUMN IF NOT EXISTS agent_id INTEGER REFERENCES users(id) ON DELETE SET NULL;`);
    await pool.query(`ALTER TABLE listings ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW();`);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_listings_location ON listings(location);
    `);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(price);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_listings_bhk ON listings(bhk);`);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE(user_id, listing_id)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
        visit_at TIMESTAMP NOT NULL,
        message TEXT,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
        comment TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE(user_id, listing_id)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        body TEXT,
        type VARCHAR(80) DEFAULT 'info',
        read_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token_hash TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        revoked_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_refresh_tokens_hash ON refresh_tokens(token_hash);`);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token_hash TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        used_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_password_reset_hash ON password_reset_tokens(token_hash);`);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id UUID PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY,
        conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
        role VARCHAR(20) NOT NULL CHECK (role IN ('system', 'user', 'assistant')),
        content TEXT NOT NULL,
        model VARCHAR(50),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    console.log("✅ Database Tables Initialized");
  } catch (error) {
    console.error("❌ PostgreSQL Connection/Initialization Failed:", error.message || error);
    process.exit(1);
  }
};

export default connectDB;
export { pool };
