import { createSlice } from "@reduxjs/toolkit";


const reservationsSlice = createSlice({
  name: "reservations",
  initialState: {
    selectedReservation: null,
  },
  reducers: {
    setReservation: (state, action) => {
      state.selectedReservation = action.payload;
    }
  },
});

export const { setReservation } =
  reservationsSlice.actions;

export default reservationsSlice.reducer;