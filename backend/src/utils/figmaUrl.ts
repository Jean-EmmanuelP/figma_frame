import { FigmaUrlData } from '../types/figma.js';

export function parseFigmaUrl(raw: string): FigmaUrlData {
  let url: URL;
  
  try {
    url = new URL(raw);
  } catch {
    throw new Error("URL Figma invalide");
  }

  const match = url.pathname.match(/\/(file|design)\/([A-Za-z0-9]+)\//);
  if (!match) {
    throw new Error("Impossible d'extraire fileKey depuis l'URL");
  }

  const fileKey = match[2];
  const nodeParam = url.searchParams.get("node-id");
  const nodeId = nodeParam ? nodeParam.replace(/-/g, ":") : undefined;

  return { fileKey, nodeId };
}