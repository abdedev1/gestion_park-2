import {axios} from "../axios"
export const getUsers = async () => {
  try {
    const response = await axios.get('/users');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Users:', error);
    throw error;
  }
};

