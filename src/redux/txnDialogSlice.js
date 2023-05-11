import { configureStore, createSlice } from "@reduxjs/toolkit";


const txnDialogSlice = createSlice({
  name: "txnDialog",
  initialState: { 
    txnDialog: false
  },
  reducers: {
    toggleDialog(state, action) {
      state.txnDialog = action.payload
    }
  }
})

export const { toggleDialog } = txnDialogSlice.actions;

export default txnDialogSlice.reducer;