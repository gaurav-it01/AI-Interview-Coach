import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import interviewService from '../../features/interview/interviewService';

const initialState = {
  questions: [],
  answers: [],
  results: [],
  currentResult: null,
  currentQuestionIndex: 0,
  isGenerating: false,
  isEvaluating: false,
  isLoading: false,
  isDeleting: false,
  isError: false,
  isSuccess: false,
  usedFallbackQuestions: false,
  fallbackReason: '',
  message: '',
};

const getErrorMessage = (error) => (
  error.response?.data?.message || error.message || error.toString()
);

const getAuthToken = (thunkAPI) => {
  const token = thunkAPI.getState().auth.user?.token;
  if (!token) {
    throw new Error('You must be logged in to continue');
  }
  return token;
};

export const generateQuestions = createAsyncThunk(
  'interview/generate',
  async (resumeId, thunkAPI) => {
    try {
      return await interviewService.generateQuestions(resumeId, getAuthToken(thunkAPI));
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const evaluateInterview = createAsyncThunk(
  'interview/evaluate',
  async (evaluationData, thunkAPI) => {
    try {
      return await interviewService.evaluateInterview(evaluationData.resumeId, evaluationData.qaPairs, getAuthToken(thunkAPI));
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getResults = createAsyncThunk(
  'interview/getResults',
  async (_, thunkAPI) => {
    try {
      return await interviewService.getResults(getAuthToken(thunkAPI));
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getResultById = createAsyncThunk(
  'interview/getResultById',
  async (id, thunkAPI) => {
    try {
      return await interviewService.getResultById(id, getAuthToken(thunkAPI));
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteResult = createAsyncThunk(
  'interview/deleteResult',
  async (id, thunkAPI) => {
    try {
      return await interviewService.deleteResult(id, getAuthToken(thunkAPI));
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isGenerating = false;
      state.isEvaluating = false;
      state.isLoading = false;
      state.message = '';
    },
    resetInterview: (state) => {
      state.questions = [];
      state.answers = [];
      state.currentQuestionIndex = 0;
      state.isGenerating = false;
      state.isEvaluating = false;
      state.isError = false;
      state.message = '';
      state.usedFallbackQuestions = false;
      state.fallbackReason = '';
    },
    saveAnswer: (state, action) => {
      const { questionIndex, answer } = action.payload;
      state.answers[questionIndex] = answer;
    },
    nextQuestion: (state) => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
      }
    },
    prevQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateQuestions.pending, (state) => {
        state.isGenerating = true;
        state.isError = false;
        state.message = '';
        state.usedFallbackQuestions = false;
        state.fallbackReason = '';
      })
      .addCase(generateQuestions.fulfilled, (state, action) => {
        state.isGenerating = false;
        state.isSuccess = true;
        state.questions = action.payload.questions;
        state.answers = new Array(action.payload.questions.length).fill('');
        state.currentQuestionIndex = 0;
        state.usedFallbackQuestions = Boolean(action.payload.fallback);
        state.fallbackReason = action.payload.reason || '';
        state.message = action.payload.message || '';
      })
      .addCase(generateQuestions.rejected, (state, action) => {
        state.isGenerating = false;
        state.isError = true;
        state.message = action.payload;
        state.usedFallbackQuestions = false;
        state.fallbackReason = '';
      })
      .addCase(evaluateInterview.pending, (state) => {
        state.isEvaluating = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(evaluateInterview.fulfilled, (state, action) => {
        state.isEvaluating = false;
        state.isSuccess = true;
        state.currentResult = action.payload;
      })
      .addCase(evaluateInterview.rejected, (state, action) => {
        state.isEvaluating = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getResults.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.results = action.payload;
      })
      .addCase(getResults.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getResultById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.currentResult = null;
        state.message = '';
      })
      .addCase(getResultById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentResult = action.payload;
      })
      .addCase(getResultById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteResult.pending, (state) => {
        state.isDeleting = true;
      })
      .addCase(deleteResult.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.results = state.results.filter((result) => result._id !== action.payload.id);
        if (state.currentResult?._id === action.payload.id) {
          state.currentResult = null;
        }
      })
      .addCase(deleteResult.rejected, (state) => {
        state.isDeleting = false;
      });
  },
});

export const { reset, resetInterview, saveAnswer, nextQuestion, prevQuestion } = interviewSlice.actions;
export default interviewSlice.reducer;
