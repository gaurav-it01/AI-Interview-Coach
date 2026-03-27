import axios from 'axios';

const API_URL = '/api/interview/';

// Generate Questions from a Resume
const generateQuestions = async (resumeId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL + 'generate/' + resumeId, {}, config);

  return response.data;
};

// Evaluate Answers
const evaluateInterview = async (resumeId, qaPairs, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.post(API_URL + 'evaluate', { resumeId, qaPairs }, config);
  return response.data;
};

// Get All Interview Results
const getResults = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(API_URL + 'results', config);
  return response.data;
};

// Get Specific Result
const getResultById = async (id, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(API_URL + `results/${id}`, config);
  return response.data;
};

const interviewService = {
  generateQuestions,
  evaluateInterview,
  getResults,
  getResultById,
};

export default interviewService;
