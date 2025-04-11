import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout(state) {
      state.user = null;
      state.token = null;
    },
    updateUser(state, action) {
      state.user = action.payload;
    }
  },
});

export const { login, logout, updateUser } = AuthSlice.actions;
const AuthReducer = AuthSlice.reducer;

export default AuthReducer;