import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
import { isNonEmptyString, normalizeEmail } from '../utils/validators.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'UNCONFIGURED');
const shouldAutoVerifyEmail = process.env.AUTO_VERIFY_EMAIL !== 'false';
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const buildAuthResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  token: generateToken(user._id),
});

const handleDuplicateUser = (error) => {
  if (error?.code === 11000) {
    const duplicateError = new Error('User already exists');
    duplicateError.statusCode = 400;
    throw duplicateError;
  }

  throw error;
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!isNonEmptyString(name) || !isNonEmptyString(email) || !isNonEmptyString(password)) {
    res.status(400);
    throw new Error('Name, email, and password are required');
  }

  if (name.trim().length > 80) {
    res.status(400);
    throw new Error('Name must be 80 characters or fewer');
  }

  const normalizedEmail = normalizeEmail(email);

  if (!emailRegex.test(normalizedEmail)) {
    res.status(400);
    throw new Error('Please enter a valid email address');
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters long');
  }

  if (password.length > 128) {
    res.status(400);
    throw new Error('Password must be 128 characters or fewer');
  }

  const userExists = await User.exists({ email: normalizedEmail });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const verificationToken = crypto.randomBytes(32).toString('hex');
  let user;

  try {
    user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      verificationToken: shouldAutoVerifyEmail ? undefined : verificationToken,
      isVerified: shouldAutoVerifyEmail,
    });
  } catch (error) {
    handleDuplicateUser(error);
  }

  let emailSent = false;
  if (!shouldAutoVerifyEmail) {
    const isSmtpConfigured = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;

    if (!isSmtpConfigured) {
      user.isVerified = true;
      user.verificationToken = undefined;
      await user.save();
    } else {
      const verifyUrl = `${process.env.CLIENT_URL || 'https://ai-interview-coach-liard.vercel.app'}/verify/${verificationToken}`;

      try {
        await sendEmail({
          email: user.email,
          subject: 'Verify your AI Interview Coach account',
          html: `<p>Welcome to AI Interview Coach.</p><p>Verify your email: <a href="${verifyUrl}">${verifyUrl}</a></p>`,
        });
        emailSent = true;
      } catch {
        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();
      }
    }
  }

  res.status(201).json({
    message: shouldAutoVerifyEmail || !emailSent
      ? 'User registered successfully. You can now log in!'
      : 'User registered successfully. Please check your email to verify your account.',
  });
});

// @desc    Verify email
// @route   GET /api/auth/verify/:token
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  if (!isNonEmptyString(token)) {
    res.status(400);
    throw new Error('Invalid verification token');
  }

  const user = await User.findOne({ verificationToken: token.trim() });

  if (!user) {
    res.status(400);
    throw new Error('Invalid verification token');
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ email: normalizeEmail(email) });

  if (user && (await user.matchPassword(password))) {
    if (!user.isVerified) {
      res.status(403);
      throw new Error('Please verify your email before logging in');
    }

    res.json(buildAuthResponse(user));
    return;
  }

  res.status(401);
  throw new Error('Invalid email or password');
});

// @desc    Auth user with Google OAuth
// @route   POST /api/auth/google
// @access  Public
const googleAuth = asyncHandler(async (req, res) => {
  const { credential } = req.body;
  const googleClientId = process.env.GOOGLE_CLIENT_ID;

  if (!googleClientId || googleClientId === 'your-google-oauth-client-id.apps.googleusercontent.com' || googleClientId.trim() === '') {
    res.status(500);
    throw new Error('Google sign-in is not configured on the server');
  }

  if (!isNonEmptyString(credential)) {
    res.status(400);
    throw new Error('No valid Google credentials provided');
  }

  let payload;
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential.trim(),
      audience: googleClientId,
    });
    payload = ticket.getPayload();
  } catch (error) {
    res.status(400);
    throw new Error(`Invalid Google credential token: ${error.message}`);
  }

  if (!payload?.email || !payload?.sub) {
    res.status(400);
    throw new Error('Google token payload is missing required account data');
  }

  const email = normalizeEmail(payload.email);
  const googleId = payload.sub;
  let user = await User.findOne({ email });

  if (!user) {
    const randomPassword = crypto.randomBytes(24).toString('hex');
    try {
      user = await User.create({
        name: payload.name || 'Google User',
        email,
        password: randomPassword,
        isVerified: true,
        googleId,
      });
    } catch (error) {
      handleDuplicateUser(error);
    }
  }

  if (user.googleId && user.googleId !== googleId) {
    res.status(409);
    throw new Error('This email is already linked to a different Google account');
  }

  if (!user.googleId || !user.isVerified) {
    user.googleId = googleId;
    user.isVerified = true;
    await user.save();
  }

  res.json({
    ...buildAuthResponse(user),
    message: 'Successfully logged in with Google!',
  });
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password -verificationToken');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
  });
});

export { registerUser, verifyEmail, loginUser, googleAuth, getUserProfile };
