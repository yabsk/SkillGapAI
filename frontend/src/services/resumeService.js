import api from './api';

export const uploadResumeFile = async (file) => {
  const formData = new FormData();
  formData.append('resume', file);
  const response = await api.post('/resumes/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getMyResume = async () => {
  const response = await api.get('/resumes/my-resume');
  return response.data;
};
