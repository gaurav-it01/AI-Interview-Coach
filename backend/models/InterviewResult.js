import mongoose from 'mongoose';

const evaluationSchema = mongoose.Schema({
  question: { type: String, required: true, trim: true },
  answer: { type: String, required: true, trim: true },
  score: { type: Number, required: true, min: 0, max: 10 },
  strengths: { type: String, required: true, trim: true },
  weaknesses: { type: String, required: true, trim: true },
  suggestions: { type: String, required: true, trim: true },
});

const interviewResultSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true,
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Resume',
      index: true,
    },
    evaluations: {
      type: [evaluationSchema],
      validate: [(value) => value.length > 0, 'At least one evaluation is required'],
    },
    averageScore: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
  },
  {
    timestamps: true,
  }
);

interviewResultSchema.index({ user: 1, createdAt: -1 });

const InterviewResult = mongoose.model('InterviewResult', interviewResultSchema);
export default InterviewResult;
