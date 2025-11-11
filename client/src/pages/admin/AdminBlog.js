import React, { useState, useEffect } from 'react';
import { getAllBlogPosts, deleteBlogPost, createBlogPost, updateBlogPost } from '../../services/blogService';
import './AdminBlog.css';

const AdminBlog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    tags: '',
    published: false,
    image: null
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await getAllBlogPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const postData = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      };

      if (editingPost) {
        await updateBlogPost(editingPost._id, postData);
      } else {
        await createBlogPost(postData);
      }

      resetForm();
      fetchPosts();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving blog post');
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || '',
      tags: post.tags?.join(', ') || '',
      published: post.published || false,
      image: null
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await deleteBlogPost(id);
        fetchPosts();
      } catch (error) {
        alert('Error deleting blog post');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      tags: '',
      published: false,
      image: null
    });
    setEditingPost(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="admin-blog">
        <div className="container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-blog">
      <div className="container">
        <h1 className="page-title">Manage Blog Posts</h1>

        <div className="login-card blog-card">
          <div className="card-side card-side--brand">
            <div className="brand-inner">
              <div className="avatar" style={{width:72,height:72,borderRadius:12,marginBottom:12}}>BL</div>
              <h2>Blog Manager</h2>
              <p className="muted">Create, edit and organize your blog posts.</p>
              <div style={{marginTop:18}}>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : '+ Add Post'}</button>
              </div>
            </div>
          </div>

          <div className="card-side card-side--form">
            {showForm && (
              <form className="form blog-form" onSubmit={handleSubmit}>
                <h2 className="card-title">{editingPost ? 'Edit Blog Post' : 'Add New Blog Post'}</h2>

                <div className="input-group"><input className="input" type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title *" required /></div>

                <div className="input-group"><textarea className="input" name="excerpt" value={formData.excerpt} onChange={handleChange} rows="3" placeholder="Excerpt" /></div>

                <div className="input-group"><textarea className="input" name="content" value={formData.content} onChange={handleChange} rows="8" placeholder="Content *" required /></div>

                <div className="input-group"><input className="input" type="text" name="tags" value={formData.tags} onChange={handleChange} placeholder="Tags (comma-separated)" /></div>

                <div className="input-group"><input type="file" name="image" accept="image/*" onChange={handleChange} /></div>
                {editingPost && editingPost.image && !formData.image && <p className="current-image">Current: {editingPost.image}</p>}

                <div className="input-group"><label style={{display:'flex',alignItems:'center',gap:8}}><input type="checkbox" name="published" checked={formData.published} onChange={handleChange} /> Published</label></div>

                <div className="form-actions"><button type="submit" className="btn btn-primary">{editingPost ? 'Update' : 'Create'} Post</button></div>
              </form>
            )}

            <div className="posts-list">
              {posts.length === 0 ? (
                <p>No blog posts found. Add your first post!</p>
              ) : (
                <div className="posts-grid">
                  {posts.map(post => (
                    <div key={post._id} className="post-card">
                      {post.image && <img src={`http://localhost:5000${post.image}`} alt={post.title} />}
                      <div className="post-info">
                        <h3>{post.title}</h3>
                        <div className="post-meta"><span className={`status ${post.published ? 'status-published' : 'status-draft'}`}>{post.published ? 'Published' : 'Draft'}</span><span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span></div>
                        <p className="post-excerpt">{post.excerpt}</p>
                        <div className="post-actions">
                          <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(post)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(post._id)}>Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBlog;

