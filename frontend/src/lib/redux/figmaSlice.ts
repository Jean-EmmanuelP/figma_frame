import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { FramesResponse, FrameSummary, CodeResponse } from '@/lib/types';
import { fetchFrames as apiFetchFrames, fetchFrameNode as apiFetchFrameNode, fetchFrameHtml as apiFetchFrameHtml } from '@/lib/api';

export interface FigmaState {
  currentUrl: string | null;
  framesData: FramesResponse | null;
  selectedFrame: {
    id: string;
    data: any;
    code: string | null;
  } | null;
  loading: {
    frames: boolean;
    frameNode: boolean;
    frameCode: boolean;
  };
  errors: {
    frames: string | null;
    frameNode: string | null;
    frameCode: string | null;
  };
}

const initialState: FigmaState = {
  currentUrl: null,
  framesData: null,
  selectedFrame: null,
  loading: {
    frames: false,
    frameNode: false,
    frameCode: false,
  },
  errors: {
    frames: null,
    frameNode: null,
    frameCode: null,
  },
};

export const fetchFrames = createAsyncThunk(
  'figma/fetchFrames',
  async (url: string, { rejectWithValue }) => {
    try {
      const response = await apiFetchFrames(url);
      return { url, data: response };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  }
);

export const fetchFrameNode = createAsyncThunk(
  'figma/fetchFrameNode',
  async ({ url, id }: { url: string; id: string }, { rejectWithValue }) => {
    try {
      const response = await apiFetchFrameNode(url, id);
      return { id, data: response };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  }
);

export const fetchFrameCode = createAsyncThunk(
  'figma/fetchFrameCode',
  async ({ url, id }: { url: string; id: string }, { rejectWithValue }) => {
    try {
      const response: CodeResponse = await apiFetchFrameHtml(url, id);
      return { id, code: response.code };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  }
);

const figmaSlice = createSlice({
  name: 'figma',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.errors = {
        frames: null,
        frameNode: null,
        frameCode: null,
      };
    },
    clearFrameCode: (state) => {
      if (state.selectedFrame) {
        state.selectedFrame.code = null;
      }
      state.errors.frameCode = null;
    },
    selectFrame: (state, action: PayloadAction<{ id: string; data?: any }>) => {
      state.selectedFrame = {
        id: action.payload.id,
        data: action.payload.data || null,
        code: null,
      };
    },
    clearSelection: (state) => {
      state.selectedFrame = null;
      state.errors.frameNode = null;
      state.errors.frameCode = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFrames.pending, (state) => {
        state.loading.frames = true;
        state.errors.frames = null;
      })
      .addCase(fetchFrames.fulfilled, (state, action) => {
        state.loading.frames = false;
        state.currentUrl = action.payload.url;
        state.framesData = action.payload.data;
        state.errors.frames = null;
      })
      .addCase(fetchFrames.rejected, (state, action) => {
        state.loading.frames = false;
        state.errors.frames = action.payload as string;
      })
      .addCase(fetchFrameNode.pending, (state) => {
        state.loading.frameNode = true;
        state.errors.frameNode = null;
      })
      .addCase(fetchFrameNode.fulfilled, (state, action) => {
        state.loading.frameNode = false;
        if (state.selectedFrame && state.selectedFrame.id === action.payload.id) {
          state.selectedFrame.data = action.payload.data;
        }
        state.errors.frameNode = null;
      })
      .addCase(fetchFrameNode.rejected, (state, action) => {
        state.loading.frameNode = false;
        state.errors.frameNode = action.payload as string;
      })
      .addCase(fetchFrameCode.pending, (state) => {
        state.loading.frameCode = true;
        state.errors.frameCode = null;
      })
      .addCase(fetchFrameCode.fulfilled, (state, action) => {
        state.loading.frameCode = false;
        if (state.selectedFrame && state.selectedFrame.id === action.payload.id) {
          state.selectedFrame.code = action.payload.code;
        }
        state.errors.frameCode = null;
      })
      .addCase(fetchFrameCode.rejected, (state, action) => {
        state.loading.frameCode = false;
        state.errors.frameCode = action.payload as string;
      });
  },
});

export const { clearErrors, clearFrameCode, selectFrame, clearSelection } = figmaSlice.actions;
export default figmaSlice.reducer;