import { configureStore } from "@reduxjs/toolkit";
import quitSmokingReducer from "../store/slices/quitSmokingSlice";


export const store = configureStore({
  reducer: {
    // add reducers here
  quitSmoking: quitSmokingReducer,
  },
});

export default store;
