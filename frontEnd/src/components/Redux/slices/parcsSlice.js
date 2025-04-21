import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axios } from "../../../assets/api/axios";

export const fetchParcs = createAsyncThunk('parcs/fetchParcs', async () => {
    const response = await axios.get('parcs');
    return response.data;
});

export const searchParcs = createAsyncThunk('parcs/searchParcs', async (query) => {
    const response = await axios.get(`parcs/search?q=${query}`);
    return response.data;
});

export const getParcSpots = createAsyncThunk("parcs/getParcSpots", async (parcId) => {
    const response = await axios.get(`parcs/${parcId}/spots`);
    return response.data;
});

const parcsSlice = createSlice({
    name: 'parcs',
    initialState: {
        parcs: [],
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
                state.parcs = action.payload;
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
                state.parcs = action.payload;
            })
            .addCase(getParcSpots.fulfilled, (state, action) => {
                state.currentParcSpots = action.payload;
            });
    }
});

export const { setSearchQuery, clearParcSpots } = parcsSlice.actions;
export default parcsSlice.reducer;