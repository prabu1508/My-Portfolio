import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBlogPosts } from '../services/blogService';
import './Blog.css';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getBlogPosts();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="blog-page">
        <div className="container">
          <p>Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-page">
      <div className="container">
        <h1 className="page-title">Blog</h1>

        {posts.length === 0 ? (
          <p className="no-posts">No blog posts available yet.</p>
        ) : (
          <div className="blog-grid">
            {posts.map(post => (
              <article key={post._id} className="blog-card">
                {post.image && (
                  <div className="blog-image">
                    <img
                      src={`http://localhost:5000${post.image}`}
                      alt={post.title}
                    />
                  </div>
                )}
                <div className="blog-content">
                  <h2>
                    <Link to={`/blog/${post._id}`}>{post.title}</Link>
                  </h2>
                  <p className="blog-excerpt">{post.excerpt || post.content.substring(0, 150) + '...'}</p>
                  <div className="blog-meta">
                    <span className="blog-date">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    {post.tags && post.tags.length > 0 && (
                      <div className="blog-tags">
                        {post.tags.map((tag, idx) => (
                          <span key={idx} className="blog-tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <Link to={`/blog/${post._id}`} className="read-more">
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;

