import { Request, Response } from 'express';
import { parseFigmaUrl } from '../utils/figmaUrl';
import figmaApi from '../services/figmaApi';
import htmlGenerator from '../services/htmlGenerator';
import { FramesResponse } from '../types/figma';

export class FramesController {
  async getFrames(req: Request, res: Response): Promise<void> {
    try {
      const url = String(req.query.url || "");
      if (!url) {
        res.status(400).json({ error: "Paramètre url requis" });
        return;
      }

      const { fileKey } = parseFigmaUrl(url);
      const file = await figmaApi.getFile(fileKey);
      const frames = figmaApi.extractFrames(file);

      let images: Record<string, string> = {};
      if (frames.length > 0) {
        const frameIds = frames.map(f => f.id);
        images = await figmaApi.getImageUrls(fileKey, frameIds);
      }

      const response: FramesResponse = {
        fileKey,
        lastModified: file.lastModified,
        frames: frames.map(frame => ({
          ...frame,
          previewUrl: images[frame.id]
        }))
      };

      res.json(response);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message || "Erreur" });
    }
  }

  async getFrame(req: Request, res: Response): Promise<void> {
    try {
      const url = String(req.query.url || "");
      if (!url) {
        res.status(400).json({ error: "Paramètre url requis" });
        return;
      }

      const { fileKey } = parseFigmaUrl(url);
      const frameId = decodeURIComponent(req.params.id);
      
      const { nodes } = await figmaApi.getNodes(fileKey, frameId);
      const node = nodes[frameId]?.document;
      
      if (!node) {
        res.status(404).json({ error: "Frame introuvable" });
        return;
      }

      res.json(node);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message || "Erreur" });
    }
  }

  async getFrameCode(req: Request, res: Response): Promise<void> {
    try {
      const url = String(req.query.url || "");
      if (!url) {
        res.status(400).json({ error: "Paramètre url requis" });
        return;
      }

      const { fileKey } = parseFigmaUrl(url);
      const frameId = decodeURIComponent(req.params.id);
      
      const { nodes } = await figmaApi.getNodes(fileKey, frameId);
      const frameNode = nodes[frameId]?.document;
      
      if (!frameNode) {
        res.status(404).json({ error: "Frame introuvable" });
        return;
      }

      const html = htmlGenerator.generateHtml(frameNode);

      res.json({
        frameId,
        format: "html",
        code: html
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message || "Erreur" });
    }
  }
}

export default new FramesController();