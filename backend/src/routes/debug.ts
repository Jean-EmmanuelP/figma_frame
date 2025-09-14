import { Router } from 'express';

const router = Router();

// Debug endpoint to check session state
router.get('/session', (req, res) => {
  res.json({
    sessionId: req.session?.id,
    hasSession: !!req.session,
    oauthState: req.session?.oauth_state,
    userId: req.session?.userId,
    cookies: req.headers.cookie,
    secure: req.secure,
    protocol: req.protocol,
    headers: {
      'x-forwarded-proto': req.headers['x-forwarded-proto'],
      'x-forwarded-for': req.headers['x-forwarded-for']
    }
  });
});

export default router;