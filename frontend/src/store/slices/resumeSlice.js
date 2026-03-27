import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import resumeService from '../../features/resume/resumeService';

const initialState = {
  resumes: [],
  currentResume: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Upload new resume
export const uploadResume = createAsyncThunk(
  'resume/upload',
  async (resumeData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await resumeService.uploadResume(resumeData, token);
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

// Get user resumes
export const getResumes = createAsyncThunk(
  'resume/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await resumeService.getResumes(token);
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

export const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadResume.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadResume.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.resumes.unshift(action.payload.resume);
        state.currentResume = action.payload.resume;
      })
      .addCase(uploadResume.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getResumes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getResumes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.resumes = action.payload;
      })
      .addCase(getResumes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = resumeSlice.actions;
export default resumeSlice.reducer;
