import api from './api';

export const generateCareerRoadmap = async () => {
  const response = await api.post('/roadmap/generate');
  return response.data;
};

export const getMyRoadmap = async () => {
  const response = await api.get('/roadmap');
  return response.data;
};

export const updateMilestoneStatus = async (skillId, status) => {
  const response = await api.patch(`/roadmap/milestone/${skillId}`, { status });
  return response.data;
};
