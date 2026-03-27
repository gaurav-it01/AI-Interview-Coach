import mongoose from 'mongoose';

const evaluationSchema = mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  score: { type: Number, required: true },
  strengths: { type: String, required: true },
  weaknesses: { type: String, required: true },
  suggestions: { type: String, required: true },
});

const interviewResultSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Resume',
    },
    evaluations: [evaluationSchema],
    averageScore: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

const InterviewResult = mongoose.model('InterviewResult', interviewResultSchema);
export default InterviewResult;
