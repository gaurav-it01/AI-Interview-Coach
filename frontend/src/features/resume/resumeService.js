import apiClient from '../apiClient';

const API_URL = '/api/resume/';

// Upload Resume
const uploadResume = async (resumeData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };

  const response = await apiClient.post(API_URL, resumeData, config);

  return response.data;
};

// Get User Resumes
const getResumes = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await apiClient.get(API_URL, config);

  return response.data;
};

const resumeService = {
  uploadResume,
  getResumes,
};

export default resumeService;
