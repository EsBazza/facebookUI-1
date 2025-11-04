import React, { useEffect, useState } from 'react';
import PostList from './components/PostList.jsx';
import PostForm from './components/PostForm.jsx';

// Define the base URL for the API
// Using the facebookapi endpoint per request
const API_BASE_URL = 'https://facebookapi-2txh.onrender.com';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPosts = async () => {
    setLoading(true);
    setError('');
    try {
      // Use the full URL
      const res = await fetch(`${API_BASE_URL}/api/posts`);
      if (!res.ok) throw new Error('Failed to fetch posts');
      const data = await res.json();
      // Sort newest first
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPosts(data);
    } catch (e) {
      setError(e.message || 'Error fetching posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreate = async (post) => {
    // Use the full URL
    const res = await fetch(`${API_BASE_URL}/api/posts`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(post)
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || 'Create failed');
    }
    const saved = await res.json();
    setPosts(prev => [saved, ...prev]);
  };

  const handleUpdate = async (id, updates) => {
    // Use the full URL
    const res = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Update failed');
    const updated = await res.json();
    setPosts(prev => prev.map(p => p.id === updated.id ? updated : p));
    setEditing(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return;
    // Use the full URL
    const res = await fetch(`${API_BASE_URL}/api/posts/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      alert('Failed to delete');
      return;
    }
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Facebook-like Posts</h1>
        <div className="small-muted">Simple Vite + React UI</div>
      </div>

      <div className="card">
        <h3 style={{marginTop:0}}>Create a post</h3>
        <PostForm onSubmit={handleCreate} submitLabel="Post" />
      </div>

      {error && <div className="card" style={{borderLeft:'4px solid #ef4444', color:'#b91c1c'}}>{error}</div>}

      {loading ? (
        <div className="card small-muted">Loading posts...</div>
      ) : (
        <PostList
          posts={posts}
          onEdit={(p) => setEditing(p)}
          onDelete={handleDelete}
        />
      )}

      {editing && (
        <div className="card">
          <h3>Edit post</h3>
          <PostForm
            initial={editing}
            onSubmit={(updates) => handleUpdate(editing.id, updates)}
            onCancel={() => setEditing(null)}
            submitLabel="Save"
          />
        </div>
      )}
    </div>
  );
}