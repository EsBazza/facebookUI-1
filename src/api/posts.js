
// Prefer an env-configured base (Vite): set VITE_API_BASE to override in development/production
// In dev default to the relative path so the Vite proxy can forward requests and avoid CORS.
// In production default to the hosted API endpoint.
let base = import.meta.env.VITE_API_BASE
  || (import.meta.env.DEV ? '/api/posts' : 'https://facebookapi-2txh.onrender.com/api/posts');

export function setBaseUrl(url) {
  if (!url) return;
  base = url.endsWith('/') ? url.slice(0, -1) : url;
}

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text();
    let msg = text;
    try {
      const json = JSON.parse(text);
      msg = json.message || JSON.stringify(json);
    } catch {}
    throw new Error(msg || res.statusText);
  }
  return res.status === 204 ? null : res.json();
}

export async function listPosts() {
  const res = await fetch(base);
  return handleResponse(res);
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
