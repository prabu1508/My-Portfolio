import api from '../utils/api';

export const getProjects = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.category) params.append('category', filters.category);
  if (filters.technology) params.append('technology', filters.technology);
  if (filters.featured) params.append('featured', filters.featured);
  
  const response = await api.get(`/projects?${params.toString()}`);
  return response.data;
};

export const getProject = async (id) => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

export const createProject = async (projectData) => {
  const formData = new FormData();
  Object.keys(projectData).forEach(key => {
    if (key === 'image' && projectData[key] instanceof File) {
      formData.append('image', projectData[key]);
    } else if (key === 'technologies' && Array.isArray(projectData[key])) {
      formData.append('technologies', JSON.stringify(projectData[key]));
    } else {
      formData.append(key, projectData[key]);
    }
  });
  
  const response = await api.post('/projects', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateProject = async (id, projectData) => {
  const formData = new FormData();
  Object.keys(projectData).forEach(key => {
    if (key === 'image' && projectData[key] instanceof File) {
      formData.append('image', projectData[key]);
    } else if (key === 'technologies' && Array.isArray(projectData[key])) {
      formData.append('technologies', JSON.stringify(projectData[key]));
    } else {
      formData.append(key, projectData[key]);
    }
  });
  
  const response = await api.put(`/projects/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteProject = async (id) => {
  const response = await api.delete(`/projects/${id}`);
  return response.data;
};

