import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import Resume from './pages/Resume';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminBlog from './pages/admin/AdminBlog';
import AdminSkills from './pages/admin/AdminSkills';
import AdminExperience from './pages/admin/AdminExperience';
import AdminContact from './pages/admin/AdminContact';
// Profile removed
import PrivateRoute from './components/auth/PrivateRoute';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            {/* Profile removed */}
            <Route path="/projects" element={<Projects />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/projects"
              element={
                <PrivateRoute>
                  <AdminProjects />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/blog"
              element={
                <PrivateRoute>
                  <AdminBlog />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/skills"
              element={
                <PrivateRoute>
                  <AdminSkills />
                </PrivateRoute>
              }
            />
            {/* Admin profile/editor removed */}
            <Route
              path="/admin/experience"
              element={
                <PrivateRoute>
                  <AdminExperience />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/contact"
              element={
                <PrivateRoute>
                  <AdminContact />
                </PrivateRoute>
              }
            />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

