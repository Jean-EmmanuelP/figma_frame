export interface UserToken {
  id: number;
  userId: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  createdAt: number;
}

export interface FigmaUser {
  id: string;
  email: string;
  handle: string;
  img_url: string;
}

export interface FigmaOAuthTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

export interface AuthenticatedRequest extends Express.Request {
  userToken?: string;
  userId?: string;
}

declare global {
  namespace Express {
    interface Request {
      userToken?: string;
      userId?: string;
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    oauth_state?: string;
    userId?: string;
  }
}