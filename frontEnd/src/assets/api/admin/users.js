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
export const addUser = async (userData) => {
  try {
    const response = await axios.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Error adding User:', error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await axios.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating User:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting User:', error);
    throw error;
  }
};

export const getEmployes = async () => {
  try {
    const response = await axios.get('employes');
    return response.data;
  } catch (error) {
    console.error('Error fetching Employes:', error);
    throw error;
  }
}
