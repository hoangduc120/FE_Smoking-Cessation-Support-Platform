import { configureStore } from "@reduxjs/toolkit";
import quitSmokingReducer from "../store/slices/quitSmokingSlice";
import authReducer from "../store/slices/authSlice";
import planeReducer from "../store/slices/planeSlice";
import socketReducer from "../store/slices/socketSlice";
import socketMiddleware from "./middleware/socketMiddleware";

export const store = configureStore({
  reducer: {
    // add reducers here
    auth: authReducer,
    quitSmoking: quitSmokingReducer,
    plane: planeReducer,
    socket: socketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'socket/connectSocket/fulfilled',
          'socket/connectSocket/pending',
          'socket/connectSocket/rejected',
        ],
        ignoredActionsPaths: ['payload.socket'],
        ignoredPaths: ['socket.lastActivity'],
      },
    }).concat(socketMiddleware),
});

export default store;
