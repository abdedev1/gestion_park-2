import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axios } from "../../../assets/api/axios"; // Use your custom axios instance

// Async thunk to create a subscription
export const fetchDemandCards = createAsyncThunk(
  "demandCards/fetchDemandCards",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("demand-cards");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createSubscription = createAsyncThunk(
  "demandCards/createSubscription",
  async ({ clientId, parkId,base_rate_id, duration, totalPrice,status, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "demand-cards", // API endpoint
        {
          client_id: clientId,
          park_id: parkId,
          base_rate_id,
          duration,
          total_price: totalPrice,
          status,
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

export const updateDemandCardStatus = createAsyncThunk(
  "demandCards/updateDemandCardStatus",
  async ({ id, status, token }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `demand-cards/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const demandCardsSlice = createSlice({
  name: "demandCards",
  initialState: { demandCards: [], status: "idle", error: null },
  extraReducers: (builder) => {
    builder
    .addCase(fetchDemandCards.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDemandCards.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.demandCards = action.payload;
      })
      .addCase(fetchDemandCards.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
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
      })
      .addCase(updateDemandCardStatus.fulfilled, (state, action) => {
        const idx = state.demandCards.findIndex(dc => dc.id === action.payload.id);
        if (idx !== -1) state.demandCards[idx] = action.payload;
      });
  },
});

export default demandCardsSlice.reducer;