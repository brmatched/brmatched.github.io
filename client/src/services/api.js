import { FALLBACK_RELEASES, STATIC_POSTS } from '../data/staticData';

const TOKEN_KEY = 'brmatched_token';

function detectGitHubRepo() {
  const fromEnv = String(import.meta.env.VITE_GITHUB_REPO || '').trim();
  if (fromEnv && fromEnv.includes('/')) {
    return fromEnv;
  }
  if (typeof window !== 'undefined' && window.location.hostname.endsWith('.github.io')) {
    const owner = window.location.hostname.replace(/\.github\.io$/i, '');
    const firstSegment = window.location.pathname.split('/').filter(Boolean)[0];
    if (owner && firstSegment) {
      return `${owner}/${firstSegment}`;
    }
  }
  return 'leokamikaze02/brmatched';
}

export const GITHUB_REPO = detectGitHubRepo();

export const IS_STATIC_SITE =
  import.meta.env.VITE_STATIC_MODE === 'true' ||
  (typeof window !== 'undefined' && window.location.hostname.endsWith('.github.io'));

export function getGitHubReleasesPageUrl() {
  return GITHUB_REPO ? `https://github.com/${GITHUB_REPO}/releases` : '';
}

export function getGitHubIssuesUrl() {
  return GITHUB_REPO ? `https://github.com/${GITHUB_REPO}/issues` : '';
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

let cachedGithubReleases = null;
let cachedGithubFetchedAt = 0;

function pickPrimaryAsset(assets = []) {
  if (!assets.length) return null;
  const preferred = assets.find((a) => /\.(exe|msi|zip|7z|rar)$/i.test(a.name || ''));
  return preferred || assets[0];
}

function inferChannel(ghRelease) {
  const tag = `${ghRelease.tag_name || ''} ${ghRelease.name || ''}`.toLowerCase();
  if (tag.includes('alpha')) return 'alpha';
  if (ghRelease.prerelease || tag.includes('beta') || tag.includes('rc')) return 'beta';
  return 'stable';
}

async function fetchGitHubReleases() {
  const now = Date.now();
  if (cachedGithubReleases && now - cachedGithubFetchedAt < 60_000) {
    return cachedGithubReleases;
  }

  if (!GITHUB_REPO) {
    return FALLBACK_RELEASES;
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases?per_page=20`, {
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const list = await res.json();
    const published = (Array.isArray(list) ? list : []).filter((r) => !r.draft);

    if (!published.length) {
      const releasesUrl = getGitHubReleasesPageUrl();
      return FALLBACK_RELEASES.map((r) => ({ ...r, external_url: releasesUrl }));
    }

    const mapped = published.map((gh, idx) => {
      const asset = pickPrimaryAsset(gh.assets);
      const totalReleaseDownloads = (gh.assets || []).reduce(
        (sum, a) => sum + (Number(a.download_count) || 0),
        0
      );
      return {
        id: gh.id,
        version: gh.tag_name || `v${idx + 1}`,
        title: gh.name || gh.tag_name || 'Build Windows PC',
        channel: inferChannel(gh),
        platform: 'Windows 10/11 (x64)',
        file_name: asset?.name || `BRMatched-${gh.tag_name || 'Windows'}.exe`,
        file_size: asset?.size || 0,
        sha256: '',
        changelog: (gh.body || 'Nova versão oficial do BRMatched disponível para Windows PC.').trim(),
        download_count: totalReleaseDownloads,
        is_latest: idx === 0 ? 1 : 0,
        external_url: asset?.browser_download_url || gh.html_url || getGitHubReleasesPageUrl(),
        created_at: gh.published_at || gh.created_at || '',
      };
    });

    cachedGithubReleases = mapped;
    cachedGithubFetchedAt = now;
    return mapped;
  } catch {
    const releasesUrl = getGitHubReleasesPageUrl();
    return FALLBACK_RELEASES.map((r) => ({ ...r, external_url: releasesUrl }));
  }
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!(options.body instanceof FormData) && options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(`/api${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Erro na requisição (${res.status})`);
  }
  return data;
}

export const api = {
  getStats: async () => {
    if (IS_STATIC_SITE) {
      const releases = await fetchGitHubReleases();
      const totalDownloads = releases.reduce((sum, r) => sum + (Number(r.download_count) || 0), 0);
      return {
        totalDownloads,
        totalMembers: 0,
        openFeedback: 0,
        latestRelease: releases.find((r) => r.is_latest) || releases[0] || null,
      };
    }
    return request('/stats');
  },

  // Auth
  login: (payload) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  register: (payload) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => request('/auth/me'),
  updateProfile: (payload) =>
    request('/auth/profile', { method: 'PATCH', body: JSON.stringify(payload) }),

  // Releases
  getReleases: async () => {
    if (IS_STATIC_SITE) {
      const releases = await fetchGitHubReleases();
      return { releases };
    }
    return request('/releases');
  },
  uploadRelease: (formData) =>
    request('/releases', { method: 'POST', body: formData }),
  setLatestRelease: (id) =>
    request(`/releases/${id}/latest`, { method: 'PATCH' }),
  deleteRelease: (id) =>
    request(`/releases/${id}`, { method: 'DELETE' }),
  getDownloadUrl: (releaseOrId) => {
    if (IS_STATIC_SITE) {
      if (releaseOrId && typeof releaseOrId === 'object' && releaseOrId.external_url) {
        return releaseOrId.external_url;
      }
      return getGitHubReleasesPageUrl() || '#';
    }
    const id = typeof releaseOrId === 'object' ? releaseOrId.id : releaseOrId;
    return `/api/releases/${id}/download`;
  },

  // Devlog posts
  getPosts: async () => {
    if (IS_STATIC_SITE) {
      return { posts: STATIC_POSTS };
    }
    return request('/posts');
  },
  createPost: (payload) =>
    request('/posts', { method: 'POST', body: JSON.stringify(payload) }),
  deletePost: (id) =>
    request(`/posts/${id}`, { method: 'DELETE' }),

  // Feedback
  getFeedback: () => request('/feedback'),
  createFeedback: (payload) =>
    request('/feedback', { method: 'POST', body: JSON.stringify(payload) }),
  voteFeedback: (id) =>
    request(`/feedback/${id}/vote`, { method: 'POST' }),
  updateFeedbackStatus: (id, status) =>
    request(`/feedback/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};

export function formatBytes(bytes) {
  if (!bytes || bytes <= 0) return 'Windows x64';
  const units = ['B', 'KB', 'MB', 'GB'];
  let idx = 0;
  let value = bytes;
  while (value >= 1024 && idx < units.length - 1) {
    value /= 1024;
    idx++;
  }
  return `${value.toFixed(idx === 0 ? 0 : 1)} ${units[idx]}`;
}

export function formatDateBR(dateStr) {
  if (!dateStr) return '';
  const normalized = dateStr.includes('T') ? dateStr : `${dateStr.replace(' ', 'T')}Z`;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}
