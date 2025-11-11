import React, { useState } from 'react';
import { submitContact } from '../services/contactService';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await submitContact(formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Error sending message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="container">
        <h1 className="page-title">Get In Touch</h1>

        <div className="contact-content">
          <div className="login-card">
            <div className="card-side card-side--brand">
              <div className="brand-inner">
                <div style={{fontSize:36, marginBottom:12}}>📬</div>
                <h2>Contact</h2>
                <p className="muted">Feel free to reach out for opportunities or just to say hi.</p>

                <div style={{marginTop:18}}>
                  <div className="info-item">
                    <strong>Email</strong>
                    <span><a href={`mailto:${formData.email || 'your.email@example.com'}`}>your.email@example.com</a></span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-side card-side--form">
              <div className="card-title">Send a message</div>
              <form className="form contact-form" onSubmit={handleSubmit}>
                {success && (
                  <div className="alert alert-success">
                    Message sent successfully! I'll get back to you soon.
                  </div>
                )}
                {error && (
                  <div className="alert alert-error">{error}</div>
                )}

                <div className="input-group">
                  <input className="input" type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Your name*" required />
                </div>

                <div className="input-group">
                  <input className="input" type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your email*" required />
                </div>

                <div className="input-group">
                  <input className="input" type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject*" required />
                </div>

                <div className="input-group">
                  <textarea className="input" id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Message*" rows={6} required></textarea>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary btn-block" disabled={loading}>{loading ? 'Sending...' : 'Send Message'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

