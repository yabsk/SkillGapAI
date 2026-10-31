import api from './api';

export const getJobRoles = async () => {
  const response = await api.get('/job-roles');
  return response.data;
};

export const getJobRoleById = async (id) => {
  const response = await api.get(`/job-roles/${id}`);
  return response.data;
};

export const selectTargetRole = async (roleId, roleTitle) => {
  const payload = typeof roleId === 'object' && roleId !== null
    ? { roleId: roleId._id, roleTitle: roleId.title }
    : { roleId, roleTitle };
  const response = await api.put('/job-roles/select-target', payload);
  return response.data;
};
