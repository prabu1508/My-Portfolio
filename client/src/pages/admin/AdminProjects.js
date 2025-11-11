import React, { useState, useEffect } from 'react';
import { getProjects, deleteProject, createProject, updateProject } from '../../services/projectService';
import './AdminProjects.css';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    category: '',
    githubUrl: '',
    liveUrl: '',
    featured: false,
    image: null
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
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
      const projectData = {
        ...formData,
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean)
      };

      if (editingProject) {
        await updateProject(editingProject._id, projectData);
      } else {
        await createProject(projectData);
      }

      resetForm();
      fetchProjects();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving project');
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies?.join(', ') || '',
      category: project.category,
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      featured: project.featured || false,
      image: null
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        fetchProjects();
      } catch (error) {
        alert('Error deleting project');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      technologies: '',
      category: '',
      githubUrl: '',
      liveUrl: '',
      featured: false,
      image: null
    });
    setEditingProject(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="admin-projects">
        <div className="container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-projects">
      <div className="container">
        <h1 className="page-title">Manage Projects</h1>

        <div className="login-card projects-card">
          <div className="card-side card-side--brand">
            <div className="brand-inner">
              <div className="avatar" style={{width:72,height:72,borderRadius:12,marginBottom:12}}>PR</div>
              <h2>Projects</h2>
              <p className="muted">Create and feature projects on your portfolio.</p>
              <div style={{marginTop:18}}>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : '+ Add Project'}</button>
              </div>
            </div>
          </div>

          <div className="card-side card-side--form">
            {showForm && (
              <form className="form project-form" onSubmit={handleSubmit}>
                <h2 className="card-title">{editingProject ? 'Edit Project' : 'Add New Project'}</h2>

                <div className="input-group"><input className="input" type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title *" required /></div>

                <div className="input-group"><textarea className="input" name="description" value={formData.description} onChange={handleChange} placeholder="Description *" rows={4} required /></div>

                <div className="form-row">
                  <div className="input-group"><input className="input" type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category *" required /></div>
                  <div className="input-group"><input className="input" type="text" name="technologies" value={formData.technologies} onChange={handleChange} placeholder="Technologies (comma-separated)" /></div>
                </div>

                <div className="form-row">
                  <div className="input-group"><input className="input" type="url" name="githubUrl" value={formData.githubUrl} onChange={handleChange} placeholder="GitHub URL" /></div>
                  <div className="input-group"><input className="input" type="url" name="liveUrl" value={formData.liveUrl} onChange={handleChange} placeholder="Live URL" /></div>
                </div>

                <div className="input-group"><input type="file" name="image" accept="image/*" onChange={handleChange} /></div>
                {editingProject && editingProject.image && !formData.image && <p className="current-image">Current: {editingProject.image}</p>}

                <div className="input-group"><label style={{display:'flex',alignItems:'center',gap:8}}><input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} /> Featured Project</label></div>

                <div className="form-actions"><button type="submit" className="btn btn-primary">{editingProject ? 'Update' : 'Create'} Project</button></div>
              </form>
            )}

            <div className="projects-list">
              {projects.length === 0 ? (
                <p>No projects found. Add your first project!</p>
              ) : (
                <div className="projects-grid">
                  {projects.map(project => (
                    <div key={project._id} className="project-card">
                      {project.image && <img src={`http://localhost:5000${project.image}`} alt={project.title} />}
                      <div className="project-info">
                        <h3>{project.title}</h3>
                        <p className="project-category">{project.category}</p>
                        <div className="project-actions">
                          <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(project)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(project._id)}>Delete</button>
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

export default AdminProjects;

