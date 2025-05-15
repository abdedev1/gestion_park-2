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

export const getTicketById = createAsyncThunk(
  "parking_ticket/getTicketById",
  async (id) => {
    const response = await axios.get(`parking-tickets/${id}`);
    return response.data;
  }
);

const parkingTicketSlice = createSlice({
  name: 'parkingTickets',
  initialState: { parkingTickets: [], status: 'idle', error: null, ticket: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchParkingTickets.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchParkingTickets.fulfilled, (state, action) => { state.status = 'succeeded'; state.parkingTickets = action.payload; })
      .addCase(fetchParkingTickets.rejected, (state, action) => { state.status = 'failed'; state.error = action.error.message; })
      .addCase(addParkingTicket.fulfilled, (state, action) => { state.parkingTickets.push(action.payload); })
      .addCase(updateParkingTicket.fulfilled, (state, action) => {
        const index = state.parkingTickets.findIndex(parking_ticket => parking_ticket.id === action.payload.id);
        if (index !== -1) state.parkingTickets[index] = action.payload;
      })
      .addCase(deleteParkingTicket.fulfilled, (state, action) => {
        state.parkingTickets = state.parkingTickets.filter(ticket => ticket.id !== action.payload);
      })
      .addCase(getTicketById.fulfilled, (state, action) => {
        state.ticket = action.payload;
      });
  }
});

export default parkingTicketSlice.reducer;
