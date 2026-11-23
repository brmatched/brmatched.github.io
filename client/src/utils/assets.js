const BASE = import.meta.env.BASE_URL || '/';

export function assetUrl(path) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  const cleanBase = BASE.endsWith('/') ? BASE : `${BASE}/`;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${cleanBase}${cleanPath}`;
}
