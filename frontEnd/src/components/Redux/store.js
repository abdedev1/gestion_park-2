import { configureStore } from '@reduxjs/toolkit'
import AuthReducer from "./slices/AuthSlice";
import spotsReducer from './slices/spotsSlice'
import pricingRatesReducer from './slices/pricingRatesSlice'
import parkingTicketsReducer from './slices/parkingTicketsSlice'
import employesReducer  from './slices/employesSlice'
import parcsReducer from './slices/parcsSlice'
import demandCardsReducer from "./slices/demandCardsSlice"
export const store = configureStore({
    reducer:{
        auth: AuthReducer,
        employes:employesReducer,
        spots:spotsReducer,
        parks: parcsReducer,
        pricingRates:pricingRatesReducer,
        parkingTickets:parkingTicketsReducer,
        demandCards: demandCardsReducer,
    }
})