import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchReservations = createAsyncThunk(
  "reservations/fetchReservations",
  async () => {
    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/reservation/list/inhouse`);

    return response.data;
  }
);

const reservationsSlice = createSlice({
  name: "reservations",
  initialState: {
    inHouseReservations: [],
    status: "idle",
    error: null,
  },
  reducers: {
    addReservation: (state, action) => {
      state.reservations.push(action.payload);
    },
    updateReservation: (state, action) => {
      const index = state.inHouseReservations.findIndex(
        (reservation) => reservation.id === action.payload.id
      );
      if (index !== -1) {
        state.reservations[index] = action.payload;
      }
    },
    removeReservation: (state, action) => {
      state.reservations = state.inHouseReservations.filter(
        (reservation) => reservation.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReservations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchReservations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reservations = state.inHouseReservations.concat(action.payload);
      })
      .addCase(fetchReservations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addReservation, updateReservation, removeReservation } =
  reservationsSlice.actions;

export default reservationsSlice.reducer;