import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axios } from "../../../assets/api/axios";



export const fetchPricing_rates = createAsyncThunk('pricing_rates/fetchPricing_rates', async () => {
    const response = await axios.get("pricing_rates");
    return response.data;
});

const pricing_ratesSlice = createSlice({
    name: 'pricing_rates',
    initialState:{pricing_rates: [],status: 'idle',error: null},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPricing_rates.pending, (state) => {state.status = 'loading';})
            .addCase(fetchPricing_rates.fulfilled, (state, action) => {state.status = 'succeeded';state.pricing_rates = action.payload;})
  
    }
});

export default pricing_ratesSlice.reducer;