import { axios } from '../axios';

export const getRoles = async () => {
  try {
    const response = await axios.get('/roles');
    return response.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

export const addRole = async (roleData) => {
  try {
    const response = await axios.post('/roles', roleData);
    return response.data;
  } catch (error) {
    console.error('Error adding role:', error);
    throw error;
  }
};

export const updateRole = async (id, roleData) => {
  try {
    const response = await axios.put(`/roles/${id}`, roleData);
    return response.data;
  } catch (error) {
    console.error('Error updating role:', error);
    throw error;
  }
};

export const deleteRole = async (id) => {
  try {
    const response = await axios.delete(`/roles/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting role:', error);
    throw error;
  }
};