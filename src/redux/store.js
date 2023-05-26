import { configureStore } from "@reduxjs/toolkit";
import txnDialogReducer from './txnDialogSlice';
import inHouseReservationReducer from './inHouseReservationsSlice';
import selectedReservationReducer from "./selectedReservationSlice";
import ratePlanReducer from './ratePlansSlice'

export const store = configureStore({
  reducer: {
    txnDialog: txnDialogReducer,
    inHouseReservations: inHouseReservationReducer,
    selectedReservation: selectedReservationReducer,
    ratePlans: ratePlanReducer
  }
})
