import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axios } from "../../../assets/api/axios";

export const fetchPricingRates = createAsyncThunk('pricingRates/fetchPricingRates', async () => {
    const response = await axios.get("pricing_rates");
    return response.data;
});

const pricingRatesSlice = createSlice({
    name: 'pricingRates',
    initialState: { pricingRates: [], status: 'idle', error: null },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPricingRates.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchPricingRates.fulfilled, (state, action) => { 
                state.status = 'succeeded'; 
                state.pricingRates = action.payload; 
            });
    }
});

export default pricingRatesSlice.reducer;