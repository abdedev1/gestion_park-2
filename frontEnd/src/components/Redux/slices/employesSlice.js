import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axios } from "../../../assets/api/axios";



export const fetchEmployes = createAsyncThunk('employes/fetchEmployes', async () => {
    const response = await axios.get("employes");
    return response.data;
});

export const getEmployeById = createAsyncThunk("employes/getEmployeById", async (id) => {
  const response = await axios.get(`employes/${id}`);
  return response.data;
});

export const addEmploye = createAsyncThunk("employes/addEmploye", async (newEmploye) => {
    const response = await axios.post("employes", newEmploye);
    return response.data;
  });
  
  export const updateEmploye = createAsyncThunk("employes/updateEmploye", async ({ id, updatedEmploye }) => {
    const response = await axios.put(`employes/${id}`, updatedEmploye);
    return response.data;
  });
  
  export const deleteEmploye = createAsyncThunk("employes/deleteEmploye", async (id) => {
    await axios.delete(`employes/${id}`);
    return id;
  });

const employesSlice = createSlice({
  name: 'employes',
  initialState: {
      employes: [],
      currentEmploye: null,
      status: 'idle',
      error: null
  },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEmployes.pending, (state) => {state.status = 'loading';})
            .addCase(fetchEmployes.fulfilled, (state, action) => {state.status = 'succeeded';state.employes = action.payload;})
            .addCase(fetchEmployes.rejected, (state, action) => {state.status = 'failed';state.error = action.error.message;})
            .addCase(addEmploye.fulfilled,(state,action)=>{state.employes.push(action.payload)})
            .addCase(updateEmploye.fulfilled,(state,action)=>{state.employes.findIndex(employe=>employe.id === action.payload.id);if (index !== -1) state.employes[index] = action.payload;})
            .addCase(deleteEmploye.fulfilled, (state, action) => { state.employes = state.employes.filter(employe => employe.id !== action.payload)})
            .addCase(getEmployeById.pending, (state) => { state.status = 'loading';})
            .addCase(getEmployeById.fulfilled, (state, action) => {
              state.status = 'succeeded';
              state.currentEmploye = action.payload;})
            .addCase(getEmployeById.rejected, (state, action) => {
              state.status = 'failed';
              state.error = action.error.message;
            });
    }
});

export default employesSlice.reducer;