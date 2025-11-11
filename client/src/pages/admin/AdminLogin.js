import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, getAuthToken } from '../../services/authService';
import './AdminLogin.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (getAuthToken()) navigate('/admin');
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setRemember(checked);
      return;
    }
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(formData.email, formData.password, { remember });
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="login-container">
        <div className="login-card">
          <div className="card-side card-side--brand" aria-hidden>
            <div className="brand-inner">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
              </svg>
              <h2>Welcome Back</h2>
              <p className="muted">Sign in to manage the site content</p>
            </div>
          </div>

          <div className="card-side card-side--form">
            <form className="form" onSubmit={handleSubmit} noValidate>
              <div className="avatar">A</div>
              <h1 className="card-title">Admin Login</h1>

              {error && <div className="alert alert-error">{error}</div>}

              <label className="input-group">
                <span className="input-icon" aria-hidden>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 8v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><rect x="2" y="4" width="20" height="4" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <input
                  className="input"
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                />
              </label>

              <label className="input-group">
                <span className="input-icon" aria-hidden>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <input
                  className="input"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                />
                <button type="button" className="password-toggle" onClick={() => setShowPassword((s) => !s)} aria-label="Toggle password visibility">
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </label>

              <div className="form-row">
                <label className="checkbox">
                  <input type="checkbox" name="remember" checked={remember} onChange={handleChange} />
                  <span>Remember me</span>
                </label>
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? <span className="spinner" aria-hidden /> : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

