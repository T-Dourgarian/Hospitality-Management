import { configureStore, createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
  name: "user",
  initialState: { 
    value: {
      username: ""
    }
  },
  reducers: {
    login: (state,action) => {
      state.value = action.payload
    },
    logout: (state) => {
      state = {
        value: {
          username: ""
        }
      }
    }
  }
})

export const { login, logout } = userSlice.actions;


export const store = configureStore({
  reducer: {
    user: userSlice.reducer
  }
})