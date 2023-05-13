import { configureStore } from "@reduxjs/toolkit";
import txnDialogReducer from './txnDialogSlice';
import inHouseReservationReducer from './InHouseReservationsSlice';


export const store = configureStore({
  reducer: {
    txnDialog: txnDialogReducer,
    inHouseReservations: inHouseReservationReducer
  }
})
