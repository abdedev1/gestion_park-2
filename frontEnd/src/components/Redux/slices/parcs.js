import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { axios } from "../../../assets/api/axios";

export const fetchParcs = createAsyncThunk('parcs/fetchParcs', async()=>{
    const response = await axios.get('parcs')
    return response.data
})