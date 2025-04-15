import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axios } from "../../../assets/api/axios";

export const fetchSpots = createAsyncThunk('spots/fetchSpots', async () => {
    const response = await axios.get("spots");
    return response.data;
});

export const addSpot = createAsyncThunk("spots/addSpot", async (newSpot) => {
    const response = await axios.post("spots", newSpot);
    return response.data;
});
  
  export const updateSpot = createAsyncThunk("spots/updateSpot", async ({ id, updatedSpot }) => {
    const response = await axios.put(`/spots/${id}`, updatedSpot);
    return response.data;
});
  
export const deleteSpot = createAsyncThunk("spots/deleteSpot", async (id) => {
    await axios.delete(`spots/${id}`);
    return id;
});

export const getEmployeSpots = createAsyncThunk("spots/getSpotSpots", async (id) => {
    const response = await axios.get(`employes/${id}/spots`);
    return response.data;
});

const spotsSlice = createSlice({
    name: 'spots',
    initialState: {
        spots: [],             
        employeeSpots: [],     
        status: 'idle',       
        error: null           
    },
    extraReducers: (builder) => {
        builder
           
            .addCase(fetchSpots.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSpots.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.spots = action.payload; 
            })
            .addCase(fetchSpots.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addSpot.fulfilled, (state, action) => {
                state.spots.push(action.payload); 
            })
            .addCase(updateSpot.fulfilled, (state, action) => {
                const index = state.spots.findIndex(spot => spot.id === action.payload.id);
                if (index !== -1) {
                    state.spots[index] = action.payload;  
                }
            })
            .addCase(deleteSpot.fulfilled, (state, action) => {
                state.spots = state.spots.filter(spot => spot.id !== action.payload); 
            })
            .addCase(getEmployeSpots.fulfilled, (state, action) => {
                state.employeeSpots = action.payload;  
            });
    }
});

export default spotsSlice.reducer;
