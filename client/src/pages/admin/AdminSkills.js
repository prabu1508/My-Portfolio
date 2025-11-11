import React, { useState, useEffect } from 'react';
import { getSkills, createSkill, updateSkill, deleteSkill } from '../../services/skillService';
import './AdminSkills.css';

const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Other',
    proficiency: 50,
    icon: ''
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const data = await getSkills();
      setSkills(data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'proficiency' ? parseInt(value) || 0 : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSkill) {
        await updateSkill(editingSkill._id, formData);
      } else {
        await createSkill(formData);
      }

      resetForm();
      fetchSkills();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving skill');
    }
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      icon: skill.icon || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await deleteSkill(id);
        fetchSkills();
      } catch (error) {
        alert('Error deleting skill');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Other',
      proficiency: 50,
      icon: ''
    });
    setEditingSkill(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="admin-skills">
        <div className="container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-skills">
      <div className="container">
        <h1 className="page-title">Manage Skills</h1>

        <div className="login-card skills-card">
          <div className="card-side card-side--brand">
            <div className="brand-inner">
              <div className="avatar" style={{width:72,height:72,borderRadius:12,marginBottom:12}}>SK</div>
              <h2>Skills</h2>
              <p className="muted">Add and organize skills with proficiency levels.</p>
              <div style={{marginTop:18}}>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : '+ Add Skill'}</button>
              </div>
            </div>
          </div>

          <div className="card-side card-side--form">
            {showForm && (
              <form className="form skill-form" onSubmit={handleSubmit}>
                <h2 className="card-title">{editingSkill ? 'Edit Skill' : 'Add New Skill'}</h2>

                <div className="input-group"><input className="input" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Skill name *" required /></div>

                <div className="input-group"><select className="input" name="category" value={formData.category} onChange={handleChange}><option>Frontend</option><option>Backend</option><option>Database</option><option>Tools</option><option>Other</option></select></div>

                <div className="input-group"><input className="input" type="number" name="proficiency" value={formData.proficiency} onChange={handleChange} min="0" max="100" /></div>

                <div className="input-group"><input className="input" type="text" name="icon" value={formData.icon} onChange={handleChange} placeholder="Icon URL (optional)" /></div>

                <div className="form-actions"><button type="submit" className="btn btn-primary">{editingSkill ? 'Update' : 'Create'} Skill</button></div>
              </form>
            )}

            <div className="skills-list">
              {skills.length === 0 ? (
                <p>No skills found. Add your first skill!</p>
              ) : (
                <div className="skills-grid">
                  {skills.map(skill => (
                    <div key={skill._id} className="skill-card">
                      <div className="skill-main">
                        <div className="skill-name">{skill.name}</div>
                        <div className="skill-cat">{skill.category}</div>
                      </div>
                      <div className="skill-proficiency">
                        <div className="proficiency-bar"><div className="proficiency-fill" style={{width: `${skill.proficiency}%`}}></div></div>
                        <div className="proficiency-text">{skill.proficiency}%</div>
                      </div>
                      <div className="skill-actions">
                        <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(skill)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(skill._id)}>Delete</button>
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

export default AdminSkills;

