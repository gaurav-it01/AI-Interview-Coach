import asyncHandler from 'express-async-handler';
import Resume from '../models/Resume.js';
import InterviewResult from '../models/InterviewResult.js';
import { generateInterviewQuestions, evaluateInterviewAnswers } from '../services/aiService.js';

// @desc    Generate interview questions from a resume ID
// @route   POST /api/interview/generate/:resumeId
// @access  Private
const generateQuestions = asyncHandler(async (req, res) => {
  const resume = await Resume.findById(req.params.resumeId);

  if (!resume) {
    res.status(404);
    throw new Error('Resume not found');
  }

  // Ensure user owns resume
  if (resume.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to access this resume');
  }

  const questions = await generateInterviewQuestions(resume.extractedText);

  res.status(200).json({ questions });
});

// @desc    Evaluate interview answers and save results
// @route   POST /api/interview/evaluate
// @access  Private
const evaluateInterview = asyncHandler(async (req, res) => {
  const { resumeId, qaPairs } = req.body;

  if (!qaPairs || qaPairs.length === 0) {
    res.status(400);
    throw new Error('No question/answer pairs provided');
  }

  // Generate evaluation using AI Service
  const aiEvaluations = await evaluateInterviewAnswers(qaPairs);

  if (!aiEvaluations || aiEvaluations.length !== qaPairs.length) {
    res.status(500);
    throw new Error('Failed to properly parse AI evaluations');
  }

  // Map to schema format and calculate average
  let totalScore = 0;
  const structuredEvaluations = qaPairs.map((pair, index) => {
    const aiResult = aiEvaluations[index];
    const score = Number(aiResult.score) || 0;
    totalScore += score;
    return {
      question: pair.question,
      answer: pair.answer,
      score: score,
      strengths: aiResult.strengths || 'N/A',
      weaknesses: aiResult.weaknesses || 'N/A',
      suggestions: aiResult.suggestions || 'N/A',
    };
  });

  const averageScore = Number((totalScore / qaPairs.length).toFixed(1));

  // Save to DB
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
  const result = await InterviewResult.findById(req.params.id)
    .populate('resume', 'fileName');
  
  if (result && result.user.toString() === req.user._id.toString()) {
    res.status(200).json(result);
  } else {
    res.status(404);
    throw new Error('Interview result not found or unauthorized');
  }
});

export { generateQuestions, evaluateInterview, getResults, getResultById };
