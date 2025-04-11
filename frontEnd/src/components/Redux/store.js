import { configureStore } from '@reduxjs/toolkit'
import AuthReducer from "./slices/AuthSlice";
import employesReducer  from './Reducer/employesSlice'

export const store = configureStore({
    reducer:{
        auth: AuthReducer,
        employes:employesReducer,
    }
})