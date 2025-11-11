import api from '../utils/api';

export const getBlogPosts = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.tag) params.append('tag', filters.tag);
  if (filters.published) params.append('published', filters.published);
  
  const response = await api.get(`/blog?${params.toString()}`);
  return response.data;
};

export const getAllBlogPosts = async () => {
  const response = await api.get('/blog/admin/all');
  return response.data;
};

export const getBlogPost = async (id) => {
  const response = await api.get(`/blog/${id}`);
  return response.data;
};

export const createBlogPost = async (postData) => {
  const formData = new FormData();
  Object.keys(postData).forEach(key => {
    if (key === 'image' && postData[key] instanceof File) {
      formData.append('image', postData[key]);
    } else if (key === 'tags' && Array.isArray(postData[key])) {
      formData.append('tags', JSON.stringify(postData[key]));
    } else {
      formData.append(key, postData[key]);
    }
  });
  
  const response = await api.post('/blog', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateBlogPost = async (id, postData) => {
  const formData = new FormData();
  Object.keys(postData).forEach(key => {
    if (key === 'image' && postData[key] instanceof File) {
      formData.append('image', postData[key]);
    } else if (key === 'tags' && Array.isArray(postData[key])) {
      formData.append('tags', JSON.stringify(postData[key]));
    } else {
      formData.append(key, postData[key]);
    }
  });
  
  const response = await api.put(`/blog/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteBlogPost = async (id) => {
  const response = await api.delete(`/blog/${id}`);
  return response.data;
};

