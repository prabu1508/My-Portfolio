import React, { useState, useEffect } from 'react';
import { getSkills } from '../services/skillService';
import './About.css';

const About = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchSkills();
  }, []);

  // read about content from localStorage if present
  const savedAbout = (() => {
    try {
      const raw = localStorage.getItem('aboutMe');
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null }
  })();

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div className="about-page">
      <div className="container">
        <h1 className="page-title">About Me</h1>
        
        <section className="about-section">
          <div className="about-content">
            <h2>{savedAbout?.title || 'Who I Am'}</h2>
            <p>{savedAbout?.bio || `I'm a passionate full-stack developer with a love for creating
              innovative solutions and beautiful user experiences. I enjoy
              working with modern technologies and constantly learning new
              skills to stay ahead in this ever-evolving field.`}</p>
            <p>{savedAbout?.location || 'City, Country'}</p>
            <div style={{marginTop:18}}>
              <a className="btn btn-primary" href={savedAbout?.resume || '/resume.pdf'} download>Download Resume</a>
            </div>
          </div>
        </section>

        <section className="skills-section">
          <h2 className="section-title">Skills & Technologies</h2>
          {loading ? (
            <p>Loading skills...</p>
          ) : (
            Object.keys(groupedSkills).map((category) => (
              <div key={category} className="skill-category">
                <h3>{category}</h3>
                <div className="skills-grid">
                  {groupedSkills[category].map((skill) => (
                    <div key={skill._id} className="skill-item">
                      <div className="skill-header">
                        <span className="skill-name">{skill.name}</span>
                        <span className="skill-proficiency">{skill.proficiency}%</span>
                      </div>
                      <div className="skill-bar">
                        <div
                          className="skill-progress"
                          style={{ width: `${skill.proficiency}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
};

export default About;

