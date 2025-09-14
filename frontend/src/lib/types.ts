export type FrameSummary = {
  id: string;          // ex: "1:5"
  name: string;        // ex: 'MacBook Pro 14" - 1'
  page: string;        // ex: "Page 1"
  width?: number;
  height?: number;
  previewUrl?: string; // URL PNG signée (peut manquer)
};

export type FramesResponse = {
  fileKey: string;      // ex: "0WsMTA8BmYHCNOqL6G1GGQ"
  lastModified: string; // ISO datetime
  frames: FrameSummary[];
};

export type CodeResponse = {
  frameId: string;      // ex: "1:5"
  format: "html";
  code: string;         // <!doctype html>...
};

export type ErrorResponse = { 
  error: string 
};