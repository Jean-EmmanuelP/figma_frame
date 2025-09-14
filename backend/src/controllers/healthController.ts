import { Request, Response } from 'express';

export class HealthController {
  getHealth(_req: Request, res: Response): void {
    res.json({ ok: true, timestamp: new Date().toISOString() });
  }
}

export default new HealthController();