import { configureStore } from '@reduxjs/toolkit'
import employesReducer  from './Reducer/employesSlice'
import spotsReducer from './Reducer/spotsSlice'
import pricing_ratesReducer from './Reducer/pracingRatesSlice'
import parking_ticketsReducer from './Reducer/parkingTicketsSlice'
export const store = configureStore({
    reducer:{
        employes:employesReducer,
        spots:spotsReducer,
        pricing_rates:pricing_ratesReducer,
        parking_tickets:parking_ticketsReducer
    }
})
