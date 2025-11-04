import React, { useState } from 'react';

export default function PostList({ posts = [], onEdit, onDelete, onUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({});

  const startEdit = (post) => {
    setEditingId(post.id);
    setDraft({
      content: post.content,
      author: post.author,
      imageUrl: post.imageUrl,
    });
    onEdit?.(post);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({});
  };

  const saveEdit = (post) => {
    const updated = { ...post, ...draft };
    onUpdate?.(updated);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDraft((d) => ({ ...d, [name]: value }));
  };

  return (
    <div className="posts">
      {posts.filter(p => p && typeof p === 'object').map((post) => {
        const isEditing = editingId === post.id;
        return (
          <article key={post.id} className="post">
            <div className="post-header">
              <div className="author">{post.author || 'Anonymous'}</div>
              <div className="dates">
                <small>Created: {post.createdAt ? new Date(post.createdAt).toLocaleString() : '-'}</small>
                <br />
                <small>Modified: {post.modifiedAt ? new Date(post.modifiedAt).toLocaleString() : '-'}</small>
              </div>
            </div>

            <div className="content">
              {isEditing ? (
                <>
                  <textarea
                    name="content"
                    value={draft.content}
                    onChange={handleChange}
                    rows={4}
                    style={{ width: '100%' }}
                  />
                  <input
                    name="author"
                    value={draft.author ?? ''}
                    onChange={handleChange}
                    placeholder="Author"
                    style={{ width: '100%', marginTop: 8 }}
                  />
                  <input
                    name="imageUrl"
                    value={draft.imageUrl ?? ''}
                    onChange={handleChange}
                    placeholder="Image URL"
                    style={{ width: '100%', marginTop: 8 }}
                  />
                </>
              ) : (
                <>
                  <p>{post.content}</p>
                  {post.imageUrl && (
                    <div className="image-wrap">
                      <img
                        src={post.imageUrl}
                        alt="post"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="actions">
              {isEditing ? (
                <>
                  <button onClick={() => saveEdit(post)}>Save</button>
                  <button onClick={cancelEdit}>Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={() => startEdit(post)}>Edit</button>
                  <button className="danger" onClick={() => onDelete?.(post.id)}>
                    Delete
                  </button>
                </>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
