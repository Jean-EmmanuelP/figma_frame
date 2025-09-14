import pool from "./db";

/** Crée/MAJ user */
export async function upsertUser(id: string, email?: string | null) {
  await pool.query(
    `INSERT INTO users (id, email) VALUES ($1,$2)
     ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email`,
    [id, email ?? null]
  );
}

/** Enregistre/MAJ tokens */
export async function saveTokens(args: {
  userId: string; 
  accessToken: string; 
  refreshToken?: string | null; 
  expiresAt: number;
}) {
  await pool.query(
    `INSERT INTO oauth_tokens (user_id, access_token, refresh_token, expires_at)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT (user_id) DO UPDATE
       SET access_token = EXCLUDED.access_token,
           refresh_token = COALESCE(EXCLUDED.refresh_token, oauth_tokens.refresh_token),
           expires_at = EXCLUDED.expires_at,
           updated_at = NOW()`,
    [args.userId, args.accessToken, args.refreshToken ?? null, args.expiresAt]
  );
}

export async function loadTokens(userId: string) {
  const { rows } = await pool.query(
    `SELECT user_id, access_token, refresh_token, expires_at FROM oauth_tokens WHERE user_id=$1`,
    [userId]
  );
  return rows[0] as 
    | { user_id: string; access_token: string; refresh_token?: string; expires_at: number } 
    | undefined;
}

export async function deleteTokens(userId: string) {
  await pool.query(`DELETE FROM oauth_tokens WHERE user_id=$1`, [userId]);
}

export async function addTeam(userId: string, teamId: string, label?: string | null) {
  await pool.query(
    `INSERT INTO user_teams (user_id, team_id, label) VALUES ($1,$2,$3)
     ON CONFLICT (user_id, team_id) DO UPDATE SET label = EXCLUDED.label`,
    [userId, teamId, label ?? null]
  );
}

export async function listTeams(userId: string) {
  const { rows } = await pool.query(
    `SELECT team_id AS "teamId", label FROM user_teams WHERE user_id=$1 ORDER BY team_id`,
    [userId]
  );
  return rows as Array<{ teamId: string; label: string | null }>;
}