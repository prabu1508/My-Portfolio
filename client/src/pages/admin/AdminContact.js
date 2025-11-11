import React, { useState, useEffect, useCallback } from 'react';
import { getContacts, updateContact, deleteContact } from '../../services/contactService';
import './AdminContact.css';

const AdminContact = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const filters = filter === 'all' ? {} : { read: filter === 'read' };
      const data = await getContacts(filters);
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleMarkRead = async (id, readStatus) => {
    try {
      await updateContact(id, { read: !readStatus });
      fetchContacts();
    } catch (error) {
      alert('Error updating contact');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await deleteContact(id);
        fetchContacts();
      } catch (error) {
        alert('Error deleting contact');
      }
    }
  };

  if (loading) {
    return (
      <div className="admin-contact">
        <div className="container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-contact">
      <div className="container">
        <div className="contact-card">
          <div className="login-card">
            <div className="card-side card-side--brand">
              <div className="brand-inner">
                <h2>Contact Messages</h2>
                <p className="brand-sub">View and manage messages sent through your contact form</p>
                <div style={{marginTop:14}} className="contact-filters">
                  <button className={filter === 'all' ? 'filter-btn active' : 'filter-btn'} onClick={() => setFilter('all')}>All</button>
                  <button className={filter === 'unread' ? 'filter-btn active' : 'filter-btn'} onClick={() => setFilter('unread')}>Unread</button>
                  <button className={filter === 'read' ? 'filter-btn active' : 'filter-btn'} onClick={() => setFilter('read')}>Read</button>
                </div>
              </div>
            </div>

            <div className="card-side card-side--form">
              <div className="form">
                <div className="contacts-list">
                  {contacts.length === 0 ? (
                    <p>No contact messages found.</p>
                  ) : (
                    <div className="contacts-grid">
                      {contacts.map(contact => (
                        <div key={contact._id} className={`contact-card ${!contact.read ? 'unread' : ''}`}>
                          <div className="contact-header">
                            <div>
                              <h3>{contact.name}</h3>
                              <p className="contact-email">{contact.email}</p>
                            </div>
                            {!contact.read && <span className="unread-badge">New</span>}
                          </div>
                          <div className="contact-subject"><strong>Subject:</strong> {contact.subject}</div>
                          <div className="contact-message">{contact.message}</div>
                          <div className="contact-footer">
                            <span className="contact-date">{new Date(contact.createdAt).toLocaleString()}</span>
                            <div className="contact-actions">
                              <button className="btn btn-sm" onClick={() => handleMarkRead(contact._id, contact.read)} style={{backgroundColor: contact.read ? '#ffc107' : '#28a745', color: 'white'}}>{contact.read ? 'Mark Unread' : 'Mark Read'}</button>
                              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(contact._id)}>Delete</button>
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
      </div>
    </div>
  );
};

export default AdminContact;

