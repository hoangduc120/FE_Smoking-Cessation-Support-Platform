import { configureStore } from "@reduxjs/toolkit";
import quitSmokingReducer from "../store/slices/quitSmokingSlice";
import authReducer from "../store/slices/authSlice";

export const store = configureStore({
  reducer: {
    // add reducers here
    auth: authReducer,
    quitSmoking: quitSmokingReducer,
  },
});

export default store;
