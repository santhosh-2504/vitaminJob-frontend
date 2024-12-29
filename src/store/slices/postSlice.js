import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
    loading: false,
    error: null,
    message: null,
    singlePost: {},
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
    likedPosts: [],
    commentError: null,
    commentLoading: false,
  },
  reducers: {
    getAllPostsRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    getAllPostsSuccess(state, action) {
      state.loading = false;
      state.posts = action.payload.posts;
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
      state.totalPosts = action.payload.totalPosts;
      state.error = null;
      state.message = action.payload.message;
    },
    getAllPostsAppendSuccess(state, action) {
      state.loading = false;
      state.posts = [...state.posts, ...action.payload.posts];
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
      state.totalPosts = action.payload.totalPosts;
      state.error = null;
      state.message = action.payload.message;
    },
    getAllPostsFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },

    getSinglePostRequest(state) {
      state.loading = true;
      state.error = null;
    },
    getSinglePostSuccess(state, action) {
      state.loading = false;
      state.singlePost = action.payload.post;
      state.error = null;
    },
    getSinglePostFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    
    toggleLikeSuccess(state, action) {
      const { postId, userId } = action.payload;
      if (state.singlePost && state.singlePost._id === postId) {
        const likes = [...(state.singlePost.likes || [])];
        const isLiked = likes.includes(userId);
        
        state.singlePost.likes = isLiked
          ? likes.filter(id => id !== userId)
          : [...likes, userId];
      }
    },

    addCommentRequest(state) {
      state.commentLoading = true;
      state.commentError = null;
    },
    addCommentSuccess(state, action) {
      const { post } = action.payload;
      if (state.singlePost && state.singlePost._id === post._id) {
        state.singlePost = post;
      }
      state.commentError = null;
    },
    addCommentFailed(state, action) {
      state.commentError = action.payload;
    },

    getLikedPostsRequest(state) {
      state.loading = true;
    },
    getLikedPostsSuccess(state, action) {
      state.loading = false;
      state.likedPosts = action.payload.posts;
    },
    getLikedPostsFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    clearErrors(state) {
      state.error = null;
      state.message = null;
    },

    editCommentRequest(state) {
      state.loading = true;
    },
    editCommentSuccess(state, action) {
      state.loading = false;
      const { postId, commentId, content } = action.payload;
      
      const post = state.posts.find(p => p._id === postId);
      if (post) {
        const comment = post.comments.find(c => c._id === commentId);
        if (comment) {
          comment.content = content;
        }
      }

      if (state.singlePost._id === postId) {
        const comment = state.singlePost.comments.find(c => c._id === commentId);
        if (comment) {
          comment.content = content;
        }
      }
    },
    editCommentFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    deleteCommentRequest(state) {
      state.loading = true;
    },
    deleteCommentSuccess(state, action) {
      state.loading = false;
      const { postId, commentId } = action.payload;
      
      const post = state.posts.find(p => p._id === postId);
      if (post) {
        post.comments = post.comments.filter(c => c._id !== commentId);
      }

      if (state.singlePost._id === postId) {
        state.singlePost.comments = state.singlePost.comments.filter(
          c => c._id !== commentId
        );
      }
    },
    deleteCommentFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    incrementShareCountRequest(state) {
      state.loading = true;
    },
    incrementShareCountSuccess(state, action) {
      state.loading = false;
      const { postId } = action.payload;
      
      const post = state.posts.find(p => p._id === postId);
      if (post) {
        post.shareCount = (post.shareCount || 0) + 1;
      }

      if (state.singlePost._id === postId) {
        state.singlePost.shareCount = (state.singlePost.shareCount || 0) + 1;
      }
    },
    incrementShareCountFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const fetchPosts = ({ page = 1, limit = 4, searchKeyword = "" }) => async (dispatch) => {
  try {
    dispatch(postSlice.actions.getAllPostsRequest());
    let url = `http://localhost:4000/api/v1/post/posts?page=${page}&limit=${limit}`;
    if (searchKeyword) {
      url += `&searchKeyword=${searchKeyword}`;
    }

    const response = await axios.get(url, {
      withCredentials: true,
    });

    dispatch(postSlice.actions.getAllPostsSuccess(response.data));
  } catch (error) {
    dispatch(postSlice.actions.getAllPostsFailed(
      error.response?.data?.message || "Failed to fetch posts"
    ));
  }
};

