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

// OAuth & Figma API types
export type FigmaFile = {
  key: string;
  name: string;
  thumbnail_url?: string;
  last_modified?: string;
};

export type RecentFile = {
  file_key: string;
  name: string;
  thumbnail_url?: string;
  last_modified?: string;
  team_name?: string;
  project_name?: string;
};

export type FigmaTeam = {
  id: string;
  name: string;
};

export type FigmaProject = {
  id: string;
  name: string;
};

export type TeamProjectsResponse = {
  projects: FigmaProject[];
};

export type ProjectFilesResponse = {
  files: FigmaFile[];
};

export type RecentFilesResponse = {
  files: RecentFile[];
};

export type UserTeamsResponse = {
  teams: FigmaTeam[];
  user: FigmaUser;
};

export type FigmaUser = {
  id: string;
  email: string;
  handle: string;
  img_url: string;
};