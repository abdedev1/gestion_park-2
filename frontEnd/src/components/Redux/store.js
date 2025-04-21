import { configureStore } from '@reduxjs/toolkit'
import AuthReducer from "./slices/AuthSlice";
import spotsReducer from './slices/spotsSlice'
import pricingRatesReducer from './slices/pricingRatesSlice'
import parkingTicketsReducer from './slices/parkingTicketsSlice'
import employesReducer  from './slices/employesSlice'
import parcsReducer from './slices/parcsSlice'

export const store = configureStore({
    reducer:{
        auth: AuthReducer,
        employes:employesReducer,
        spots:spotsReducer,
        parcs: parcsReducer,
        pricing_rates:pricingRatesReducer,
        parking_tickets:parkingTicketsReducer
    }
})