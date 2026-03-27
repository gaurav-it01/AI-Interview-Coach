import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Helper to safely instantiate the Gemini API client.
 * Ensures the API key is present in the environment.
 * @returns {GoogleGenerativeAI} The initialized Generative AI client
 */
const getGenAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing from environment variables.');
  }
  return new GoogleGenerativeAI(apiKey);
};

/**
 * Generates technical and behavioral interview questions based on parsed resume text.
 * @param {string} resumeText - The extracted text from the user's PDF resume.
 * @returns {Promise<Array>} Array of generated question objects.
 */
const generateInterviewQuestions = async (resumeText) => {
  try {
    const genAI = getGenAIClient();
    // Use gemini-1.5-flash for faster response times
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Based on the following parsed resume text, generate exactly 5 interview questions.
      Requirements:
      - 2 technical questions related to the skills and experience.
      - 2 HR/Behavioral questions.
      - 1 project-based question tailored to a specific project. If no projects are found, ask a generic architecture question.
      
      Output the questions cleanly as a JSON array of objects with keys "type" (Technical, HR, Project) and "question".
      Do not wrap the JSON output in markdown formatting blocks like \`\`\`json. Return only the raw JSON array.
      
      Resume Text:
      ${resumeText.substring(0, 3000)}
    `;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text().trim();

    // Safety generic parsing: Isolate JSON array if there's preamble/postamble
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      responseText = jsonMatch[0];
    }

    return JSON.parse(responseText);
  } catch (error) {
    console.error('Gemini API Error (generateInterviewQuestions):', error);

    if (error.message?.includes('API_KEY_INVALID')) {
      throw new Error('Invalid Gemini API Key. Please verify your GEMINI_API_KEY in .env.');
    }
    throw new Error(`AI Generation Failed: ${error.message.substring(0, 100)}`);
  }
};

/**
 * Evaluates the user's answers to the interview questions.
 * @param {Array} qaPairs - Array of objects containing the question and the user's answer.
 * @returns {Promise<Array>} Array of evaluation objects.
 */
const evaluateInterviewAnswers = async (qaPairs) => {
  try {
    const genAI = getGenAIClient();
    // Use gemini-1.5-flash for evaluation as well
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert AI Interview Coach. Evaluate the following interview answers.
      For each question-answer pair, provide:
      1. Score: out of 10.
      2. Strengths: What the candidate did well.
      3. Weaknesses: Where the candidate fell short.
      4. Suggestions: How to improve the answer.

      Return the result strictly as a JSON array of objects, with each object corresponding to the order of the Q&A pairs provided. 
      Use keys: "score", "strengths", "weaknesses", "suggestions". Do not wrap in markdown \`\`\`json blocks.
      
      Q&A Pairs:
      ${JSON.stringify(qaPairs)}
    `;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text().trim();

    // Safety generic parsing: Isolate JSON array
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      responseText = jsonMatch[0];
    }

    return JSON.parse(responseText);
  } catch (error) {
    console.error('Gemini Evaluation Error (evaluateInterviewAnswers):', error);
    if (error.message?.includes('API_KEY_INVALID')) {
      throw new Error('Invalid Gemini API Key. Please verify your GEMINI_API_KEY in .env.');
    }
    throw new Error(`AI Evaluation Failed: ${error.message.substring(0, 100)}`);
  }
};

export { generateInterviewQuestions, evaluateInterviewAnswers };
