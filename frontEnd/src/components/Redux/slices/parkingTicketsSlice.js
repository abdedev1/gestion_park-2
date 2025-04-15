import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axios } from "../../../assets/api/axios";



export const fetchParking_tickets = createAsyncThunk('parking_ticket/fetchParking_tickets', async () => {
    const response = await axios.get("parking-tickets");
    return response.data;
});

export const addParking_ticket = createAsyncThunk("parking_ticket/addParking_ticket", async (newParking_ticket) => {
  const response = await axios.post("parking-tickets", newParking_ticket);
    
    return response.data;
  });
  
  export const updateParking_ticket = createAsyncThunk("parking_ticket/updateParking_ticket", async ({ id, updatedParking_ticket }) => {
    console.log("🚀 updating ticket with id:", id);
    console.log("📦 data being sent:", updatedParking_ticket);
    const response = await axios.put(`parking-tickets/${id}`, updatedParking_ticket);
    return response.data;
  });
  
  export const deleteParking_ticket = createAsyncThunk("parking_ticket/deleteParking_ticket", async (id) => {
    await axios.delete(`parking-tickets/${id}`);
    return id;
  });

const parking_ticketSlice = createSlice({
    name: 'parking_tickets',
    initialState:{parking_tickets: [],status: 'idle',error: null},
    extraReducers: (builder) => {
        builder
            .addCase(fetchParking_tickets.pending, (state) => {state.status = 'loading';})
            .addCase(fetchParking_tickets.fulfilled, (state, action) => {state.status = 'succeeded';state.parking_tickets = action.payload;})
            .addCase(fetchParking_tickets.rejected, (state, action) => {state.status = 'failed';state.error = action.error.message;})
            .addCase(addParking_ticket.fulfilled,(state,action)=>{state.parking_tickets.push(action.payload)})
            .addCase(updateParking_ticket.fulfilled,(state,action)=>{const index =state.parking_tickets.findIndex(parking_ticket=>parking_ticket.id === action.payload.id);
              if (index !== -1) state.parking_tickets[index] = action.payload;})
            .addCase(deleteParking_ticket.fulfilled, (state, action) => {
                    state.parking_tickets = state.parking_tickets.filter(employe => employe.id !== action.payload);
                  });
    }
});

export default parking_ticketSlice.reducer;