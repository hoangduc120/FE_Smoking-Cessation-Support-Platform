import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";

// Fetch user profile
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
        console.log("No user data, using fallback for userId:", userId);
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
      console.log("Fetched author:", normalizedUser.name);
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
      console.log("User stats fetched successfully:", response.data.data.stats);
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
      const followers = response.data.data.followers.map((user) => user._id);
      console.log("Fetched followers IDs:", followers);
      return followers;
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
      const following = response.data.data.following.map((user) => user._id);
      console.log("Fetched following IDs:", following);
      return following;
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

export const followUser = createAsyncThunk(
  "user/followUser",
  async (id, { rejectWithValue, dispatch, getState }) => {
    try {
      const state = getState();
      const userId = state.user.user?._id;
      if (userId && Array.isArray(state.user.following)) {
        if (!state.user.following.includes(id)) {
          const updatedFollowing = [...state.user.following, id];
          dispatch({ type: 'user/updateFollowing', payload: updatedFollowing });
        }
      }

      const currentStats = state.user.stats || { followersCount: 0, followingCount: 0 };
      const updatedStats = {
        ...currentStats,
        followersCount: currentStats.followersCount + 1
      };
      dispatch({ type: 'user/updateStats', payload: updatedStats });

      const response = await fetcher.put(`/users/follow/${id}`);
      console.log("Follow user response:", response.data);

      return { success: true, data: response.data };
    } catch (error) {
      const state = getState();
      const userId = state.user.user?._id;
      if (userId && Array.isArray(state.user.following)) {
        const revertedFollowing = state.user.following.filter(followingId => followingId !== id);
        dispatch({ type: 'user/updateFollowing', payload: revertedFollowing });
      }

      const currentStats = state.user.stats || { followersCount: 0, followingCount: 0 };
      const revertedStats = {
        ...currentStats,
        followersCount: Math.max(0, currentStats.followersCount - 1)
      };
      dispatch({ type: 'user/updateStats', payload: revertedStats });

      console.error("Error following user:", error.response?.data || error);
      return rejectWithValue(
        error.response
          ? error.response.data.message || error.message
          : error.message
      );
    }
  }
);

export const unfollowUser = createAsyncThunk(
  "user/unfollow",
  async (id, { rejectWithValue, dispatch, getState }) => {
    try {
      const state = getState();
      const userId = state.user.user?._id;
      if (userId && Array.isArray(state.user.following)) {
        const updatedFollowing = state.user.following.filter(followingId => followingId !== id);
        dispatch({ type: 'user/updateFollowing', payload: updatedFollowing });
      }

      const currentStats = state.user.stats || { followersCount: 0, followingCount: 0 };
      const updatedStats = {
        ...currentStats,
        followersCount: Math.max(0, currentStats.followersCount - 1)
      };
      dispatch({ type: 'user/updateStats', payload: updatedStats });

      const response = await fetcher.put(`/users/unfollow/${id}`);
      console.log("Unfollow user response:", response.data);

      return { success: true, data: response.data };
    } catch (error) {
      const state = getState();
      const userId = state.user.user?._id;
      if (userId && Array.isArray(state.user.following)) {
        if (!state.user.following.includes(id)) {
          const revertedFollowing = [...state.user.following, id];
          dispatch({ type: 'user/updateFollowing', payload: revertedFollowing });
        }
      }

      const currentStats = state.user.stats || { followersCount: 0, followingCount: 0 };
      const revertedStats = {
        ...currentStats,
        followersCount: currentStats.followersCount + 1
      };
      dispatch({ type: 'user/updateStats', payload: revertedStats });

      console.error("Error unfollowing user:", error.response?.data || error);
      return rejectWithValue(
        error.response
          ? error.response.data.message || error.message
          : error.message
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    author: null,
    followers: [],
    following: [],
    stats: { followersCount: 0, followingCount: 0 },
    isLoading: false,
    isError: false,
    errorMessage: null,
  },
  reducers: {
    updateFollowing: (state, { payload }) => {
      state.following = payload;
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
        state.following = payload;
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
        // Không set isLoading để tránh reload trang
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(followUser.fulfilled, (state, { payload }) => {
        // UI đã được cập nhật optimistic rồi, không cần làm gì thêm
        state.isError = false;
      })
      .addCase(followUser.rejected, (state, { payload }) => {
        // Optimistic updates đã được revert trong thunk
        state.isError = true;
        state.errorMessage = payload || "Lỗi khi theo dõi người dùng";
      })
      .addCase(unfollowUser.pending, (state) => {
        // Không set isLoading để tránh reload trang
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(unfollowUser.fulfilled, (state, { payload }) => {
        // UI đã được cập nhật optimistic rồi, không cần làm gì thêm
        state.isError = false;
      })
      .addCase(unfollowUser.rejected, (state, { payload }) => {
        // Optimistic updates đã được revert trong thunk
        state.isError = true;
        state.errorMessage = payload || "Lỗi khi bỏ theo dõi người dùng";
      });
  },
});

export const { updateFollowing, updateStats } = userSlice.actions;
export default userSlice.reducer;
