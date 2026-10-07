import api from './api';

export const getRecommendations = async () => {
  try {
    const response = await api.get('/recommendations');
    if (response.data && response.data.data) {
      return response.data.data;
    }
  } catch (error) {
    console.error('Error fetching recommendations from backend API:', error);
  }
  return { courses: [], certifications: [], codingPractices: [], projects: [] };
};
