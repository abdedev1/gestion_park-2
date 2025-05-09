import {axios} from "../axios"

export const getParks = async () => {
  try {
    const response = await axios.get('/parks');
    return response.data;
  } catch (error) {
    console.error('Error fetching parks:', error);
    throw error;
  }
};
export const getPark = async (id) => {
  try {
    const response = await axios.get('/parks/' + id);
    return response.data;
  } catch (error) {
    console.error('Error fetching parks:', error);
    throw error;
  }
};
export const getSpots = async () => {
    try {
      const response = await axios.get('/spots');
      return response.data;
    } catch (error) {
      console.error('Error fetching spots:', error);
      throw error;
  }
};
export const addPark = async (parkData) => {
  try {
    const response = await axios.post('/parks', parkData);
    return response.data;
  } catch (error) {
    console.error('Error adding park:', error);
    throw error;
  }
};
export const updatePark = async (parkId, parkData) => {
  try {
    const response = await axios.put(`/parks/${parkId}`, parkData);
    return response.data;
  } catch (error) {
    console.error('Error updating park:', error);
    throw error;
  }
};
export const deletePark = async (parkId) => {
  try {
    const response = await axios.delete(`/parks/${parkId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting park:', error);
    throw error;
  }
}
export const addSpot = async (spotData) => {
    try {
        const response = await axios.post('/spots', spotData);
        return response.data;
    } catch (error) {
        console.error('Error adding spot:', error);
        throw error;
    }
}
export const addMultipleSpots = async (spotData) => {
  try {
      const response = await axios.post('/spots/multiple', spotData);
      return response.data;
  } catch (error) {
      console.error('Error adding multiple spots:', error);
      throw error;
  }
};
export const addMultipleSpotsExact = async (spotsArray) => {
  try {
      const response = await axios.post('/spots/exact', spotsArray);
      return response.data;
  } catch (error) {
      console.error('Error adding multiple spots:', error);
      throw error;
  }
};
export const updateSpot = async (spotId, spotData) => {
    try {
        const response = await axios.put(`/spots/${spotId}`, spotData);
        return response.data;
    } catch (error) {
        console.error('Error updating spot:', error);
        throw error;
    }
}
export const updateMultipleSpots = async (spotsArray) => {
  try {
    const response = await axios.put('/spots/multiple', spotsArray)
    return response.data
  } catch (error) {
    console.error('Error updating multiple spots:', error)
    throw error
  }
}
export const deleteSpot = async (spotId) => {
    try {
        const response = await axios.delete(`/spots/${spotId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting spot:', error);
        throw error;
    }
}
export const deleteMultipleSpots = async (spotIds) => {
  try {
      const response = await axios.delete('/spots', {data: {spot_ids: spotIds}});
      return response.data;
  } catch (error) {
      console.error('Error deleting multiple spots:', error);
      throw error;
  }
};
