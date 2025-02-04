import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import axios from "axios";

export const search = createAsyncThunk<
  AxiosResponse<DDGResponse> | string, // The return type can be either an AxiosResponse or an error string
  string, // The argument type for searchQuery
  { rejectValue: string } // Custom error type for rejected case
>("search", async (searchQuery: string, { rejectWithValue }) => {
  try {
    // axios.get already returns AxiosResponse<DDGResponse>, so no need to wrap it again
    const response = await axios.get<DDGResponse>(
      `http://api.duckduckgo.com/?q=${searchQuery}&format=json`
    );
    return response; // this will be AxiosResponse<DDGResponse>
  } catch {
    return rejectWithValue("ERROR: Something went wrong.");
  }
});

interface DDGResponse {
  Abstract: string;
  RelatedTopics: Array<{ Text: string; FirstURL: string }>;
}

interface State {
  success: AxiosResponse<DDGResponse> | null;
  loading: boolean;
  error: string | null;
}

const initialState: State = {
  success: null,
  loading: false,
  error: null,
};

const apiSlice = createSlice({
  name: "data",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(search.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        search.fulfilled,
        (state, action: PayloadAction<AxiosResponse<DDGResponse> | string>) => {
          state.loading = false;
          if (typeof action.payload === "string") {
            state.error = action.payload;
            state.success = null;
          } else {
            state.error = null;
            state.success = action.payload;
          }
        }
      )
      .addCase(
        search.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "Unknown error occurred.";
        }
      );
  },
});

export default apiSlice.reducer;
