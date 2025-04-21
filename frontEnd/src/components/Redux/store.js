import { configureStore } from '@reduxjs/toolkit'
import AuthReducer from "./slices/AuthSlice";
import spotsReducer from './slices/spotsSlice'
import pricing_ratesReducer from './slices/pracingRatesSlice'
import parking_ticketsReducer from './slices/parkingTicketsSlice'
import employesReducer  from './slices/employesSlice'
import parcsReducer from './slices/parcsSlice'

export const store = configureStore({
    reducer:{
        auth: AuthReducer,
        employes:employesReducer,
        spots:spotsReducer,
        pricing_rates:pricing_ratesReducer,
        parking_tickets:parking_ticketsReducer,
        parcs: parcsReducer
    }
})