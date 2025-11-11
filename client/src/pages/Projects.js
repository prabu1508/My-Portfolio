import React, { useState, useEffect } from 'react';
import { getProjects } from '../services/projectService';
import './Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTechnology, setSelectedTechnology] = useState('all');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
        setFilteredProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    let filtered = [...projects];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (selectedTechnology !== 'all') {
      filtered = filtered.filter(p => 
        p.technologies && p.technologies.includes(selectedTechnology)
      );
    }

    setFilteredProjects(filtered);
  }, [selectedCategory, selectedTechnology, projects]);

  const categories = ['all', ...new Set(projects.map(p => p.category).filter(Boolean))];
  const technologies = ['all', ...new Set(
    projects.flatMap(p => p.technologies || []).filter(Boolean)
  )];

  if (loading) {
    return (
      <div className="projects-page">
        <div className="container">
          <p>Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="projects-page">
      <div className="container">
        <h1 className="page-title">My Projects</h1>

        <div className="filters">
          <div className="filter-group">
            <label>Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Technology:</label>
            <select
              value={selectedTechnology}
              onChange={(e) => setSelectedTechnology(e.target.value)}
            >
              {technologies.map(tech => (
                <option key={tech} value={tech}>
                  {tech.charAt(0).toUpperCase() + tech.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <p className="no-projects">No projects found matching your filters.</p>
        ) : (
          <div className="projects-grid">
            {filteredProjects.map(project => (
              <div key={project._id} className="project-card">
                {project.image && (
                  <div className="project-image">
                    <img
                      src={`http://localhost:5000${project.image}`}
                      alt={project.title}
                    />
                  </div>
                )}
                <div className="project-content">
                  <h3>{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  <div className="project-technologies">
                    {project.technologies && project.technologies.map((tech, idx) => (
                      <span key={idx} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                  <div className="project-links">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link"
                      >
                        GitHub
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link"
                      >
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;

