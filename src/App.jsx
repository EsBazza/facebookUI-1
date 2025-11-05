import React, { useEffect, useState } from 'react';
import {
  listPosts,
  createPost,
  updatePost,
  deletePost,
  setBaseUrl
} from './api/posts';

// Set API base at runtime. If your frontend is served from the same origin
// and the backend is reachable under `/api/posts`, this will make requests
// same-origin (avoids CORS). Otherwise this simply sets an explicit URL.
if (typeof window !== 'undefined') {
  const origin = window.location.origin;
  if (origin === 'https://facebookapi-2txh.onrender.com/api/posts') {
    // assume a same-origin proxy exists at /api
    setBaseUrl(origin + '/api/posts');
  } else {
    // explicit hosted API (note: cross-origin requests require the API to allow CORS)
    setBaseUrl('https://facebookapi-2txh.onrender.com/api/posts');
  }
}
import PostList from './components/PostList.jsx';
import PostForm from './components/PostForm.jsx';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null); // post being edited or null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await listPosts();
      // sort by createdAt desc if available
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPosts(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreate = async (payload) => {
    try {
      const saved = await createPost(payload);
      if (!saved || typeof saved !== 'object') {
        setError('Save failed: invalid server response');
        return;
      }
      setPosts(prev => [saved, ...prev]);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Failed to save post');
    }
  };

  const handleUpdate = async (id, payload) => {
    try {
      const saved = await updatePost(id, payload);
      if (!saved || typeof saved !== 'object') {
        setError('Update failed: invalid server response');
        return;
      }
      setPosts(prev => prev.map(p => (p.id === saved.id ? saved : p)));
      setEditing(null);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Failed to update post');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await deletePost(id);
      setPosts(prev => prev.filter(p => p.id !== id));
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Failed to delete post');
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Facebook-like Posts</h1>
      </header>

      <main>
        <section className="form-section">
          <h2>{editing ? 'Edit post' : 'Create a post'}</h2>
          <PostForm
            key={editing ? editing.id : 'new'}
            initial={editing}
            onSubmit={editing ? (payload) => handleUpdate(editing.id, payload) : handleCreate}
            onCancel={() => setEditing(null)}
          />
        </section>

        <section className="list-section">
          <h2>Posts</h2>
          {loading && <p>Loading...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && posts.length === 0 && <p>No posts yet.</p>}
          <PostList
            posts={posts}
            onEdit={(post) => setEditing(post)}
            onDelete={(id) => handleDelete(id)}
          />
        </section>
      </main>

      <footer>
        <small>Amaro Juno Alonzo</small>
      </footer>
    </div>
  );
}