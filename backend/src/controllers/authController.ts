import { Request, Response } from 'express';
import crypto from 'crypto';
import axios from 'axios';
import database from '../services/database';
import { FigmaOAuthTokenResponse, FigmaUser } from '../types/auth';

export class AuthController {
  async startOAuth(req: Request, res: Response): Promise<void> {
    const state = crypto.randomUUID();
    req.session.oauth_state = state;

    const params = new URLSearchParams({
      client_id: process.env.FIGMA_CLIENT_ID!,
      redirect_uri: process.env.FIGMA_REDIRECT_URI!,
      scope: 'file_read',
      state,
      response_type: 'code'
    });

    res.redirect(`https://www.figma.com/oauth?${params.toString()}`);
  }

  async oAuthCallback(req: Request, res: Response): Promise<void> {
    try {
      const { code, state } = req.query as { code?: string; state?: string };

      if (!code || !state || state !== req.session.oauth_state) {
        res.status(400).json({ error: 'Invalid OAuth state or missing code' });
        return;
      }

      const tokenResponse = await axios.post('https://api.figma.com/v1/oauth/token', {
        client_id: process.env.FIGMA_CLIENT_ID!,
        client_secret: process.env.FIGMA_CLIENT_SECRET!,
        redirect_uri: process.env.FIGMA_REDIRECT_URI!,
        code,
        grant_type: 'authorization_code'
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      const tokenData: FigmaOAuthTokenResponse = tokenResponse.data;

      const userResponse = await axios.get('https://api.figma.com/v1/me', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      });

      const userData: FigmaUser = userResponse.data;
      const userId = userData.id;

      await database.saveToken(
        userId,
        tokenData.access_token,
        tokenData.refresh_token,
        tokenData.expires_in
      );

      req.session.userId = userId;
      delete req.session.oauth_state;

      res.redirect(process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL || '/' 
        : 'http://localhost:3001'
      );
    } catch (error: any) {
      console.error('OAuth callback error:', error);
      res.status(400).json({ error: 'Token exchange failed' });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    const userId = req.session?.userId;

    try {
      if (userId) {
        await database.deleteToken(userId);
      }
    } catch (error) {
      console.error('Delete token error:', error);
      // Continue with session destruction even if token deletion fails
    }

    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
        res.status(500).json({ error: 'Failed to logout' });
        return;
      }
      
      // Clear the session cookie
      res.clearCookie('connect.sid', { path: '/' });
      res.json({ ok: true });
    });
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userResponse = await axios.get('https://api.figma.com/v1/me', {
        headers: { Authorization: `Bearer ${req.userToken}` }
      });

      res.json(userResponse.data);
    } catch (error: any) {
      console.error('Profile fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  }
}

export default new AuthController();