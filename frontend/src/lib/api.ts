const BASE = process.env.NEXT_PUBLIC_API_URL!;

export async function fetchFrames(url: string) {
  const r = await fetch(`${BASE}/frames?url=${encodeURIComponent(url)}`, { cache: "no-store" });
  if (!r.ok) throw new Error(`frames failed: ${r.status}`);
  return r.json();
}

export async function fetchFrameNode(url: string, id: string) {
  const r = await fetch(`${BASE}/frames/${encodeURIComponent(id)}?url=${encodeURIComponent(url)}`, { cache: "no-store" });
  if (!r.ok) throw new Error(`frame node failed: ${r.status}`);
  return r.json();
}

export async function fetchFrameHtml(url: string, id: string) {
  const r = await fetch(`${BASE}/frames/${encodeURIComponent(id)}/code?url=${encodeURIComponent(url)}&format=html`, { cache: "no-store" });
  if (!r.ok) throw new Error(`frame code failed: ${r.status}`);
  return r.json();
}