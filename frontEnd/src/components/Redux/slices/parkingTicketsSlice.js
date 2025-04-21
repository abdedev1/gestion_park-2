import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axios } from "../../../assets/api/axios";

export const fetchParkingTickets = createAsyncThunk('parking_ticket/fetchParkingTickets', async () => {
  const response = await axios.get("parking-tickets");
  return response.data;
});

export const addParkingTicket = createAsyncThunk("parking_ticket/addParkingTicket", async (newParkingTicket) => {
  const response = await axios.post("parking-tickets", newParkingTicket);
  return response.data;
});

export const updateParkingTicket = createAsyncThunk("parking_ticket/updateParkingTicket", async ({ id, updatedParkingTicket }) => {
  const response = await axios.put(`parking-tickets/${id}`, updatedParkingTicket);
  return response.data;
});

export const deleteParkingTicket = createAsyncThunk("parking_ticket/deleteParkingTicket", async (id) => {
  await axios.delete(`parking-tickets/${id}`);
  return id;
});

const parkingTicketSlice = createSlice({
  name: 'parking_tickets',
  initialState: { parking_tickets: [], status: 'idle', error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchParkingTickets.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchParkingTickets.fulfilled, (state, action) => { state.status = 'succeeded'; state.parking_tickets = action.payload; })
      .addCase(fetchParkingTickets.rejected, (state, action) => { state.status = 'failed'; state.error = action.error.message; })
      .addCase(addParkingTicket.fulfilled, (state, action) => { state.parking_tickets.push(action.payload); })
      .addCase(updateParkingTicket.fulfilled, (state, action) => {
        const index = state.parking_tickets.findIndex(parking_ticket => parking_ticket.id === action.payload.id);
        if (index !== -1) state.parking_tickets[index] = action.payload;
      })
      .addCase(deleteParkingTicket.fulfilled, (state, action) => {
        state.parking_tickets = state.parking_tickets.filter(ticket => ticket.id !== action.payload);
      });
  }
});

export default parkingTicketSlice.reducer;