export const fetchSinglePost = (postId) => async (dispatch) => {
  try {
    dispatch(postSlice.actions.getSinglePostRequest());
    const response = await axios.get(`http://localhost:4000/api/v1/post/posts/${postId}`, {
      withCredentials: true,
    });
    dispatch(postSlice.actions.getSinglePostSuccess(response.data));
  } catch (error) {
    dispatch(postSlice.actions.getSinglePostFailed(
      error.response?.data?.message || "Failed to fetch post"
    ));
  }
};

export const toggleLike = (postId) => async (dispatch, getState) => {
  try {
    const { user } = getState().user;
    
    const response = await axios.post(
      `http://localhost:4000/api/v1/post/posts/${postId}/like`,
      {},
      { withCredentials: true }
    );

    if (response.data.success) {
      dispatch(postSlice.actions.toggleLikeSuccess({
        postId,
        userId: user._id
      }));
    }
  } catch (error) {
    console.error("Failed to toggle like:", error);
  }
};

export const addComment = (postId, content) => async (dispatch) => {
  try {
    const response = await axios.post(
      `http://localhost:4000/api/v1/post/posts/${postId}/comment`,
      { content },
      { withCredentials: true }
    );
    
    if (response.data.success) {
      dispatch(postSlice.actions.addCommentSuccess({
        post: response.data.post
      }));
      return true;
    }
    return false;
  } catch (error) {
    dispatch(postSlice.actions.addCommentFailed(
      error.response?.data?.message || "Failed to add comment"
    ));
    return false;
  }
};

export const fetchLikedPosts = () => async (dispatch) => {
  try {
    dispatch(postSlice.actions.getLikedPostsRequest());
    const response = await axios.get(
      'http://localhost:4000/api/v1/post/posts/liked',
      { withCredentials: true }
    );
    dispatch(postSlice.actions.getLikedPostsSuccess(response.data));
  } catch (error) {
    dispatch(postSlice.actions.getLikedPostsFailed(
      error.response?.data?.message || "Failed to fetch liked posts"
    ));
  }
};

export const editComment = (postId, commentId, content) => async (dispatch) => {
  try {
    dispatch(postSlice.actions.editCommentRequest());
    // eslint-disable-next-line no-unused-vars
    const response = await axios.put(
      `http://localhost:4000/api/v1/post/posts/${postId}/comment/${commentId}`,
      { content },
      { withCredentials: true }
    );
    dispatch(postSlice.actions.editCommentSuccess({
      postId,
      commentId,
      content
    }));
  } catch (error) {
    dispatch(postSlice.actions.editCommentFailed(
      error.response?.data?.message || "Failed to edit comment"
    ));
  }
};

export const deleteComment = (postId, commentId) => async (dispatch) => {
  try {
    dispatch(postSlice.actions.deleteCommentRequest());
    await axios.delete(
      `http://localhost:4000/api/v1/post/posts/${postId}/comment/${commentId}`,
      { withCredentials: true }
    );
    dispatch(postSlice.actions.deleteCommentSuccess({
      postId,
      commentId
    }));
  } catch (error) {
    dispatch(postSlice.actions.deleteCommentFailed(
      error.response?.data?.message || "Failed to delete comment"
    ));
  }
};

export const incrementShareCount = (postId) => async (dispatch) => {
  try {
    dispatch(postSlice.actions.incrementShareCountRequest());
    const response = await axios.post(
      `http://localhost:4000/api/v1/post/posts/${postId}/share`,
      {},
      { withCredentials: true }
    );
    dispatch(postSlice.actions.incrementShareCountSuccess({
      postId,
      shareCount: response.data.shareCount
    }));
  } catch (error) {
    dispatch(postSlice.actions.incrementShareCountFailed(
      error.response?.data?.message || "Failed to increment share count"
    ));
  }
};

export const { clearErrors } = postSlice.actions;
export default postSlice.reducer;
