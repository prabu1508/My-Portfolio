import api from '../utils/api';

export const getExperiences = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.type) params.append('type', filters.type);
  
  const response = await api.get(`/experience?${params.toString()}`);
  return response.data;
};

export const getExperience = async (id) => {
  const response = await api.get(`/experience/${id}`);
  return response.data;
};

export const createExperience = async (experienceData) => {
  const response = await api.post('/experience', experienceData);
  return response.data;
};

export const updateExperience = async (id, experienceData) => {
  const response = await api.put(`/experience/${id}`, experienceData);
  return response.data;
};

export const deleteExperience = async (id) => {
  const response = await api.delete(`/experience/${id}`);
  return response.data;
};

