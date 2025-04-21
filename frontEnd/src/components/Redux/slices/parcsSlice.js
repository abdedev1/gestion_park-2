import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axios } from "../../../assets/api/axios";

export const fetchParcs = createAsyncThunk('parks/fetchParcs', async () => {
    const response = await axios.get('parks');
    return response.data;
});

export const searchParcs = createAsyncThunk('parks/searchParcs', async (query) => {
    const response = await axios.get(`parks/search?q=${query}`);
    return response.data;
});

export const getParcSpots = createAsyncThunk("parks/getParcSpots", async (parcId) => {
    const response = await axios.get(`parks/${parcId}/spots`);
    return response.data;
});

const parcsSlice = createSlice({
    name: 'parks',
    initialState: {
        parks: [],
        currentParcSpots: [],
        status: 'idle',
        error: null,
        searchQuery: ''
    },
    reducers: {
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },
        clearParcSpots: (state) => {
            state.currentParcSpots = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchParcs.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchParcs.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.parks = action.payload;
            })
            .addCase(fetchParcs.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(searchParcs.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(searchParcs.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.parks = action.payload;
            })
            .addCase(getParcSpots.fulfilled, (state, action) => {
                state.currentParcSpots = action.payload;
            });
    }
});

export const { setSearchQuery, clearParcSpots } = parcsSlice.actions;
export default parcsSlice.reducer;