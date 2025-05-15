import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axios } from "../../../assets/api/axios";

export const fetchUserById = createAsyncThunk(
  "userById/fetchUserById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`users/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const userByIdSlice = createSlice({
  name: "userById",
  initialState: {
    userid: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.userid = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userByIdSlice.reducer;