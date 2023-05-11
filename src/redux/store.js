import { configureStore } from "@reduxjs/toolkit";
import txnDialogReducer from './txnDialogSlice';


export const store = configureStore({
  reducer: {
    txnDialog: txnDialogReducer
  }
})
