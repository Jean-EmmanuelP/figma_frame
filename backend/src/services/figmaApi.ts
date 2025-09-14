import axios, { AxiosInstance } from 'axios';
import { FigmaFile, FigmaNode, FigmaFrame } from '../types/figma';
import { requireToken } from '../utils/env';

class FigmaApiService {
  private api: AxiosInstance | null = null;
  private token: string | null = null;

  private initialize() {
    if (!this.api) {
      this.token = requireToken();
      this.api = axios.create({
        baseURL: 'https://api.figma.com/v1',
        headers: {
          'X-Figma-Token': this.token
        }
      });
    }
  }

  async getFile(fileKey: string): Promise<FigmaFile> {
    this.initialize();
    const { data } = await this.api!.get(`/files/${fileKey}`);
    return data;
  }

  async getNodes(fileKey: string, nodeIds: string): Promise<{ nodes: Record<string, { document: FigmaNode }> }> {
    this.initialize();
    const { data } = await this.api!.get(`/files/${fileKey}/nodes`, {
      params: { ids: nodeIds }
    });
    return data;
  }

  async getImageUrls(fileKey: string, nodeIds: string[], format = 'png', scale = 2): Promise<Record<string, string>> {
    if (nodeIds.length === 0) return {};
    
    this.initialize();
    const ids = nodeIds.join(',');
    const { data } = await this.api!.get(`/images/${fileKey}`, {
      params: { ids, format, scale }
    });
    
    return data.images || {};
  }

  extractFrames(file: FigmaFile): FigmaFrame[] {
    const frames: FigmaFrame[] = [];

    function walkNodes(node: FigmaNode, pageName = ""): void {
      if (!node) return;

      if (node.type === "CANVAS") {
        for (const child of node.children ?? []) {
          walkNodes(child, node.name);
        }
      } else if (node.type === "FRAME" || node.type === "COMPONENT") {
        const box = node.absoluteBoundingBox;
        frames.push({
          id: node.id,
          name: node.name,
          page: pageName,
          width: box?.width,
          height: box?.height,
        });
        
        for (const child of node.children ?? []) {
          walkNodes(child, pageName);
        }
      } else {
        for (const child of node.children ?? []) {
          walkNodes(child, pageName);
        }
      }
    }

    for (const page of file.document?.children ?? []) {
      walkNodes(page, page.name);
    }

    return frames;
  }
}

export default new FigmaApiService();