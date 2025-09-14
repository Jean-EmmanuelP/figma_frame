import { Request, Response, NextFunction } from 'express';
import { loadTokens } from '../dao';
import { requireToken } from '../utils/env';

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const sessionUserId = req.session?.userId;
    
    if (!sessionUserId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const tokenData = await loadTokens(sessionUserId);
    
    if (!tokenData) {
      res.status(401).json({ error: 'No valid token found' });
      return;
    }

    // Check if token is expired (PostgreSQL stores in epoch seconds)
    const nowInSeconds = Math.floor(Date.now() / 1000);
    if (tokenData.expires_at < nowInSeconds) {
      // TODO: Implement token refresh logic here
      res.status(401).json({ error: 'Token expired' });
      return;
    }

    req.userToken = tokenData.access_token;
    req.userId = sessionUserId;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
}

export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
  // Try to authenticate, but don't fail if not authenticated
  requireAuth(req, res, (error?: any) => {
    if (error) {
      // If auth fails, continue without authentication (fallback to PAT)
      req.userToken = undefined;
      req.userId = undefined;
    }
    next();
  });
}

export function getAuthHeaders(req: Request): Record<string, string> {
  if (req.userToken) {
    return { Authorization: `Bearer ${req.userToken}` };
  }
  
  // Fallback to PAT for development/testing
  try {
    const pat = requireToken();
    return { 'X-Figma-Token': pat };
  } catch {
    throw new Error('No authentication available');
  }
}