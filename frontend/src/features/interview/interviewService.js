import apiClient from '../apiClient';

const API_URL = '/api/interview/';

const authConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Generate Questions from a Resume
const generateQuestions = async (resumeId, token) => {
  const response = await apiClient.post(API_URL + 'generate/' + resumeId, {}, authConfig(token));
  return response.data;
};

// Evaluate Answers
const evaluateInterview = async (resumeId, qaPairs, token) => {
  const response = await apiClient.post(API_URL + 'evaluate', { resumeId, qaPairs }, authConfig(token));
  return response.data;
};

// Get All Interview Results
const getResults = async (token) => {
  const response = await apiClient.get(API_URL + 'results', authConfig(token));
  return response.data;
};

// Get Specific Result
const getResultById = async (id, token) => {
  const response = await apiClient.get(API_URL + `results/${id}`, authConfig(token));
  return response.data;
};

// Delete Interview Result
const deleteResult = async (id, token) => {
  const response = await apiClient.delete(API_URL + `results/${id}`, authConfig(token));
  return response.data;
};

const interviewService = {
  generateQuestions,
  evaluateInterview,
  getResults,
  getResultById,
  deleteResult,
};

export default interviewService;
