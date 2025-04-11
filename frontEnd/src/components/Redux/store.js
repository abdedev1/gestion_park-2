import { configureStore } from '@reduxjs/toolkit'
import AuthReducer from "./slices/AuthSlice";
import spotsReducer from './Reducer/spotsSlice'
import pricing_ratesReducer from './Reducer/pracingRatesSlice'
import parking_ticketsReducer from './Reducer/parkingTicketsSlice'
import employesReducer  from './Reducer/employesSlice'

export const store = configureStore({
    reducer:{
        auth: AuthReducer,
        employes:employesReducer,
        spots:spotsReducer,
        pricing_rates:pricing_ratesReducer,
        parking_tickets:parking_ticketsReducer
    }
})