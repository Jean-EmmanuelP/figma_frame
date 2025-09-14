import pool from "./db";

export async function migrate() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS oauth_tokens (
        user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        access_token TEXT NOT NULL,
        refresh_token TEXT,
        expires_at BIGINT NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS user_teams (
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        team_id TEXT NOT NULL,
        label TEXT,
        PRIMARY KEY (user_id, team_id)
      );
    `);
    
    console.log("✅ DB ready");
  } catch (error) {
    console.error("DB migrate error:", error);
    throw error;
  }
}