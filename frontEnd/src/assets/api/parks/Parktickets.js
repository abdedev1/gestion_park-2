import {axios} from "../axios"

export const getParksTickets = async () => {
  try {
    const response = await axios.get('/parking-tickets');
    return response.data;
  } catch (error) {
    console.error('Error fetching parking tickets:', error);
    throw error;
  }
};
export const deleteparkSpot = async (ticketid) => {
    try {
        const response = await axios.delete(`/parking-tickets/${ticketid}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting park ticket:', error);
        throw error;
    }
}