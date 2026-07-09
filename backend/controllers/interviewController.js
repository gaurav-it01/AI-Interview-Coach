import asyncHandler from 'express-async-handler';
import Resume from '../models/Resume.js';
import InterviewResult from '../models/InterviewResult.js';
import { generateInterviewQuestions, evaluateInterviewAnswers } from '../services/aiService.js';
import { assertValidObjectId, isNonEmptyString } from '../utils/validators.js';

const clampScore = (score) => Math.min(10, Math.max(0, Number.isFinite(score) ? score : 5));

const fallbackQuestions = [
  {
    question: 'Walk me through your most relevant project and explain the impact you personally delivered.',
    type: 'Behavioral',
  },
  {
    question: 'Describe a technical challenge you faced, the trade-offs you considered, and how you resolved it.',
    type: 'Technical',
  },
  {
    question: 'Tell me about a time you had to learn a new tool, framework, or concept quickly to complete a task.',
    type: 'Behavioral',
  },
  {
    question: 'How would you debug a production issue reported by users but not reproducible on your machine?',
    type: 'Situational',
  },
  {
    question: 'What part of your resume best represents your readiness for this role, and what would you improve next?',
    type: 'Career',
  },
];

const findOwnedResume = async (resumeId, userId) => {
  assertValidObjectId(resumeId, 'Resume');

  const resume = await Resume.findById(resumeId);

  if (!resume) {
    const error = new Error('Resume not found');
    error.statusCode = 404;
    throw error;
  }

  if (resume.user.toString() !== userId.toString()) {
    const error = new Error('Not authorized to access this resume');
    error.statusCode = 403;
    throw error;
  }

  return resume;
};

// @desc    Generate interview questions from a resume ID
// @route   POST /api/interview/generate/:resumeId
// @access  Private
const generateQuestions = asyncHandler(async (req, res) => {
  const resume = await findOwnedResume(req.params.resumeId, req.user._id);

  try {
    const questions = await generateInterviewQuestions(resume.extractedText);
    res.status(200).json({ questions, fallback: false });
  } catch (error) {
    res.status(200).json({
      questions: fallbackQuestions,
      fallback: true,
      message:
        error.message?.includes('quota') || error.message?.includes('rate limit')
          ? 'AI quota is temporarily exceeded. You can continue with our curated fallback interview questions.'
          : 'AI question generation is temporarily unavailable, so we loaded a high-quality fallback interview set.',
      reason: process.env.NODE_ENV === 'production' ? undefined : error.message,
    });
  }
});

// @desc    Evaluate interview answers and save results
// @route   POST /api/interview/evaluate
// @access  Private
const evaluateInterview = asyncHandler(async (req, res) => {
  const { resumeId, qaPairs } = req.body;

  if (!resumeId) {
    res.status(400);
    throw new Error('Resume ID is required');
  }

  if (!Array.isArray(qaPairs) || qaPairs.length === 0) {
    res.status(400);
    throw new Error('No question/answer pairs provided');
  }

  if (qaPairs.length > 20) {
    res.status(400);
    throw new Error('A maximum of 20 question/answer pairs can be evaluated at once');
  }

  for (const pair of qaPairs) {
    if (!pair || !isNonEmptyString(pair.question) || !isNonEmptyString(pair.answer)) {
      res.status(400);
      throw new Error('All question/answer pairs must include question and answer text');
    }
  }

  await findOwnedResume(resumeId, req.user._id);

  let aiEvaluations = [];
  try {
    aiEvaluations = await evaluateInterviewAnswers(qaPairs);
  } catch {
    aiEvaluations = [];
  }

  let totalScore = 0;
  const structuredEvaluations = qaPairs.map((pair, index) => {
    const aiResult = aiEvaluations[index] || {
      score: 5,
      strengths: 'Response recorded.',
      weaknesses: 'Detailed evaluation unavailable.',
      suggestions: 'Review your answer against standard STAR method guidelines.',
    };
    const score = clampScore(Number(aiResult.score));
    totalScore += score;

    return {
      question: pair.question.trim(),
      answer: pair.answer.trim(),
      score,
      strengths: isNonEmptyString(aiResult.strengths) ? aiResult.strengths.trim() : 'N/A',
      weaknesses: isNonEmptyString(aiResult.weaknesses) ? aiResult.weaknesses.trim() : 'N/A',
      suggestions: isNonEmptyString(aiResult.suggestions) ? aiResult.suggestions.trim() : 'N/A',
    };
  });

  const averageScore = Number((totalScore / qaPairs.length).toFixed(1));

  const interviewResult = await InterviewResult.create({
    user: req.user._id,
    resume: resumeId,
    evaluations: structuredEvaluations,
    averageScore,
  });

  res.status(201).json(interviewResult);
});

// @desc    Get all user interview results
// @route   GET /api/interview/results
// @access  Private
const getResults = asyncHandler(async (req, res) => {
  const results = await InterviewResult.find({ user: req.user._id })
    .populate('resume', 'fileName')
    .sort({ createdAt: -1 });
  res.status(200).json(results);
});

// @desc    Get specific interview result by ID
// @route   GET /api/interview/results/:id
// @access  Private
const getResultById = asyncHandler(async (req, res) => {
  assertValidObjectId(req.params.id, 'Interview result');

  const result = await InterviewResult.findOne({ _id: req.params.id, user: req.user._id })
    .populate('resume', 'fileName');

  if (!result) {
    res.status(404);
    throw new Error('Interview result not found or unauthorized');
  }

  res.status(200).json(result);
});

// @desc    Delete interview result by ID
// @route   DELETE /api/interview/results/:id
// @access  Private
const deleteResult = asyncHandler(async (req, res) => {
  assertValidObjectId(req.params.id, 'Interview result');

  const result = await InterviewResult.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!result) {
    res.status(404);
    throw new Error('Interview result not found or unauthorized');
  }

  res.status(200).json({ message: 'Interview deleted successfully', id: req.params.id });
});

export { generateQuestions, evaluateInterview, getResults, getResultById, deleteResult };
