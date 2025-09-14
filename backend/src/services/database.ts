import Database from 'better-sqlite3';
import { UserToken } from '../types/auth';
import path from 'path';

class DatabaseService {
  private db: Database.Database;

  constructor() {
    const dbPath = process.env.NODE_ENV === 'production' 
      ? './data/tokens.db'
      : path.join(process.cwd(), 'data', 'tokens.db');
    
    this.db = new Database(dbPath);
    this.initTables();
  }

  private initTables() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS user_tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT UNIQUE NOT NULL,
        access_token TEXT NOT NULL,
        refresh_token TEXT,
        expires_at INTEGER NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
      );

      CREATE TABLE IF NOT EXISTS user_teams (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        team_id TEXT NOT NULL,
        team_name TEXT,
        added_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        UNIQUE(user_id, team_id)
      );
    `);
  }

  async saveToken(userId: string, accessToken: string, refreshToken?: string, expiresIn?: number): Promise<void> {
    const expiresAt = expiresIn ? Date.now() + (expiresIn * 1000) : Date.now() + (3600 * 1000);
    
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO user_tokens (user_id, access_token, refresh_token, expires_at)
      VALUES (?, ?, ?, ?)
    `);
    
    stmt.run(userId, accessToken, refreshToken || null, expiresAt);
  }

  async getToken(userId: string): Promise<UserToken | null> {
    const stmt = this.db.prepare(`
      SELECT * FROM user_tokens WHERE user_id = ?
    `);
    
    const row = stmt.get(userId) as any;
    if (!row) return null;

    return {
      id: row.id,
      userId: row.user_id,
      accessToken: row.access_token,
      refreshToken: row.refresh_token,
      expiresAt: row.expires_at,
      createdAt: row.created_at
    };
  }

  async deleteToken(userId: string): Promise<void> {
    const stmt = this.db.prepare(`
      DELETE FROM user_tokens WHERE user_id = ?
    `);
    
    stmt.run(userId);
  }

  async addTeamForUser(userId: string, teamId: string, teamName?: string): Promise<void> {
    const stmt = this.db.prepare(`
      INSERT OR IGNORE INTO user_teams (user_id, team_id, team_name)
      VALUES (?, ?, ?)
    `);
    
    stmt.run(userId, teamId, teamName || null);
  }

  async getTeamsForUser(userId: string): Promise<Array<{ teamId: string; teamName?: string; addedAt: number }>> {
    const stmt = this.db.prepare(`
      SELECT team_id, team_name, added_at FROM user_teams WHERE user_id = ? ORDER BY added_at DESC
    `);
    
    const rows = stmt.all(userId) as any[];
    return rows.map(row => ({
      teamId: row.team_id,
      teamName: row.team_name,
      addedAt: row.added_at
    }));
  }

  close() {
    this.db.close();
  }
}

export default new DatabaseService();