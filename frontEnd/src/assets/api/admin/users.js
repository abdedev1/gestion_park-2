import axios from "axios"

const API_BASE_URL = "/api/users"

/**
 * Fetch all users
 * @returns {Promise} Axios response promise
 */
export const fetchUsers = () => {
  return axios.get(`${API_BASE_URL}`)
}

/**
 * Fetch a single user by ID
 * @param {string} userId - The ID of the user
 * @returns {Promise} Axios response promise
 */
export const fetchUserById = (userId) => {
  return axios.get(`${API_BASE_URL}/${userId}`)
}

/**
 * Create a new user
 * @param {Object} userData - The data for the new user
 * @returns {Promise} Axios response promise
 */
export const createUser = (userData) => {
  return axios.post(`${API_BASE_URL}`, userData)
}

/**
 * Update an existing user
 * @param {string} userId - The ID of the user
 * @param {Object} userData - The updated data for the user
 * @returns {Promise} Axios response promise
 */
export const updateUser = (userId, userData) => {
  return axios.put(`${API_BASE_URL}/${userId}`, userData)
}

/**
 * Delete a user
 * @param {string} userId - The ID of the user
 * @returns {Promise} Axios response promise
 */
export const deleteUser = (userId) => {
  return axios.delete(`${API_BASE_URL}/${userId}`)
}
