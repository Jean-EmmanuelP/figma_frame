export interface FigmaColor {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface FigmaFill {
  type: string;
  color?: FigmaColor;
  opacity?: number;
}

export interface FigmaBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FigmaTextStyle {
  fontSize?: number;
  lineHeightPx?: number;
  fontFamily?: string;
  fontWeight?: number;
  letterSpacing?: number;
}

export interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
  absoluteBoundingBox?: FigmaBoundingBox;
  fills?: FigmaFill[];
  characters?: string;
  style?: FigmaTextStyle;
  cornerRadius?: number;
}

export interface FigmaFrame {
  id: string;
  name: string;
  page: string;
  width?: number;
  height?: number;
  previewUrl?: string;
}

export interface FigmaFile {
  document: {
    children: FigmaNode[];
  };
  lastModified: string;
}

export interface FigmaUrlData {
  fileKey: string;
  nodeId?: string;
}

export interface FramesResponse {
  fileKey: string;
  lastModified: string;
  frames: FigmaFrame[];
}