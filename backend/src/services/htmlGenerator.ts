import { FigmaNode, FigmaColor, FigmaFill } from '../types/figma';

export class HtmlGeneratorService {
  private rgb01To255(color: FigmaColor, opacity = 1): string {
    const to255 = (value: number) => Math.round((value ?? 0) * 255);
    return `rgba(${to255(color.r)}, ${to255(color.g)}, ${to255(color.b)}, ${opacity})`;
  }

  private styleFromBoundingBox(box?: { x?: number; y?: number; width?: number; height?: number }): string {
    if (!box) return "";
    const { x = 0, y = 0, width, height } = box;
    return `position:absolute;left:${x}px;top:${y}px;width:${width}px;height:${height}px;`;
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  private nodeToHtml(node: FigmaNode): string {
    const box = node.absoluteBoundingBox;

    if (node.type === "TEXT") {
      const chars = this.escapeHtml(node.characters ?? "");
      const fontSize = node.style?.fontSize ?? 16;
      const lineHeight = node.style?.lineHeightPx ?? 20;
      const fills = node.fills?.[0];
      const color = fills?.type === "SOLID" && fills.color 
        ? this.rgb01To255(fills.color, fills.opacity ?? 1) 
        : "inherit";
      
      const style = `${this.styleFromBoundingBox(box)}white-space:pre-wrap;font-size:${fontSize}px;line-height:${lineHeight}px;color:${color};`;
      return `<div style="${style}">${chars}</div>`;
    }

    if (node.type === "RECTANGLE") {
      const fills = node.fills?.[0];
      const bg = fills?.type === "SOLID" && fills.color 
        ? `background:${this.rgb01To255(fills.color, fills.opacity ?? 1)};` 
        : "";
      const radius = typeof node.cornerRadius === "number" 
        ? `border-radius:${node.cornerRadius}px;` 
        : "";
      
      return `<div style="${this.styleFromBoundingBox(box)}${bg}${radius}"></div>`;
    }

    if (node.type === "ELLIPSE") {
      const fills = node.fills?.[0];
      const bg = fills?.type === "SOLID" && fills.color 
        ? `background:${this.rgb01To255(fills.color, fills.opacity ?? 1)};` 
        : "";
      
      return `<div style="${this.styleFromBoundingBox(box)}border-radius:50%;${bg}"></div>`;
    }

    if (node.type === "FRAME" || node.type === "GROUP" || node.type === "COMPONENT") {
      const style = `position:relative;width:${box?.width}px;height:${box?.height}px;`;
      const children = (node.children ?? []).map(child => this.nodeToHtml(child)).join("");
      return `<div data-figma-id="${node.id}" style="${style}">${children}</div>`;
    }

    const children = (node.children ?? []).map(child => this.nodeToHtml(child)).join("");
    return children;
  }

  generateHtml(frameNode: FigmaNode): string {
    const body = this.nodeToHtml(frameNode);
    const cssReset = `*{box-sizing:border-box;margin:0;padding:0}`;
    
    return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>${cssReset}</style></head><body>${body}</body></html>`;
  }
}

export default new HtmlGeneratorService();