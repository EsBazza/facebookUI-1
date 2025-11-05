
// Prefer an env-configured base (Vite): set VITE_API_BASE to override in development/production
// In dev default to the relative path so the Vite proxy can forward requests and avoid CORS.
// In production default to the hosted API endpoint.
let base = import.meta.env.VITE_API_BASE
  || (import.meta.env.DEV ? '/api/posts' : 'https://facebookapi-2txh.onrender.com/api/posts

export function setBaseUrl(url) {
  if (!url) return;
  base = url.endsWith('/') ? url.slice(0, -1) : url;
} 

async function handleResponse(res) {
  // Read raw text first so we can safely handle empty responses
  const text = await res.text();

  if (!res.ok) {
    let msg = text;
    try {
      const json = JSON.parse(text);
      msg = json.message || JSON.stringify(json);
    } catch {}
    throw new Error(msg || res.statusText);
  }

  // No content
  if (res.status === 204) return null;

  // Empty body (some endpoints return 200 with empty body) — treat as null
  if (!text) return null;

  // Try to parse JSON, fallback to raw text
  try {
    return JSON.parse(text);
  } catch (err) {
    return text;
  }
}

export async function listPosts() {
  const res = await fetch(base);
  const data = await handleResponse(res);
  // ensure callers get an array for list endpoints
  return data || [];
}

export async function getPost(id) {
  const res = await fetch(`${base}/${id}`);
  return handleResponse(res);
}

export async function createPost(payload) {
  const res = await fetch(base, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
}

export async function updatePost(id, payload) {
  const res = await fetch(`${base}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
}

export async function deletePost(id) {
  const res = await fetch(`${base}/${id}`, {
    method: 'DELETE'
  });
  return handleResponse(res);
}
