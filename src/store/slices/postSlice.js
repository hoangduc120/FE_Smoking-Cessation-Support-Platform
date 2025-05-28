import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { fetcher } from "../../apis/fetcher";

// Normalize blog data to match frontend expectations
const normalizeBlog = (blog, currentUserId) => ({
  id: blog._id,
  slug: blog.slug,
  title: blog.title,
  description: blog.description || "Không có nội dung",
  imageUrl: blog.image?.[0] || "/placeholder.svg?height=400&width=600",
  tags: blog.tags?.map((tag) => tag.tagName) || [],
  createdAt: blog.createdAt,
  authorId: blog.user?._id || "unknown",
  authorName: blog.user?.email?.split("@")[0] || "Người dùng ẩn danh",
  avatar: "/placeholder.svg?height=40&width=40",
  likeCount: blog.likes?.length || 0,
  isLiked: currentUserId ? blog.likes?.includes(currentUserId) : false,
  comments: blog.comments || [],
});

// Fetch all posts
export const fetchPostsApi = createAsyncThunk(
  "posts/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await fetcher.get("/blogs");
      const currentUserId = getState().auth.currentUser?.userId;
      const normalizedBlogs = response.data.data.blogs
        .filter((blog) => !blog.isDeleted && !blog.isHidden)
        .map((blog) => normalizeBlog(blog, currentUserId));
      return normalizedBlogs;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : { message: error.message }
      );
    }
  }
);

// Fetch a single post by slug
export const fetchPostBySlugApi = createAsyncThunk(
  "posts/fetchBySlug",
  async (slug, { getState, rejectWithValue }) => {
    try {
      const response = await fetcher.get(`/blogs/${slug}`);
      const currentUserId = getState().auth.currentUser?.userId;
      const normalizedBlog = normalizeBlog(response.data.data, currentUserId);
      return normalizedBlog;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : { message: error.message }
      );
    }
  }
);

// Create a new post
export const createPostApi = createAsyncThunk(
  "posts/create",
  async (postData, { getState, rejectWithValue }) => {
    try {
      const currentUserId = getState().auth.currentUser?.userId;
      const response = await fetcher.post("/blogs", {
        title: postData.title,
        description: postData.description,
        image: postData.imageUrl ? [postData.imageUrl] : [],
        tags: postData.tags.map((tag) => ({ tagId: tag, tagName: tag })),
        user: currentUserId,
      });
      const normalizedBlog = normalizeBlog(response.data.data, currentUserId);
      return normalizedBlog;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : { message: error.message }
      );
    }
  }
);

// Like or unlike a post
export const toggleLikePostApi = createAsyncThunk(
  "posts/toggleLike",
  async (postId, { getState, rejectWithValue }) => {
    try {
      const response = await fetcher.post(`/blogs/${postId}/like`);
      const currentUserId = getState().auth.currentUser?.userId;
      const blog = response.data.data;
      return {
        id: blog._id,
        isLiked: blog.likes?.includes(currentUserId) || false,
        likeCount: blog.likes?.length || 0,
      };
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : { message: error.message }
      );
    }
  }
);

// Add a comment to a post
export const addCommentApi = createAsyncThunk(
  "posts/addComment",
  async (postId, { getState, rejectWithValue }) => {
    try {
      const currentUserId = getState().auth.currentUser?.userId;
      const response = await fetcher.post(`blogs/${postId}/comment`);
      const comment = response.data;
      return {
        userId: currentUserId,
        commentId: comment.id,
        commentData: comment.text,
      };
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : { message: error.message }
      );
    }
  }
);
const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    selectedPost: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateLike: (state, { payload }) => {
      const { postId, isLiked, likeCount } = payload;
      const post =
        state.posts.find((p) => p.id === postId) || state.selectedPost;
      if (post) {
        post.isLiked = isLiked;
        post.likeCount = likeCount;
      }
    },
    addComment: (state, { payload }) => {
      if (state.selectedPost && state.selectedPost.id === payload.postId) {
        state.selectedPost.comments = [
          payload.comment,
          ...state.selectedPost.comments,
        ];
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch all posts
    builder.addCase(fetchPostsApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchPostsApi.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.posts = payload;
      state.error = null;
    });
    builder.addCase(fetchPostsApi.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
      toast.error(payload?.message || "Không thể tải bài viết");
    });

    // Fetch single post
    builder.addCase(fetchPostBySlugApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchPostBySlugApi.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.selectedPost = payload;
      state.error = null;
    });
    builder.addCase(fetchPostBySlugApi.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
      toast.error(payload?.message || "Không thể tải bài viết");
    });

    // Create post
    builder.addCase(createPostApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createPostApi.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.posts = [payload, ...state.posts];
      state.error = null;
      toast.success("Tạo bài viết thành công");
    });
    builder.addCase(createPostApi.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
      toast.error(payload?.message || "Không thể tạo bài viết");
    });

    // Toggle like
    builder.addCase(toggleLikePostApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(toggleLikePostApi.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      const post =
        state.posts.find((p) => p.id === payload.id) || state.selectedPost;
      if (post) {
        post.isLiked = payload.isLiked;
        post.likeCount = payload.likeCount;
      }
      state.error = null;
    });
    builder.addCase(toggleLikePostApi.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
      toast.error(payload?.message || "Không thể cập nhật lượt thích");
    });

    // Add comment
    builder.addCase(addCommentApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addCommentApi.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      if (state.selectedPost && state.selectedPost.id === payload.postId) {
        state.selectedPost.comments = [
          payload.comment,
          ...state.selectedPost.comments,
        ];
      }
      state.error = null;
      toast.success("Thêm bình luận thành công");
    });
    builder.addCase(addCommentApi.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
      toast.error(payload?.message || "Không thể thêm bình luận");
    });
  },
});

export const { clearError, updateLike, addComment } = postSlice.actions;
export default postSlice.reducer;
