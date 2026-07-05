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
    // Test the database connection
    await pool.query("SELECT 1");
    console.log("✅ PostgreSQL Connected Successfully");

    // Initialize schema
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS listings (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        location VARCHAR(255),
        price NUMERIC,
        total_sqft NUMERIC,
        bath INTEGER,
        bhk INTEGER,
        images TEXT[] DEFAULT '{}',
        amenities TEXT[] DEFAULT '{}',
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_listings_location ON listings(location);
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id UUID PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
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
