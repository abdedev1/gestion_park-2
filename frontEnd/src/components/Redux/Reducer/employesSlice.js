import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = "http://127.0.0.1:8000/api/employes";


export const fetchEmployes = createAsyncThunk('employes/fetchEmployes', async () => {
    const response = await axios.get(API_URL);
    return response.data;
});

export const addEmploye = createAsyncThunk("employes/addEmploye", async (newEmploye) => {
    const response = await axios.post(API_URL, newEmploye);
    return response.data;
  });
  
  export const updateEmploye = createAsyncThunk("employes/updateEmploye", async ({ id, updatedEmploye }) => {
    const response = await axios.put(`${API_URL}/${id}`, updatedEmploye);
    return response.data;
  });
  
  export const deleteEmploye = createAsyncThunk("employes/deleteEmploye", async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    return id;
  });

const employesSlice = createSlice({
    name: 'employes',
    initialState:{employes: [],status: 'idle',error: null},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEmployes.pending, (state) => {state.status = 'loading';})
            .addCase(fetchEmployes.fulfilled, (state, action) => {state.status = 'succeeded';state.employes = action.payload;})
            .addCase(fetchEmployes.rejected, (state, action) => {state.status = 'failed';state.error = action.error.message;})
            .addCase(addEmploye.fulfilled,(state,action)=>{state.employes.push(action.payload)})
            .addCase(updateEmploye.fulfilled,(state,action)=>{state.employes.findIndex(employe=>employe.id === action.payload.id);if (index !== -1) state.employes[index] = action.payload;})
            .addCase(deleteEmploye.fulfilled, (state, action) => {
                    state.employes = state.employes.filter(employe => employe.id !== action.payload);
                  });
    }
});

export default employesSlice.reducer;