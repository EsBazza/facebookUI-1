import React, { useEffect, useState } from 'react';
import {
  listPosts,
  createPost,
  updatePost,
  deletePost
} from './api/posts';
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
    const saved = await createPost(payload);
    setPosts(prev => [saved, ...prev]);
  };

  const handleUpdate = async (id, payload) => {
    const saved = await updatePost(id, payload);
    setPosts(prev => prev.map(p => (p.id === saved.id ? saved : p)));
    setEditing(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    await deletePost(id);
    setPosts(prev => prev.filter(p => p.id !== id));
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
        <small>Dev UI — Vite + React</small>
      </footer>
    </div>
  );
}