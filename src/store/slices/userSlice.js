import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetcher.get("/users/profile/me");
      return response.data.data.user;
    } catch (error) {
      console.error(
        "Error fetching user profile:",
        error.response?.data || error
      );
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

// Fetch author profile by ID
export const fetchAuthorById = createAsyncThunk(
  "user/fetchAuthorById",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(`/users/${userId}`);
      const user = response.data.data?.user;
      if (!user || Object.keys(user).length === 0) {
        return { _id: userId, name: "Người dùng" };
      }
      const normalizedUser = {
        _id: user._id,
        name: user.userName || user.email?.split("@")[0] || "Người dùng",
        avatar:
          user.profilePicture ||
          "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
        joinDate: user.createdAt || new Date().toISOString(),
      };
      return normalizedUser;
    } catch (error) {
      console.error("Error fetching author:", error.response?.data || error);
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

// Fetch user stats
export const fetchUserStats = createAsyncThunk(
  "user/fetchUserStats",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(`/users/${userId}/stats`);
      return response.data.data.stats;
    } catch (error) {
      console.error(
        "Error fetching user stats:",
        error.response?.data || error
      );
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

// Fetch followers
export const fetchFollowers = createAsyncThunk(
  "user/fetchFollowers",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(`/users/followers/${userId}`);
      return response.data.data.followers;
    } catch (error) {
      console.error("Error fetching followers:", error.response?.data || error);
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

// Fetch following
export const fetchFollowing = createAsyncThunk(
  "user/fetchFollowing",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(`/users/following/${userId}`);
      return response.data.data.following;
    } catch (error) {
      console.error("Error fetching following:", error.response?.data || error);
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

// Update user info
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetcher.put("/users/profile", data);
      return response.data.data.user;
    } catch (error) {
      console.error("Error updating user:", error.response?.data || error);
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

// Update avatar image
export const changeImageApi = createAsyncThunk(
  "user/changeImage",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetcher.put("/users/upload-avatar", formData);
      return response.data.user;
    } catch (error) {
      console.error("Error uploading avatar:", error.response?.data || error);
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

// Follow user
export const followUser = createAsyncThunk(
  "user/followUser",
  async (targetId, { rejectWithValue, dispatch, getState }) => {
    try {
      const state = getState();
      const viewer = state.user.user;

      // Cập nhật tạm danh sách đang theo dõi của người dùng đăng nhập
      if (viewer && Array.isArray(state.user.viewerFollowing)) {
        const alreadyFollowing = state.user.viewerFollowing.some(
          (u) => u._id === targetId
        );
        if (!alreadyFollowing) {
          const updatedFollowing = [
            ...state.user.viewerFollowing,
            { _id: targetId },
          ];
          dispatch({
            type: "user/updateViewerFollowing",
            payload: updatedFollowing,
          });
        }
      }

      const response = await fetcher.put(`/users/follow/${targetId}`);
      return { success: true, data: response.data };
    } catch (error) {
      // Nếu thất bại, rollback
      const state = getState();
      const viewer = state.user.user;
      const rolledBack = state.user.viewerFollowing.filter(
        (u) => u._id !== targetId
      );
      dispatch({ type: "user/updateViewerFollowing", payload: rolledBack });

      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Unfollow user
export const unfollowUser = createAsyncThunk(
  "user/unfollowUser",
  async (targetId, { rejectWithValue, dispatch, getState }) => {
    try {
      const state = getState();
      const viewer = state.user.user;

      if (viewer && Array.isArray(state.user.viewerFollowing)) {
        const updatedFollowing = state.user.viewerFollowing.filter(
          (u) => u._id !== targetId
        );
        dispatch({
          type: "user/updateViewerFollowing",
          payload: updatedFollowing,
        });
      }

      const response = await fetcher.put(`/users/unfollow/${targetId}`);
      return { success: true, data: response.data };
    } catch (error) {
      const state = getState();
      const viewer = state.user.user;
      const rolledBack = [...state.user.viewerFollowing, { _id: targetId }];
      dispatch({ type: "user/updateViewerFollowing", payload: rolledBack });

      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null, // người dùng đăng nhập
    author: null, // tác giả đang được xem
    stats: null, // stats của tác giả
    followers: [], // followers của tác giả
    authorFollowing: [], // tác giả đang theo dõi ai
    viewerFollowing: [], // người dùng đăng nhập đang theo dõi ai
    isLoading: false,
    isError: false,
    errorMessage: null,
  },
  reducers: {
    updateViewerFollowing: (state, action) => {
      state.viewerFollowing = action.payload;
    },
    updateAuthorFollowing: (state, action) => {
      state.authorFollowing = action.payload;
    },
    updateFollowers: (state, action) => {
      state.followers = action.payload;
    },
    updateStats: (state, { payload }) => {
      state.stats = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isError = false;
        state.user = payload;
      })
      .addCase(fetchUser.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = payload;
      })
      .addCase(fetchAuthorById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(fetchAuthorById.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isError = false;
        state.author = payload;
      })
      .addCase(fetchAuthorById.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = payload || "Không thể tải thông tin tác giả";
      })
      .addCase(fetchUserStats.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchUserStats.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isError = false;
        state.stats = payload;
      })
      .addCase(fetchUserStats.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = payload || "Không thể tải số liệu tác giả";
      })
      .addCase(fetchFollowers.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchFollowers.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isError = false;
        state.followers = payload;
      })
      .addCase(fetchFollowers.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage =
          payload || "Không thể tải danh sách người theo dõi";
      })
      .addCase(fetchFollowing.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchFollowing.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isError = false;
        // Không gán trực tiếp vào state để tránh ghi đè
      })
      .addCase(fetchFollowing.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = payload || "Không thể tải danh sách đang theo dõi";
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updateUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isError = false;
        state.user = payload;
      })
      .addCase(updateUser.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = payload;
      })
      .addCase(changeImageApi.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(changeImageApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload;
      })
      .addCase(changeImageApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = payload || "Lỗi khi upload ảnh";
      })
      .addCase(followUser.pending, (state) => {
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(followUser.fulfilled, (state, { payload }) => {
        state.isError = false;
      })
      .addCase(followUser.rejected, (state, { payload }) => {
        state.isError = true;
        state.errorMessage = payload || "Lỗi khi theo dõi người dùng";
      })
      .addCase(unfollowUser.pending, (state) => {
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(unfollowUser.fulfilled, (state, { payload }) => {
        state.isError = false;
      })
      .addCase(unfollowUser.rejected, (state, { payload }) => {
        state.isError = true;
        state.errorMessage = payload || "Lỗi khi bỏ theo dõi người dùng";
      });
  },
});

export const {
  updateViewerFollowing,
  updateAuthorFollowing,
  updateFollowers,
  updateStats,
} = userSlice.actions;
export default userSlice.reducer;
