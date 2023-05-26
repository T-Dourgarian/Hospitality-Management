import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchRatePlans = createAsyncThunk(
  "ratePlans/fetchRatePlans",
  async () => {
    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/rateplan`);

    return response.data;
  }
);


const ratePlansSlice = createSlice({
  name: "ratePlans",
  initialState: {
    ratePlans: [],
  },
  reducers: { 
    addRatePlan: (state, action) => {
      state.ratePlans.push(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRatePlans.fulfilled, (state, action) => {
        state.ratePlans = action.payload;
      })
  },
});

export const { addRatePlan } = ratePlansSlice.actions;


export default ratePlansSlice.reducer;