import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { fetcher } from "../../apis/fetcher";


export const loginApi = createAsyncThunk(
    "auth/login",
    async (data, {rejectWithValue}) => {
        try {
            const response = await fetcher.post("/auth/login", data);
       return response.data;
        } catch (error) {
              return rejectWithValue(error.response ? error.response.data : error.message);
        }   
    }
)


const authSlice = createSlice({
    name: "auth",
    initialState: {

    },
    reducers: {
        login: (state, action) => {
            state.currentUser = action.payload;
            toast.success("Login successful")
        },
        logout: (state) => {
            state.currentUser = null;
            toast.success("Logout successful")
        },
    },
    extraReducers: (builder) => {
        // add extra reducers here
    }
       
})

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;