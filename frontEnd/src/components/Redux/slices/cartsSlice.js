import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axios } from "../../../assets/api/axios";

// Créer une cart
export const createCart = createAsyncThunk(
  "carts/createCart",
  async ({ client_id, base_rate_id, park_id, status, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "carts",
        { client_id, base_rate_id, park_id, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.log("Error creating cart:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const cartsSlice = createSlice({
  name: "carts",
  initialState: { carts: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCart.pending, (state) => { state.status = "loading"; })
      .addCase(createCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.carts.push(action.payload);
      })
      .addCase(createCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default cartsSlice.reducer;