import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axios } from "../../../assets/api/axios"; // Use your custom axios instance

// Async thunk to create a subscription
export const createSubscription = createAsyncThunk(
  "demandCards/createSubscription",
  async ({ userId, parkId, duration, totalPrice, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "demand-cards", // API endpoint
        {
          user_id: userId,
          park_id: parkId,
          duration,
          total_price: totalPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || error.message);
    }
  }
);

const demandCardsSlice = createSlice({
  name: "demandCards",
  initialState: { demandCards: [], status: "idle", error: null },
  extraReducers: (builder) => {
    builder
      .addCase(createSubscription.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.demandCards.push(action.payload); // Add the new subscription to the state
      })
      .addCase(createSubscription.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default demandCardsSlice.reducer;