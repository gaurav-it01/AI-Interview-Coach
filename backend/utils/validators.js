import mongoose from 'mongoose';

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

const assertValidObjectId = (value, label = 'Resource') => {
  if (!mongoose.isValidObjectId(value)) {
    const error = new Error(`${label} not found`);
    error.statusCode = 404;
    throw error;
  }
};

const normalizeEmail = (email) => email.trim().toLowerCase();

export { assertValidObjectId, isNonEmptyString, normalizeEmail };
