import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Use standard PostgreSQL driver for local database
const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  max: process.env.NODE_ENV === 'production' ? 20 : 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
};

export const pool = new Pool(poolConfig);
export const db = drizzle(pool, { schema });

// Test database connection with retry logic
async function testConnection() {
  let attempts = 0;
  const maxAttempts = 3;
  
  while (attempts < maxAttempts) {
    try {
      const client = await pool.connect();
      console.log('✅ Database connection successful');
      client.release();
      return true;
    } catch (error) {
      attempts++;
      console.log(`❌ Database connection attempt ${attempts} failed:`, (error as Error).message);
      
      if (attempts < maxAttempts) {
        console.log(`🔄 Retrying in ${attempts * 1000}ms...`);
        await new Promise(resolve => setTimeout(resolve, attempts * 1000));
      }
    }
  }
  
  console.error('❌ Failed to connect to database after', maxAttempts, 'attempts');
  return false;
}

// Initialize connection test
testConnection();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await pool.end();
  process.exit(0);
});
