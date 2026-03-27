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
  isError: false,
  isSuccess: false,
  message: '',
};

// Generate AI Questions
export const generateQuestions = createAsyncThunk(
  'interview/generate',
  async (resumeId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await interviewService.generateQuestions(resumeId, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const evaluateInterview = createAsyncThunk(
  'interview/evaluate',
  async (evaluationData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await interviewService.evaluateInterview(evaluationData.resumeId, evaluationData.qaPairs, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getResults = createAsyncThunk(
  'interview/getResults',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await interviewService.getResults(token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getResultById = createAsyncThunk(
  'interview/getResultById',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await interviewService.getResultById(id, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
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
      state.message = '';
    },
    resetInterview: (state) => {
      state.questions = [];
      state.answers = [];
      state.currentQuestionIndex = 0;
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
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateQuestions.pending, (state) => {
        state.isGenerating = true;
      })
      .addCase(generateQuestions.fulfilled, (state, action) => {
        state.isGenerating = false;
        state.isSuccess = true;
        state.questions = action.payload.questions;
        state.answers = new Array(action.payload.questions.length).fill('');
        state.currentQuestionIndex = 0;
      })
      .addCase(generateQuestions.rejected, (state, action) => {
        state.isGenerating = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(evaluateInterview.pending, (state) => {
        state.isEvaluating = true;
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
      });
  },
});

export const { reset, resetInterview, saveAnswer, nextQuestion, prevQuestion } = interviewSlice.actions;
export default interviewSlice.reducer;
