import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { pool } from '../db';

const PgStore = connectPgSimple(session);

export const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'change-me-in-production',
  resave: false,
  saveUninitialized: false,
  name: 'figma-session',
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  },
  store: process.env.NODE_ENV === 'production' 
    ? new PgStore({
        pool: pool,
        tableName: 'user_sessions'
      })
    : undefined // Use default MemoryStore in development
});