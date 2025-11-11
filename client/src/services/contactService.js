import api from '../utils/api';

export const submitContact = async (contactData) => {
  const response = await api.post('/contact', contactData);
  return response.data;
};

export const getContacts = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.read !== undefined) params.append('read', filters.read);
  
  const response = await api.get(`/contact?${params.toString()}`);
  return response.data;
};

export const getContact = async (id) => {
  const response = await api.get(`/contact/${id}`);
  return response.data;
};

export const updateContact = async (id, updates) => {
  const response = await api.patch(`/contact/${id}`, updates);
  return response.data;
};

export const deleteContact = async (id) => {
  const response = await api.delete(`/contact/${id}`);
  return response.data;
};

