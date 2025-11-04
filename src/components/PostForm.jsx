import React, { useState, useEffect } from 'react';

export default function PostForm({ initial = null, onSubmit, onCancel, submitLabel }) {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  // When editing, initialize fields from initial prop
  useEffect(() => {
    if (initial) {
      setAuthor(initial.author || '');
      setContent(initial.content || '');
      setImageUrl(initial.imageUrl || '');
      setErr(null);
    } else {
      setAuthor('');
      setContent('');
      setImageUrl('');
      setErr(null);
    }
  }, [initial]);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    setSaving(true);
    try {
      const payload = { author, content, imageUrl };
      await onSubmit(payload);
      // Clear only when creating a new post; when editing, parent will close the form
      if (!initial) {
        setAuthor('');
        setContent('');
        setImageUrl('');
      }
      // Optionally notify parent to stop editing after update (parent already handles this)
    } catch (error) {
      console.error(error);
      setErr(error?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="post-form" onSubmit={submit}>
      <label>
        Author
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Your name (optional)"
        />
      </label>

      <label>
        Content
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
        />
      </label>

      <label>
        Image URL
        <input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://..."
        />
      </label>

      {err && <div className="form-error">{err}</div>}

      <div className="form-actions">
        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : (submitLabel ?? (initial ? 'Update' : 'Create'))}
        </button>
        {initial && (
          <button
            type="button"
            className="secondary"
            onClick={() => {
              if (onCancel) onCancel();
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}