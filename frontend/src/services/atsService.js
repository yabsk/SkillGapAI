import api from './api';

export const getAtsEvaluation = async () => {
  const response = await api.get('/resume-evaluation/ats');
  return response.data;
};
