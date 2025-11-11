import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProjects } from '../../services/projectService';
import { getAllBlogPosts } from '../../services/blogService';
import { getContacts } from '../../services/contactService';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [showAboutEditor, setShowAboutEditor] = useState(false);
  const [aboutForm, setAboutForm] = useState({ title: '', bio: '', location: '', resume: '/resume.pdf' });

  useEffect(() => {
    // load about from localStorage if present
    try {
      const raw = localStorage.getItem('aboutMe');
      if (raw) {
        const stored = JSON.parse(raw);
        setAboutForm({
          title: stored.title || '',
          bio: stored.bio || '',
          location: stored.location || '',
          resume: stored.resume || '/resume.pdf'
        });
      } else {
        // sensible defaults
        setAboutForm({ title: 'Who I Am', bio: `I'm a passionate full-stack developer with a love for creating innovative solutions and beautiful user experiences. I enjoy working with modern technologies and constantly learning new skills to stay ahead in this ever-evolving field.`, location: 'City, Country', resume: '/resume.pdf' });
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleAboutChange = (e) => setAboutForm({ ...aboutForm, [e.target.name]: e.target.value });

  const saveAbout = () => {
    try {
      localStorage.setItem('aboutMe', JSON.stringify(aboutForm));
      alert('About updated (saved to localStorage)');
      setShowAboutEditor(false);
    } catch (e) {
      alert('Failed to save About');
    }
  };
  const [stats, setStats] = useState({
    projects: 0,
    blogPosts: 0,
    unreadMessages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projects, blogPosts, contacts] = await Promise.all([
          getProjects(),
          getAllBlogPosts(),
          getContacts({ read: false })
        ]);

        setStats({
          projects: projects.length,
          blogPosts: blogPosts.length,
          unreadMessages: contacts.length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h1 className="page-title">Admin Dashboard</h1>

        <div className="login-card admin-card">
          <div className="card-side card-side--brand">
            <div className="brand-inner">
              <div className="avatar" style={{width:80,height:80,borderRadius:12,marginBottom:12}}>AD</div>
              <h2>Welcome back</h2>
              <p className="muted">Here's a snapshot of your portfolio activity.</p>

              <div className="brand-metrics">
                <div className="metric"><strong>{stats.projects}</strong><span>Projects</span></div>
                <div className="metric"><strong>{stats.blogPosts}</strong><span>Blog posts</span></div>
                <div className="metric"><strong>{stats.unreadMessages}</strong><span>Unread</span></div>
              </div>
            </div>
          </div>

          <div className="card-side card-side--form">
            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-icon">📁</div>
                <div>
                  <div className="kpi-label">Projects</div>
                  <div className="kpi-value">{stats.projects}</div>
                </div>
                <Link to="/admin/projects" className="kpi-action">Manage →</Link>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon">📝</div>
                <div>
                  <div className="kpi-label">Blog Posts</div>
                  <div className="kpi-value">{stats.blogPosts}</div>
                </div>
                <Link to="/admin/blog" className="kpi-action">Manage →</Link>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon">✉️</div>
                <div>
                  <div className="kpi-label">Messages</div>
                  <div className="kpi-value">{stats.unreadMessages}</div>
                </div>
                <Link to="/admin/contact" className="kpi-action">View →</Link>
              </div>
            </div>

            <div className="quick-links">
              <h3>Quick Links</h3>
              <div className="links-grid">
                <Link to="/admin/projects" className="dashboard-link">
                  <div className="link-icon">📁</div>
                  <div className="link-content">
                    <div className="link-title">Projects</div>
                    <div className="link-desc">Manage your portfolio projects</div>
                    <div className="link-details">{stats.projects} total</div>
                  </div>
                  <div className="link-chevron">→</div>
                </Link>
                <Link to="/admin/blog" className="dashboard-link">
                  <div className="link-icon">📝</div>
                  <div className="link-content">
                    <div className="link-title">Blog</div>
                    <div className="link-desc">Create and edit blog posts</div>
                    <div className="link-details">{stats.blogPosts} posts</div>
                  </div>
                  <div className="link-chevron">→</div>
                </Link>
                <Link to="/admin/skills" className="dashboard-link">
                  <div className="link-icon">⚙️</div>
                  <div className="link-content">
                    <div className="link-title">Skills</div>
                    <div className="link-desc">Manage your skills and technologies</div>
                  </div>
                  <div className="link-chevron">→</div>
                </Link>
                <Link to="/admin/experience" className="dashboard-link">
                  <div className="link-icon">🏢</div>
                  <div className="link-content">
                    <div className="link-title">Experience</div>
                    <div className="link-desc">Manage work experience and education</div>
                  </div>
                  <div className="link-chevron">→</div>
                </Link>
                <Link to="/admin/contact" className="dashboard-link">
                  <div className="link-icon">✉️</div>
                  <div className="link-content">
                    <div className="link-title">Contact Messages</div>
                    <div className="link-desc">View and manage contact submissions</div>
                    <div className="link-details">{stats.unreadMessages} unread</div>
                  </div>
                  <div className="link-chevron">→</div>
                </Link>
                <div className="dashboard-link" style={{cursor:'pointer'}} onClick={() => setShowAboutEditor(!showAboutEditor)}>
                  <div className="link-icon">✏️</div>
                  <div className="link-content">
                    <div className="link-title">Edit About (Local)</div>
                    <div className="link-desc">Edit the public About text (saves to this browser)</div>
                  </div>
                  <div className="link-chevron">→</div>
                </div>
              </div>
            </div>
            {showAboutEditor && (
              <div className="about-editor" style={{marginTop:18, background:'var(--bg-secondary)', padding:16, borderRadius:12}}>
                <h4>Edit About (localStorage)</h4>
                <div style={{display:'grid', gap:8}}>
                  <input className="input" name="title" value={aboutForm.title} onChange={handleAboutChange} placeholder="Title" />
                  <input className="input" name="location" value={aboutForm.location} onChange={handleAboutChange} placeholder="Location" />
                  <textarea className="input" name="bio" value={aboutForm.bio} onChange={handleAboutChange} rows={6} placeholder="Short bio" />
                  <div style={{display:'flex', gap:8}}>
                    <input className="input" name="resume" value={aboutForm.resume} onChange={handleAboutChange} placeholder="Resume URL" />
                    <button className="btn btn-primary" onClick={saveAbout}>Save</button>
                    <button className="btn" onClick={() => setShowAboutEditor(false)}>Close</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

