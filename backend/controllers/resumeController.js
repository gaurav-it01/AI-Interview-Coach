import asyncHandler from 'express-async-handler';
import { createRequire } from 'module';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import Resume from '../models/Resume.js';
import { assertValidObjectId } from '../utils/validators.js';

const require = createRequire(import.meta.url);
const pdfParseModule = require('pdf-parse');
const pdfParse = typeof pdfParseModule === 'function' ? pdfParseModule : pdfParseModule.default;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, '..', 'uploads');

const removeFileIfExists = async (filePath) => {
  if (!filePath) return;

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
};

// @desc    Upload a new resume and extract text
// @route   POST /api/resume/upload
// @access  Private
const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a file');
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  const filePath = req.file.path;
  let extractedText = '';

  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    extractedText = data.text?.trim() || '';
  } catch {
    await removeFileIfExists(filePath);
    res.status(500);
    throw new Error('There was an issue parsing the PDF text.');
  }

  if (!extractedText) {
    await removeFileIfExists(filePath);
    res.status(400);
    throw new Error('We could not extract any text from this PDF. Please ensure it is a text-based document, not a scanned image.');
  }

  let resume;
  try {
    resume = await Resume.create({
      user: req.user._id,
      fileName: req.file.originalname,
      fileUrl,
      extractedText,
    });
  } catch (dbError) {
    await removeFileIfExists(filePath);
    res.status(400);
    throw new Error(`Invalid resume data: ${dbError.message}`);
  }

  res.status(201).json({
    message: 'Resume uploaded and parsed successfully',
    resume: {
      _id: resume._id,
      fileName: resume.fileName,
      fileUrl: `/api/resume/download/${resume._id}`,
      extractedTextSnippet: `${resume.extractedText.substring(0, 500)}${resume.extractedText.length > 500 ? '...' : ''}`,
    },
  });
});

// @desc    Get logged in user's resumes
// @route   GET /api/resume
// @access  Private
const getResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json(resumes);
});

// @desc    Download/retrieve owned resume PDF
// @route   GET /api/resume/download/:id
// @access  Private
const downloadResume = asyncHandler(async (req, res) => {
  assertValidObjectId(req.params.id, 'Resume');

  const resume = await Resume.findById(req.params.id);

  if (!resume) {
    res.status(404);
    throw new Error('Resume not found');
  }

  if (resume.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this resume');
  }

  const filename = path.basename(resume.fileUrl);
  const filePath = path.join(uploadDir, filename);

  try {
    await fs.access(filePath);
    res.download(filePath, resume.fileName);
  } catch {
    res.status(404);
    throw new Error('File not found on server');
  }
});

export { uploadResume, getResumes, downloadResume };
