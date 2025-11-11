import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogPost } from '../services/blogService';
import './BlogPost.css';

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getBlogPost(id);
        setPost(data);
      } catch (error) {
        setError('Post not found or not published');
        console.error('Error fetching blog post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="blog-post-page">
        <div className="container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="blog-post-page">
        <div className="container">
          <p>{error || 'Post not found'}</p>
          <Link to="/blog" className="btn btn-primary">Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-post-page">
      <div className="container">
        <Link to="/blog" className="back-link">← Back to Blog</Link>
        
        <article className="blog-post">
          {post.image && (
            <div className="blog-post-image">
              <img
                src={`http://localhost:5000${post.image}`}
                alt={post.title}
              />
            </div>
          )}
          
          <header className="blog-post-header">
            <h1>{post.title}</h1>
            <div className="blog-post-meta">
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              {post.author && <span>By {post.author}</span>}
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="blog-post-tags">
                {post.tags.map((tag, idx) => (
                  <span key={idx} className="blog-tag">{tag}</span>
                ))}
              </div>
            )}
          </header>

          <div
            className="blog-post-content"
            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
          />
        </article>
      </div>
    </div>
  );
};

export default BlogPost;

