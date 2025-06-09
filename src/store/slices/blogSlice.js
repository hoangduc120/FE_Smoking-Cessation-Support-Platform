import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import fetcher from "../../apis/fetcher";

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
  comments: (blog.comments || []).map((comment, index) => ({
    id: comment._id || `fallback-${index}-${blog._id}`,
    text: comment.text || "Không có nội dung",
    author: {
      id: comment.author?._id || "unknown",
      name:
        comment.author?.name ||
        comment.author?.email?.split("@")[0] ||
        "Người dùng",
      avatar: comment.author?.avatar || "/placeholder.svg",
    },
    createdAt: comment.createdAt || new Date().toISOString(),
  })),
});

export const fetchBlogsApi = createAsyncThunk(
  "blogs/fetchAll",
  async (params = { page: 1, limit: 10 }, { getState, rejectWithValue }) => {
    try {
      const {
        page = 1,
        limit = 10,
        tag,
        slug,
        search,
        sortBy,
        sortOrder,
      } = params;
      const queryParams = new URLSearchParams();
      queryParams.append("page", page);
      queryParams.append("limit", limit);
      if (tag) queryParams.append("tag", tag);
      if (slug) queryParams.append("slug", slug);
      if (search) queryParams.append("search", search);
      if (sortBy) queryParams.append("sortBy", sortBy);
      if (sortOrder) queryParams.append("sortOrder", sortOrder);

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
          limit,
        },
      };
    } catch (error) {
      return rejectWithValue(
        error.response
          ? error.response.data
          : { message: error.message || "Không thể tải dữ liệu blog" }
      );
    }
  }
);

// Fetch blogs by user ID
export const fetchBlogsByUserApi = createAsyncThunk(
  "blogs/fetchByUser",
  async ({ userId, page = 1, limit = 10 }, { getState, rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("page", page);
      queryParams.append("limit", limit);

      const response = await fetcher.get(
        `/blogs/user/${userId}?${queryParams.toString()}`
      );
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
          limit,
        },
      };
    } catch (error) {
      return rejectWithValue(
        error.response
          ? error.response.data
          : {
              message: error.message || "Không thể tải bài viết của người dùng",
            }
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
      console.log("Đang thực hiện like blog với ID:", blogId);

      // Đảm bảo tương thích với cả _id và id
      const response = await fetcher.post(`/blogs/${blogId}/like`);
      const currentUserId = getState().auth.currentUser?.userId;
      const blog = response.data.data;

      console.log("Kết quả like:", blog);

      return {
        id: blog._id,
        isLiked: blog.likes?.includes(currentUserId) || false,
        likeCount: blog.likes?.length || 0,
      };
    } catch (error) {
      console.error("Lỗi khi like blog:", error);
      return rejectWithValue(
        error.response
          ? error.response.data
          : { message: error.message || "Không thể cập nhật lượt thích" }
      );
    }
  }
);

// Add a comment to a blog
export const addCommentApi = createAsyncThunk(
  "blogs/addComment",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const blogId = payload.blogId || payload;
      const commentText = payload.comment || payload;

      const currentUserId = getState().auth.currentUser?.userId;
      const response = await fetcher.post(`/blogs/${blogId}/comment`, {
        comment: commentText,
      });
      const comment = response.data.data;
      return {
        blogId,
        comment: {
          id: comment._id || `temp-${Date.now()}`,
          text: comment.text,
          author: {
            id: comment.author?._id || currentUserId,
            name:
              comment.author?.name ||
              comment.author?.email?.split("@")[0] ||
              "Người dùng",
            avatar: comment.author?.avatar || "/placeholder.svg",
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
      limit: 10,
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

      // Tìm blog trong blogs array
      const blogInList = state.blogs.find(
        (b) => b.id === blogId || b._id === blogId
      );

      // Cập nhật blog trong danh sách nếu tìm thấy
      if (blogInList) {
        blogInList.isLiked = isLiked;
        blogInList.likeCount = likeCount;
      }

      // Cập nhật selectedBlog nếu là blog đang xem
      if (
        state.selectedBlog &&
        (state.selectedBlog.id === blogId || state.selectedBlog._id === blogId)
      ) {
        state.selectedBlog.isLiked = isLiked;
        state.selectedBlog.likeCount = likeCount;
      }
    },
    addComment: (state, { payload }) => {
      if (state.selectedBlog && state.selectedBlog.id === payload.blogId) {
        state.selectedBlog.comments = [
          payload.comment,
          ...(state.selectedBlog.comments || []),
        ];
      }
    },
  },
  extraReducers: (builder) => {
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

    // New extra reducers for fetchBlogsByUserApi
    builder.addCase(fetchBlogsByUserApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchBlogsByUserApi.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.blogs = payload.blogs;
      state.pagination = payload.pagination;
      state.error = null;
    });
    builder.addCase(fetchBlogsByUserApi.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
      toast.error(payload?.message || "Không thể tải bài viết của người dùng");
    });

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

    builder.addCase(toggleLikeBlogApi.pending, (state) => {});
    builder.addCase(toggleLikeBlogApi.fulfilled, (state, { payload }) => {
      const blog = state.blogs.find(
        (b) => b.id === payload.id || b._id === payload.id
      );

      if (blog) {
        blog.isLiked = payload.isLiked;
        blog.likeCount = payload.likeCount;
      }

      if (
        state.selectedBlog &&
        (state.selectedBlog.id === payload.id ||
          state.selectedBlog._id === payload.id)
      ) {
        state.selectedBlog.isLiked = payload.isLiked;
        state.selectedBlog.likeCount = payload.likeCount;
      }

      state.error = null;
    });
    builder.addCase(toggleLikeBlogApi.rejected, (state, { payload }) => {
      state.error = payload;
      toast.error(payload?.message || "Không thể cập nhật lượt thích");
    });

    builder.addCase(addCommentApi.pending, (state) => {
      state.isLoading = false;
    });
    builder.addCase(addCommentApi.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      if (state.selectedBlog && state.selectedBlog.id === payload.blogId) {
        console.log("Current comments:", state.selectedBlog.comments);
        state.selectedBlog.comments = [
          payload.comment,
          ...state.selectedBlog.comments.filter(
            (c) => !c.id || !c.id.startsWith("temp-")
          ),
        ];
      }
      state.error = null;
    });
    builder.addCase(addCommentApi.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
      if (payload?.blogId && payload?.commentId) {
        state.selectedBlog.comments = state.selectedBlog.comments.filter(
          (comment) => comment.id !== payload.commentId
        );
      }
      toast.error(payload?.message || "Không thể thêm bình luận");
    });
  },
});

export const { clearError, updateLike, addComment } = blogSlice.actions;
export default blogSlice.reducer;
