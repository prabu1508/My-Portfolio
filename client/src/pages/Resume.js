import React, { useState, useEffect } from 'react';
import { getExperiences } from '../services/experienceService';
import './Resume.css';

const Resume = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const filters = filter !== 'all' ? { type: filter } : {};
        const data = await getExperiences(filters);
        setExperiences(data);
      } catch (error) {
        console.error('Error fetching experiences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, [filter]);

  if (loading) {
    return (
      <div className="resume-page">
        <div className="container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="resume-page">
      <div className="container">
        <h1 className="page-title">Resume & Experience</h1>

        <div className="resume-filters">
          <button
            className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={filter === 'Work' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('Work')}
          >
            Work
          </button>
          <button
            className={filter === 'Education' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('Education')}
          >
            Education
          </button>
          <button
            className={filter === 'Internship' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('Internship')}
          >
            Internship
          </button>
        </div>

        {experiences.length === 0 ? (
          <p className="no-experience">No experience entries found.</p>
        ) : (
          <div className="timeline">
            {experiences.map((exp, index) => (
              <div key={exp._id} className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <div className="experience-header">
                    <h3>{exp.title}</h3>
                    <span className="experience-type">{exp.type}</span>
                  </div>
                  <h4 className="experience-company">{exp.company}</h4>
                  {exp.location && (
                    <p className="experience-location">{exp.location}</p>
                  )}
                  <p className="experience-date">
                    {new Date(exp.startDate).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric'
                    })}
                    {' - '}
                    {exp.current
                      ? 'Present'
                      : exp.endDate
                      ? new Date(exp.endDate).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric'
                        })
                      : 'Present'}
                  </p>
                  <p className="experience-description">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Resume;

