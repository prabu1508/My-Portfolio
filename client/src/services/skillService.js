import api from '../utils/api';

export const getSkills = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.category) params.append('category', filters.category);
  
  const response = await api.get(`/skills?${params.toString()}`);
  return response.data;
};

export const getSkill = async (id) => {
  const response = await api.get(`/skills/${id}`);
  return response.data;
};

export const createSkill = async (skillData) => {
  const response = await api.post('/skills', skillData);
  return response.data;
};

export const updateSkill = async (id, skillData) => {
  const response = await api.put(`/skills/${id}`, skillData);
  return response.data;
};

export const deleteSkill = async (id) => {
  const response = await api.delete(`/skills/${id}`);
  return response.data;
};

