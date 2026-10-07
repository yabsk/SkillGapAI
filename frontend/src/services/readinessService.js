import api from './api';

export const getJobReadiness = async () => {
  const response = await api.get('/readiness');
  return response.data;
};
