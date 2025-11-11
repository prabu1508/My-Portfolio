import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to My Portfolio</h1>
            <p className="hero-subtitle">
              Full-Stack Developer | Problem Solver | Creative Thinker
            </p>
            <div className="hero-buttons">
              <Link to="/projects" className="btn btn-primary">View Projects</Link>
              <Link to="/contact" className="btn btn-secondary">Get In Touch</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">What I Do</h2>
          <div className="grid grid-3">
            <div className="feature-card">
              <h3>Web Development</h3>
              <p>Building modern, responsive web applications using the latest technologies.</p>
            </div>
            <div className="feature-card">
              <h3>Full-Stack Solutions</h3>
              <p>Creating end-to-end solutions from frontend to backend and database design.</p>
            </div>
            <div className="feature-card">
              <h3>Problem Solving</h3>
              <p>Turning complex problems into elegant, scalable solutions.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

