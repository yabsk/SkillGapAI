import api from './api';

export const getAdminStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

export const createSkill = async (skillData) => {
  const response = await api.post('/admin/skills', skillData);
  return response.data;
};

export const createJobRole = async (jobRoleData) => {
  const response = await api.post('/admin/job-roles', jobRoleData);
  return response.data;
};

export const createResource = async (resourceData) => {
  const response = await api.post('/admin/resources', resourceData);
  return response.data;
};

export const createProject = async (projectData) => {
  const response = await api.post('/admin/projects', projectData);
  return response.data;
};
