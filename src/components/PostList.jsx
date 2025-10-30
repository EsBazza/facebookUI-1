import React from 'react';

export default function PostList({ posts = [], onEdit, onDelete }) {
  return (
    <div className="posts">
      {posts.map((post) => (
        <article key={post.id} className="post">
          <div className="post-header">
            <div className="author">{post.author || 'Anonymous'}</div>
            <div className="dates">
              <small>
                Created: {post.createdAt ? new Date(post.createdAt).toLocaleString() : '-'}
              </small>
              <br />
              <small>
                Modified: {post.modifiedAt ? new Date(post.modifiedAt).toLocaleString() : '-'}
              </small>
            </div>
          </div>

          <div className="content">
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
          </div>

          <div className="actions">
            <button onClick={() => onEdit?.(post)}>Edit</button>
            <button className="danger" onClick={() => onDelete?.(post.id)}>
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}