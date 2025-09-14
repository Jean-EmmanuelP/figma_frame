const BASE = process.env.NEXT_PUBLIC_API_URL!;

class UnauthenticatedError extends Error {
  constructor() {
    super('User not authenticated');
    this.name = 'UnauthenticatedError';
  }
}

async function apiCall(url: string, options?: RequestInit) {
  console.log('📡 [API] Making request to:', url);
  console.log('🍪 [API] Request options:', { ...options, credentials: 'include', cache: "no-store" });
  
  const response = await fetch(url, {
    ...options,
    credentials: 'include', // Important pour les cookies de session
    cache: "no-store"
  });
  
  console.log('📊 [API] Response status:', response.status);
  console.log('🍪 [API] Response headers:', Object.fromEntries(response.headers.entries()));
  
  if (response.status === 401) {
    console.log('🚫 [API] Unauthorized (401) - throwing UnauthenticatedError');
    throw new UnauthenticatedError();
  }
  
  if (!response.ok) {
    console.log('❌ [API] Request failed with status:', response.status);
    throw new Error(`API call failed: ${response.status}`);
  }
  
  const data = await response.json();
  console.log('✅ [API] Response data:', data);
  return data;
}

// OAuth & Auth endpoints
export async function fetchProfile() {
  return apiCall(`${BASE}/me/profile`);
}

// Sidebar navigation endpoints
export async function fetchUserTeams() {
  return apiCall(`${BASE}/me`);
}

export async function fetchTeamProjects(teamId: string) {
  return apiCall(`${BASE}/teams/${encodeURIComponent(teamId)}/projects`);
}

export async function fetchProjectFiles(projectId: string) {
  const url = `${BASE}/projects/${encodeURIComponent(projectId)}/files`;
  console.log('🚀 [API] fetchProjectFiles - URL:', url);
  console.log('🔑 [API] fetchProjectFiles - projectId:', projectId);
  console.log('🔗 [API] fetchProjectFiles - encoded projectId:', encodeURIComponent(projectId));
  return apiCall(url);
}

// Existing frame endpoints
export async function fetchFrames(url: string) {
  return apiCall(`${BASE}/frames?url=${encodeURIComponent(url)}`);
}

export async function fetchFrameNode(url: string, id: string) {
  return apiCall(`${BASE}/frames/${encodeURIComponent(id)}?url=${encodeURIComponent(url)}`);
}

export async function fetchFrameHtml(url: string, id: string, opts?: {
  fragment?: boolean; 
  includeFonts?: boolean; 
  scale?: number; 
  minify?: boolean;
}) {
  const params = new URLSearchParams({
    url,
    format: "html",
    fragment: String(opts?.fragment ?? true),
    includeFonts: String(opts?.includeFonts ?? true),
    scale: String(opts?.scale ?? 2),
    minify: String(opts?.minify ?? false)
  });
  return apiCall(`${BASE}/frames/${encodeURIComponent(id)}/code?${params}`) as Promise<{ 
    frameId: string; 
    format: "html"; 
    code: string; 
    meta?: { width: number; height: number; }; 
  }>;
}

export { UnauthenticatedError };