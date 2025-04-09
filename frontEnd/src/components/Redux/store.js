import { configureStore } from '@reduxjs/toolkit'
import employesReducer  from './Reducer/employesSlice'
export const store = configureStore({
    reducer:{
        employes:employesReducer
    }
})
