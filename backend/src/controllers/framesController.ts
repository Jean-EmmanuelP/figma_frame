import { Request, Response } from 'express';
import { parseFigmaUrl } from '../utils/figmaUrl';
import figmaApi from '../services/figmaApi';
import htmlGenerator from '../services/htmlGenerator';
import { FramesResponse } from '../types/figma';
import { getAuthHeaders } from '../middleware/auth';
import axios from 'axios';

// Helper types
type RGB = { r: number; g: number; b: number; a?: number };
type AbsBox = { x: number; y: number; width: number; height: number };

// Helper functions
function rgba(fill?: any): string | undefined {
  if (!fill || fill.type !== "SOLID") return;
  const c = fill.color ?? {};
  const a = typeof fill.opacity === "number" ? fill.opacity : 1;
  const r = Math.round((c.r ?? 0) * 255);
  const g = Math.round((c.g ?? 0) * 255);
  const b = Math.round((c.b ?? 0) * 255);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function relBox(box?: AbsBox, parent?: AbsBox) {
  const b = box ?? { x: 0, y: 0, width: 0, height: 0 };
  const p = parent ?? { x: 0, y: 0, width: 0, height: 0 };
  return { x: b.x - p.x, y: b.y - p.y, w: b.width, h: b.height };
}

function escHtml(t: string): string {
  return t.replace(/[&<>"]/g, s => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[s]!));
}

function corner(node: any) {
  return typeof node.cornerRadius === "number" ? `border-radius:${node.cornerRadius}px;` : "";
}

function textCSS(node: any) {
  const fs = node?.style?.fontSize ?? 16;
  const lh = node?.style?.lineHeightPx ?? Math.round(fs * 1.4);
  const fill = node?.fills?.find((f: any) => f.type === "SOLID");
  const color = rgba(fill) ?? "rgba(0,0,0,1)";
  const weight = node?.style?.fontWeight;
  const family = node?.style?.fontFamily;
  const letter = typeof node?.style?.letterSpacing === "number" ? `letter-spacing:${node.style.letterSpacing}px;` : "";
  const font = family ? `font-family:${family}, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;` : "";
  const fw = weight ? `font-weight:${weight};` : "";
  return `white-space:pre-wrap;font-size:${fs}px;line-height:${lh}px;color:${color};${fw}${font}${letter}`;
}

function findNodeById(node: any, id: string): any | undefined {
  if (!node) return;
  if (node.id === id) return node;
  for (const ch of node.children ?? []) {
    const f = findNodeById(ch, id);
    if (f) return f;
  }
}

function walk(node: any, visit: (n: any) => void) {
  visit(node);
  for (const ch of node.children ?? []) walk(ch, visit);
}

function renderNode(node: any, parentAbs: AbsBox, imgMap: Record<string, string>): string {
  const abs = node.absoluteBoundingBox as AbsBox | undefined;
  const r = relBox(abs, parentAbs);
  const baseAbs = `position:absolute;left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px;`;

  switch (node.type) {
    case "TEXT": {
      const content = escHtml(node.characters ?? "");
      return `<div style="${baseAbs}${textCSS(node)}">${content}</div>`;
    }

    case "RECTANGLE": {
      const fill = node.fills?.[0];
      if (fill?.type === "IMAGE") {
        const url = imgMap[node.id];
        const bg = url ? `background-image:url('${url}');background-size:cover;background-position:center;` : "";
        return `<div style="${baseAbs}${bg}${corner(node)}"></div>`;
      }
      const bg = rgba(fill);
      return `<div style="${baseAbs}${bg ? `background:${bg};` : ""}${corner(node)}"></div>`;
    }

    case "ELLIPSE": {
      const bg = rgba(node.fills?.[0]);
      return `<div style="${baseAbs}border-radius:50%;${bg ? `background:${bg};` : ""}"></div>`;
    }

    case "LINE":
    case "VECTOR":
      // Simple fallback; rendu vectoriel complet hors scope MVP
      return `<div style="${baseAbs}"></div>`;

    // Conteneurs
    case "FRAME":
    case "GROUP":
    case "COMPONENT":
    case "INSTANCE":
    case "COMPONENT_SET": {
      const style = `position:relative;width:${r.w}px;height:${r.h}px;`;
      const children = (node.children ?? []).map((ch: any) => renderNode(ch, abs!, imgMap)).join("");
      return `<div data-figma-id="${node.id}" style="${style}">${children}</div>`;
    }

    default: {
      // Descendre par défaut si le type est inconnu
      const style = `position:relative;width:${r.w}px;height:${r.h}px;`;
      const children = (node.children ?? []).map((ch: any) => renderNode(ch, abs!, imgMap)).join("");
      return `<div data-figma-id="${node.id}" style="${style}">${children}</div>`;
    }
  }
}

export class FramesController {
  async getFrames(req: Request, res: Response): Promise<void> {
    try {
      const url = String(req.query.url || "");
      if (!url) {
        res.status(400).json({ error: "Paramètre url requis" });
        return;
      }

      const { fileKey } = parseFigmaUrl(url);
      const authHeaders = getAuthHeaders(req);
      const file = await figmaApi.getFile(fileKey, authHeaders);
      const frames = figmaApi.extractFrames(file);

      let images: Record<string, string> = {};
      if (frames.length > 0) {
        const frameIds = frames.map(f => f.id);
        images = await figmaApi.getImageUrls(fileKey, frameIds, authHeaders);
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
      const authHeaders = getAuthHeaders(req);
      
      const { nodes } = await figmaApi.getNodes(fileKey, frameId, authHeaders);
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
      const { id } = req.params;
      const { 
        url, 
        format = "html", 
        includeFonts = "true", 
        scale = "2", 
        fragment = "false", 
        inlinePreview = "false", 
        minify = "false" 
      } = req.query as Record<string, string>;

      if (!url) {
        res.status(400).json({ error: "Missing ?url" });
        return;
      }

      const { fileKey } = parseFigmaUrl(url);
      const authHeaders = getAuthHeaders(req);

      // 1) Récup fichier
      const file = await axios.get(`https://api.figma.com/v1/files/${fileKey}`, { headers: authHeaders }).then(r => r.data);

      // 2) Trouver la frame
      const frame = findNodeById(file.document, id);
      if (!frame) {
        res.status(404).json({ error: `Frame ${id} not found` });
        return;
      }

      // 3) Collecte des nodes images
      const imageNodeIds: string[] = [];
      walk(frame, (n: any) => {
        const fills = n?.fills;
        if (Array.isArray(fills) && fills.some((f: any) => f?.type === "IMAGE")) {
          imageNodeIds.push(n.id);
        }
      });

      // 4) Récup URLs d'images (si besoin)
      let imgMap: Record<string, string> = {};
      if (imageNodeIds.length) {
        const ids = encodeURIComponent([...new Set(imageNodeIds)].join(","));
        const imagesResp = await axios.get(
          `https://api.figma.com/v1/images/${fileKey}?ids=${ids}&format=png&scale=${Number(scale) || 2}`,
          { headers: authHeaders }
        ).then(r => r.data);
        imgMap = imagesResp.images || {};
      }

      // 5) Render HTML
      const abs = frame.absoluteBoundingBox || { x: 0, y: 0, width: 0, height: 0 };
      const body = renderNode(frame, abs, imgMap);

      // 6) Option preview en fond
      const preview = (fragment === "false" && inlinePreview === "true" && frame?.previewUrl)
        ? `<img src="${frame.previewUrl}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.25;pointer-events:none;">`
        : "";

      // 7) Wrap complet
      const fontsLink = (includeFonts !== "false")
        ? `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">`
        : "";

      const full = (fragment === "true")
        ? body
        : `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">${fontsLink}<style>*{box-sizing:border-box;margin:0;padding:0}</style></head><body>${preview}${body}</body></html>`;

      const code = (minify === "true")
        ? full.replace(/\n+/g, "").replace(/\s{2,}/g, " ").trim()
        : full;

      // Extract frame dimensions for metadata
      const frameBox = frame.absoluteBoundingBox || { width: 0, height: 0 };
      
      res.json({ 
        frameId: id, 
        format: "html", 
        code,
        meta: {
          width: frameBox.width,
          height: frameBox.height
        }
      });
    } catch (err: any) {
      console.error("code gen error:", err?.response?.data || err);
      res.status(500).json({ error: "Failed to generate HTML" });
    }
  }
}

export default new FramesController();