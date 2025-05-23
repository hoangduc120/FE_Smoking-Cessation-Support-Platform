import { configureStore } from "@reduxjs/toolkit";
import quitSmokingReducer from "../store/slices/quitSmokingSlice";
import authReducer from "../store/slices/authSlice";
import planeReducer from "../store/slices/planeSlice";

export const store = configureStore({
  reducer: {
    // add reducers here
    auth: authReducer,
    quitSmoking: quitSmokingReducer,
    plane: planeReducer,
  },
});

export default store;
