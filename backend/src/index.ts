import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index';
import { getPort } from './utils/env';
import { sessionMiddleware } from './middleware/session';
import { migrate } from './migration';

dotenv.config();

const app = express();

// Trust proxy for Render (behind proxy)
app.set('trust proxy', 1);

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || 'https://yourdomain.com']
    : ['http://localhost:3001', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(sessionMiddleware);

app.use('/', routes);

const port = getPort();

// Run migration before starting server
migrate().then(() => {
  app.listen(port, () => {
  console.log(`🚀 Figma Frames API running on http://localhost:${port}`);
  console.log('📋 Available endpoints:');
  console.log('  GET /health - Health check');
  console.log('  GET /auth/figma - Start OAuth flow');
  console.log('  GET /auth/figma/callback - OAuth callback');
  console.log('  GET /me/profile - Get user profile (auth required)');
  console.log('  GET /me/recent-files - Get recent files (auth required)');
  console.log('  GET /me/teams - Get user teams (auth required)');
  console.log('  GET /frames?url=<figma-url> - List frames (optional auth)');
  console.log('  GET /frames/:id?url=<figma-url> - Get frame details (optional auth)');
  console.log('  GET /frames/:id/code?url=<figma-url> - Generate frame HTML (optional auth)');
  });
}).catch(error => {
  console.error("Failed to start server:", error);
  process.exit(1);
});