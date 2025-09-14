import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on("error", (err) => {
  console.error("PG pool error:", err);
});

// Graceful shutdown
process.on("SIGTERM", async () => { 
  await pool.end(); 
  process.exit(0); 
});

process.on("SIGINT", async () => { 
  await pool.end(); 
  process.exit(0); 
});

export default pool;