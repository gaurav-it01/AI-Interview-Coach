import asyncHandler from 'express-async-handler';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParseModule = require('pdf-parse');
const pdfParse = typeof pdfParseModule === 'function' ? pdfParseModule : pdfParseModule.default;
import fs from 'fs';
import Resume from '../models/Resume.js';
import path from 'path';

// @desc    Upload a new resume and extract text
// @route   POST /api/resume/upload
// @access  Private
const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a file');
  }

  // File variables
  const fileUrl = `/uploads/${req.file.filename}`;
  const filePath = req.file.path;

  // Extract text from PDF
  let extractedText = '';
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    extractedText = data.text;
  } catch (error) {
    console.error('PDF Parse Error Details:', error);
    res.status(500);
    throw new Error('There was an issue parsing the PDF text.');
  }

  // Save to DB
  const resume = await Resume.create({
    user: req.user._id,
    fileName: req.file.originalname,
    fileUrl: fileUrl,
    extractedText: extractedText.trim(),
  });

  if (resume) {
    res.status(201).json({
      message: 'Resume uploaded and parsed successfully',
      resume: {
        _id: resume._id,
        fileName: resume.fileName,
        fileUrl: resume.fileUrl,
        extractedTextSnippet: resume.extractedText.substring(0, 500) + '...', // send a snippet
      },
    });
  } else {
    res.status(400);
    throw new Error('Invalid resume data');
  }
});

// @desc    Get logged in user's resumes
// @route   GET /api/resume
// @access  Private
const getResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json(resumes);
});

export { uploadResume, getResumes };
