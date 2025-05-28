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

// Fetch all Blog
export const fetchBlogsApi = createAsyncThunk(
  "blogs/fetchAll",
  async (params = { page: 1, limit: 10 }, { getState, rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, tag, slug, sortBy, sortOrder } = params;
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      if (tag) queryParams.append('tag', tag);
      if (slug) queryParams.append('slug', slug);
      if (sortBy) queryParams.append('sortBy', sortBy);
      if (sortOrder) queryParams.append('sortOrder', sortOrder);

      const response = await fetcher.get(`/blogs?${queryParams.toString()}`);
      const currentUserId = getState().auth.currentUser?.userId;
      const { blogs, total, currentPage, totalPages } = response.data.data;

      const normalizedBlogs = blogs
        .filter((blog) => !blog.isDeleted && !blog.isHidden)
        .map((blog) => normalizeBlog(blog, currentUserId));

      return {
        blogs: normalizedBlogs,
        pagination: {
          total,
          currentPage,
          totalPages,
          limit
        }
      };
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : { message: error.message }
      );
    }
  }
);

// Fetch a single blog by slug
export const fetchBlogBySlugApi = createAsyncThunk(
  "blogs/fetchBySlug",
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

// Create a new blog
export const createBlogApi = createAsyncThunk(
  "blogs/create",
  async (blogData, { getState, rejectWithValue }) => {
    try {
      const currentUserId = getState().auth.currentUser?.userId;
      const response = await fetcher.post("/blogs", {
        title: blogData.title,
        description: blogData.description,
        image: blogData.imageUrl ? [blogData.imageUrl] : [],
        tags: blogData.tags.map((tag) => ({ tagId: tag, tagName: tag })),
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

// Like or unlike a blog
export const toggleLikeBlogApi = createAsyncThunk(
  "blogs/toggleLike",
  async (blogId, { getState, rejectWithValue }) => {
    try {
      const response = await fetcher.post(`/blogs/${blogId}/like`);
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


// Add a comment to a blog
export const addCommentApi = createAsyncThunk(
  "blogs/addComment",
  async ({ blogId, commentText }, { getState, rejectWithValue }) => {
    try {
      const currentUserId = getState().auth.currentUser?.userId;
      const response = await fetcher.post(`/blogs/${blogId}/comment`, {
        comment: commentText,
      });
      const comment = response.data.data;
      return {
        blogId,
        commentId: comment._id,
        commentData: {
          text: comment.text,
          author: {
            id: comment.author._id,
            name: comment.author.name || comment.author.email.split("@")[0],
          },
          createdAt: comment.createdAt,
        },
      };
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : { message: error.message }
      );
    }
  }
);
const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    blogs: [],
    selectedBlog: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      total: 0,
      limit: 10
    },
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateLike: (state, { payload }) => {
      const { blogId, isLiked, likeCount } = payload;
      const blog =
        state.blogs.find((b) => b.id === blogId) || state.selectedBlog;
      if (blog) {
        blog.isLiked = isLiked;
        blog.likeCount = likeCount;
      }
    },
    addComment: (state, { payload }) => {
      if (state.selectedBlog && state.selectedBlog.id === payload.blogId) {
        state.selectedBlog.comments = [
          payload.comment,
          ...state.selectedBlog.comments,
        ];
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch all blogs
    builder.addCase(fetchBlogsApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchBlogsApi.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.blogs = payload.blogs;
      state.pagination = payload.pagination;
      state.error = null;
    });
    builder.addCase(fetchBlogsApi.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
      toast.error(payload?.message || "Không thể tải bài viết");
    });

    // Fetch single blog
    builder.addCase(fetchBlogBySlugApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchBlogBySlugApi.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.selectedBlog = payload;
      state.error = null;
    });
    builder.addCase(fetchBlogBySlugApi.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
      toast.error(payload?.message || "Không thể tải bài viết");
    });

    // Create blog
    builder.addCase(createBlogApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createBlogApi.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.blogs = [payload, ...state.blogs];
      state.error = null;
      toast.success("Tạo bài viết thành công");
    });
    builder.addCase(createBlogApi.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
      toast.error(payload?.message || "Không thể tạo bài viết");
    });

    // Toggle like
    builder.addCase(toggleLikeBlogApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(toggleLikeBlogApi.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      const blog =
        state.blogs.find((b) => b.id === payload.id) || state.selectedBlog;
      if (blog) {
        blog.isLiked = payload.isLiked;
        blog.likeCount = payload.likeCount;
      }
      state.error = null;
    });
    builder.addCase(toggleLikeBlogApi.rejected, (state, { payload }) => {
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
      if (state.selectedBlog && state.selectedBlog.id === payload.blogId) {
        state.selectedBlog.comments = [
          payload.comment,
          ...state.selectedBlog.comments,
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

export const { clearError, updateLike, addComment } = blogSlice.actions;
export default blogSlice.reducer;
