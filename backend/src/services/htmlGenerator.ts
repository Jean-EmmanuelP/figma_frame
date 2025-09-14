import { FigmaNode, FigmaColor, FigmaFill } from '../types/figma';
import figmaApi from './figmaApi';

export class HtmlGeneratorService {
  private rgb01To255(color: FigmaColor, opacity = 1): string {
    const to255 = (value: number) => Math.round((value ?? 0) * 255);
    return `rgba(${to255(color.r)}, ${to255(color.g)}, ${to255(color.b)}, ${opacity})`;
  }

  private borderRadius(node: FigmaNode): string {
    return typeof node.cornerRadius === 'number' ? `border-radius:${node.cornerRadius}px;` : '';
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  private relativeCoordinates(
    box: { x?: number; y?: number; width?: number; height?: number },
    parentOffset: { x: number; y: number }
  ): { x: number; y: number; width: number; height: number } {
    return {
      x: (box?.x ?? 0) - parentOffset.x,
      y: (box?.y ?? 0) - parentOffset.y,
      width: box?.width ?? 0,
      height: box?.height ?? 0
    };
  }


  private nodeToHtml(
    node: FigmaNode,
    parentOffset = { x: node.absoluteBoundingBox?.x ?? 0, y: node.absoluteBoundingBox?.y ?? 0 },
    images: Record<string, string> = {},
    fontFamilies: Set<string> = new Set()
  ): string {
    const box = node.absoluteBoundingBox || { x: 0, y: 0, width: 0, height: 0 };
    const r = this.relativeCoordinates(box, parentOffset);
    const abs = `position:absolute;left:${r.x}px;top:${r.y}px;width:${r.width}px;height:${r.height}px;`;

    if (node.type === "TEXT") {
      const fill = node.fills?.[0];
      const color = fill?.type === "SOLID" && fill.color
        ? this.rgb01To255(fill.color, fill.opacity ?? 1)
        : 'inherit';
      const fontSize = node.style?.fontSize ?? 16;
      const lineHeight = node.style?.lineHeightPx ?? Math.round(fontSize * 1.4);
      
      // Collecter la famille de police
      if (node.style?.fontFamily) {
        fontFamilies.add(node.style.fontFamily);
      }
      
      const fontFamily = node.style?.fontFamily ? `font-family:${node.style.fontFamily}, sans-serif;` : '';
      const fontWeight = node.style?.fontWeight ? `font-weight:${node.style.fontWeight};` : '';
      
      return `<div style="${abs}white-space:pre-wrap;font-size:${fontSize}px;line-height:${lineHeight}px;color:${color};${fontFamily}${fontWeight}">${this.escapeHtml(node.characters ?? '')}</div>`;
    }

    if (node.type === "RECTANGLE") {
      const fill = node.fills?.[0];
      if (fill?.type === "IMAGE") {
        const url = images[node.id];
        const bg = url ? `background-image:url('${url}');background-size:cover;background-position:center;` : '';
        return `<div style="${abs}${bg}${this.borderRadius(node)}"></div>`;
      }
      const color = fill?.type === "SOLID" && fill.color
        ? this.rgb01To255(fill.color, fill.opacity ?? 1)
        : '';
      const background = color ? `background:${color};` : '';
      return `<div style="${abs}${background}${this.borderRadius(node)}"></div>`;
    }

    if (node.type === "ELLIPSE") {
      const fill = node.fills?.[0];
      const color = fill?.type === "SOLID" && fill.color
        ? this.rgb01To255(fill.color, fill.opacity ?? 1)
        : '';
      const background = color ? `background:${color};` : '';
      return `<div style="${abs}border-radius:50%;${background}"></div>`;
    }

    // Conteneurs (FRAME/GROUP/COMPONENT)
    if (["FRAME", "GROUP", "COMPONENT", "COMPONENT_SET", "INSTANCE"].includes(node.type)) {
      const isRoot = parentOffset.x === box.x && parentOffset.y === box.y;
      const style = isRoot 
        ? `position:relative;width:${r.width}px;height:${r.height}px;`
        : `${abs}position:relative;`;
      const newOffset = { x: box.x, y: box.y };
      const kids = (node.children ?? []).map((ch: FigmaNode) => 
        this.nodeToHtml(ch, newOffset, images, fontFamilies)
      ).join('');
      return `<div data-figma-id="${node.id}" style="${style}">${kids}</div>`;
    }

    // Fallback : descendre dans les enfants
    const newOffset = { x: box.x, y: box.y };
    const kids = (node.children ?? []).map((ch: FigmaNode) => 
      this.nodeToHtml(ch, newOffset, images, fontFamilies)
    ).join('');
    return kids;
  }

  private collectImageNodes(node: FigmaNode, imageNodes: string[] = []): string[] {
    if (node.type === "RECTANGLE" && node.fills?.[0]?.type === "IMAGE") {
      imageNodes.push(node.id);
    }
    
    if (node.children) {
      for (const child of node.children) {
        this.collectImageNodes(child, imageNodes);
      }
    }
    
    return imageNodes;
  }

  async generateHtml(frameNode: FigmaNode, fileKey: string, authHeaders?: Record<string, string>): Promise<string> {
    // Collecter les nœuds avec des images
    const imageNodeIds = this.collectImageNodes(frameNode);
    
    // Récupérer les URLs des images depuis l'API Figma
    const images = imageNodeIds.length > 0 
      ? await figmaApi.getImageUrls(fileKey, imageNodeIds, authHeaders, 'png', 2)
      : {};
    
    // Collecter les polices utilisées
    const fontFamilies = new Set<string>();
    
    // Générer le HTML avec les images et polices
    const body = this.nodeToHtml(frameNode, undefined, images, fontFamilies);
    
    // Générer les liens Google Fonts
    const fontLinks = Array.from(fontFamilies)
      .filter(font => font !== 'system-ui' && font !== 'sans-serif')
      .map(font => {
        const fontName = font.replace(/\s+/g, '+');
        return `<link href="https://fonts.googleapis.com/css2?family=${fontName}:wght@400;500;600;700&display=swap" rel="stylesheet">`;
      })
      .join('');
    
    const fontStyle = fontFamilies.size > 0 
      ? `<style>body { font-family: ${Array.from(fontFamilies).join(', ')}, system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }</style>`
      : '';
    
    const cssReset = `*{box-sizing:border-box;margin:0;padding:0}`;
    
    // Script de scale responsive
    const responsiveScript = `
    <script>
      const baseW = ${frameNode.absoluteBoundingBox?.width || 390};
      const baseH = ${frameNode.absoluteBoundingBox?.height || 844};
      function fit() {
        const s = Math.min(innerWidth / baseW, innerHeight / baseH);
        const el = document.getElementById('frame-wrapper');
        if (el) el.style.transform = \`scale(\${s})\`;
      }
      addEventListener('resize', fit);
      addEventListener('load', fit);
    </script>`;
    
    return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">${fontLinks}<style>${cssReset}</style>${fontStyle}</head><body><div id="frame-wrapper" style="transform-origin: top left;">${body}</div>${responsiveScript}</body></html>`;
  }
}

export default new HtmlGeneratorService();