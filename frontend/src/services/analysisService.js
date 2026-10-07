import api from './api';

export const runGapAnalysis = async () => {
  const response = await api.post('/analysis/run');
  return response.data;
};

export const getLatestAnalysis = async () => {
  const response = await api.get('/analysis/latest');
  return response.data;
};
