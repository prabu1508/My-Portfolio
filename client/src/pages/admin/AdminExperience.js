import React, { useState, useEffect } from 'react';
import { getExperiences, createExperience, updateExperience, deleteExperience } from '../../services/experienceService';
import './AdminExperience.css';

const AdminExperience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    startDate: '',
    endDate: '',
    current: false,
    type: 'Work'
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const data = await getExperiences();
      setExperiences(data);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const experienceData = {
        ...formData,
        endDate: formData.current ? null : formData.endDate || null
      };

      if (editingExperience) {
        await updateExperience(editingExperience._id, experienceData);
      } else {
        await createExperience(experienceData);
      }

      resetForm();
      fetchExperiences();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving experience');
    }
  };

  const handleEdit = (exp) => {
    setEditingExperience(exp);
    setFormData({
      title: exp.title,
      company: exp.company,
      location: exp.location || '',
      description: exp.description,
      startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
      endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : '',
      current: exp.current || false,
      type: exp.type || 'Work'
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      try {
        await deleteExperience(id);
        fetchExperiences();
      } catch (error) {
        alert('Error deleting experience');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      location: '',
      description: '',
      startDate: '',
      endDate: '',
      current: false,
      type: 'Work'
    });
    setEditingExperience(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="admin-experience">
        <div className="container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-experience">
      <div className="container">
        <div className="experience-card">
          <div className="login-card">
            <div className="card-side card-side--brand">
              <div className="brand-inner">
                <h2>Manage Experience</h2>
                <p className="brand-sub">Add, edit and manage your work & education entries</p>
                <div style={{marginTop:12}}>
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(!showForm)}
                  >
                    {showForm ? 'Cancel' : '+ Add Experience'}
                  </button>
                </div>
              </div>
            </div>

            <div className="card-side card-side--form">
              <div className="form">
                {showForm && (
                  <form className="experience-form" onSubmit={handleSubmit}>
                    <div className="card-title">{editingExperience ? 'Edit Experience' : 'Add New Experience'}</div>

                    <div className="input-group">
                      <select name="type" value={formData.type} onChange={handleChange} className="input" required>
                        <option value="Work">Work</option>
                        <option value="Education">Education</option>
                        <option value="Internship">Internship</option>
                        <option value="Freelance">Freelance</option>
                      </select>
                    </div>

                    <div className="input-group">
                      <input type="text" name="title" className="input" placeholder="Title (e.g. Senior Developer)" value={formData.title} onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                      <input type="text" name="company" className="input" placeholder="Company / Institution" value={formData.company} onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                      <input type="text" name="location" className="input" placeholder="Location (optional)" value={formData.location} onChange={handleChange} />
                    </div>

                    <div className="input-group">
                      <textarea name="description" className="input" placeholder="Description" value={formData.description} onChange={handleChange} rows="4" required></textarea>
                    </div>

                    <div className="form-row" style={{display:'flex', gap:8}}>
                      <div style={{flex:1}}>
                        <input type="date" name="startDate" className="input" value={formData.startDate} onChange={handleChange} required />
                      </div>
                      <div style={{flex:1}}>
                        <input type="date" name="endDate" className="input" value={formData.endDate} onChange={handleChange} disabled={formData.current} />
                      </div>
                    </div>

                    <div style={{marginTop:10}}>
                      <label style={{display:'flex',alignItems:'center',gap:8}}>
                        <input type="checkbox" name="current" checked={formData.current} onChange={handleChange} />
                        Currently working here
                      </label>
                    </div>

                    <div className="form-actions" style={{marginTop:12}}>
                      <button type="submit" className="btn btn-primary">{editingExperience ? 'Update' : 'Create'} Experience</button>
                      <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>
                    </div>
                  </form>
                )}

                <div className="experiences-list" style={{marginTop:16}}>
                  {experiences.length === 0 ? (
                    <p>No experience entries found. Add your first experience!</p>
                  ) : (
                    <div className="experiences-grid">
                      {experiences.map(exp => (
                        <div key={exp._id} className="experience-card">
                          <div className="experience-header">
                            <h3>{exp.title}</h3>
                            <span className="experience-type">{exp.type}</span>
                          </div>
                          <h4>{exp.company}</h4>
                          {exp.location && <p className="experience-location">{exp.location}</p>}
                          <p className="experience-date">
                            {new Date(exp.startDate).toLocaleDateString()} - {' '}
                            {exp.current
                              ? 'Present'
                              : exp.endDate
                              ? new Date(exp.endDate).toLocaleDateString()
                              : 'Present'}
                          </p>
                          <p className="experience-description">{exp.description}</p>
                          <div className="experience-actions">
                            <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(exp)}>Edit</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(exp._id)}>Delete</button>
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
      </div>
    </div>
  );
};

export default AdminExperience;

