export const API_BASE = 'http://localhost:5000';
export const API_URL = `${API_BASE}/api`;

export const resolveMediaUrl = (url?: string) => {
  if (!url) return '';
  return url.startsWith('/uploads') ? `${API_BASE}${url}` : url;
};

export async function fetchProjects() {
  const res = await fetch(`${API_URL}/projects`);
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

export async function fetchSiteContent() {
  const res = await fetch(`${API_URL}/content`);
  if (!res.ok) throw new Error('Failed to fetch site content');
  return res.json();
}
