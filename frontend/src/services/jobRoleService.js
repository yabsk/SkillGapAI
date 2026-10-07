import api from './api';

export const getJobRoles = async () => {
  const response = await api.get('/job-roles');
  return response.data;
};

export const getJobRoleById = async (id) => {
  const response = await api.get(`/job-roles/${id}`);
  return response.data;
};

export const selectTargetRole = async (roleId) => {
  const response = await api.put('/job-roles/select-target', { roleId });
  return response.data;
};
