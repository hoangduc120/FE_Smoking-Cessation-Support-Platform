import { configureStore } from "@reduxjs/toolkit";
import quitSmokingReducer from "../store/slices/quitSmokingSlice";
import authReducer from "../store/slices/authSlice";
import planeReducer from "../store/slices/planeSlice";
import socketReducer from "../store/slices/socketSlice";
import userReducer from "../store/slices/userSlice";
import socketMiddleware from "./middleware/socketMiddleware";
import membershipReducer from "./slices/membershipSlice";
import blogReducer from "./slices/postSlice";

export const store = configureStore({
  reducer: {
    // add reducers here
    auth: authReducer,
    quitSmoking: quitSmokingReducer,
    plane: planeReducer,
    socket: socketReducer,
    user: userReducer,
    membership: membershipReducer,
    posts: blogReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "socket/connectSocket/fulfilled",
          "socket/connectSocket/pending",
          "socket/connectSocket/rejected",
        ],
        ignoredActionsPaths: ["payload.socket"],
        ignoredPaths: ["socket.lastActivity"],
      },
    }).concat(socketMiddleware),
});

export default store;
