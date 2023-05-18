import { configureStore } from "@reduxjs/toolkit";
import txnDialogReducer from './txnDialogSlice';
import inHouseReservationReducer from './InHouseReservationsSlice';
import selectedReservationReducer from "./selectedReservationSlice";


export const store = configureStore({
  reducer: {
    txnDialog: txnDialogReducer,
    inHouseReservations: inHouseReservationReducer,
    selectedReservation: selectedReservationReducer
  }
})
