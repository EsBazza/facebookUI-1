
// Prefer an env-configured base (Vite): set VITE_API_BASE to override in development/production
// Behavior:
// - If VITE_API_BASE is set, use it (useful for production builds).
// - In dev (import.meta.env.DEV) default to the relative path '/api/posts' so the Vite
//   dev server can proxy requests and avoid CORS issues.
// - Otherwise (production without VITE_API_BASE) fall back to the hosted API URL.
const base = import.meta.env.VITE_API_BASE
  || (import.meta.env.DEV ? '/api/posts' : 'https://facebookapi-2txh.onrender.com/api/posts');

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
