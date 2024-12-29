/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    isAuthenticated: false,
    user: {},
    error: null,
    message: null,
    downloadMessage: null,
  },
  reducers: {
    registerRequest(state, action) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
      state.error = null;
      state.message = null;
    },
    registerSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.error = null;
      state.message = action.payload.message;
    },
    registerFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.error = action.payload;
      state.message = null;
    },
    loginRequest(state, action) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
      state.error = null;
      state.message = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.error = null;
      state.message = action.payload.message;
    },
    loginFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.error = action.payload;
      state.message = null;
    },
    fetchUserRequest(state, action) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
      state.error = null;
    },
    fetchUserSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    fetchUserFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.error = action.payload;
    },
    logoutSuccess(state, action) {
      state.isAuthenticated = false;
      state.user = {};
      state.error = null;
    },
    logoutFailed(state, action) {
      state.isAuthenticated;
      state.user;
      state.error = action.payload;
    },
    clearAllErrors(state, action) {
      state.error = null;
      state.user;
    },
    addBookmarkSuccess(state, action) {
      state.user.bookmarks.push(action.payload); // Add job to bookmarks
    },
    removeBookmarkSuccess(state, action) {
      state.user.bookmarks = state.user.bookmarks.filter(
        (jobId) => jobId !== action.payload // Correct if bookmarks are job IDs
      );
    },
    addStarSuccess(state, action) {
      state.user.roadmaps.push(action.payload); // Add roadmap to roadmaps
    },
    removeStarSuccess(state, action) {
      state.user.roadmaps = state.user.roadmaps.filter(
        (roadmapId) => roadmapId !== action.payload // Correct if roadmarks are roadmaps IDs
      );
    },
    bookmarkFailed(state, action) {
      state.error = action.payload;
    },
    roadmapFailed(state, action){
      state.error = action.payload;
    },
    deleteAccountRequest(state) {
      state.loading = true;
  },
  deleteAccountSuccess(state) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.error = null;
  },
  deleteAccountFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
  },
  // Download operations
  downloadRoadmapRequest(state) {
    state.loading = true;
    state.downloadMessage = null;
    state.error = null;
  },
  downloadRoadmapSuccess(state, action) {
    state.loading = false;
    state.downloadMessage = action.payload;
    state.error = null;
  },
  downloadRoadmapFailed(state, action) {
    state.loading = false;
    state.downloadMessage = null;
    state.error = action.payload;
  },
  },
});

export const register = (data) => async (dispatch) => {
  dispatch(userSlice.actions.registerRequest());
  try {
    const response = await axios.post(
      "https://www.backend.vitaminjob.com/api/v1/user/register",
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    dispatch(userSlice.actions.registerSuccess(response.data));
  } catch (error) {
    // More robust error handling
    const errorMessage = error.response?.data?.message || "Registration Failed";
    dispatch(userSlice.actions.registerFailed(errorMessage));
  }
};

export const login = (data) => async (dispatch) => {
  dispatch(userSlice.actions.loginRequest());
  try {
    const response = await axios.post(
      "https://www.backend.vitaminjob.com/api/v1/user/login",
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    dispatch(userSlice.actions.loginSuccess(response.data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Login failed";
    dispatch(userSlice.actions.loginFailed(errorMessage));
  }
};

export const getUser = () => async (dispatch) => {
  dispatch(userSlice.actions.fetchUserRequest());
  try {
    const response = await axios.get(
      "https://www.backend.vitaminjob.com/api/v1/user/getuser",
      {
        withCredentials: true,
      }
    );
    dispatch(userSlice.actions.fetchUserSuccess(response.data.user));
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(userSlice.actions.fetchUserFailed(error.response.data.message));
  }
};
export const logout = () => async (dispatch) => {
  try {
    const response = await axios.get(
      "https://www.backend.vitaminjob.com/api/v1/user/logout",
      {
        withCredentials: true,
      }
    );
    dispatch(userSlice.actions.logoutSuccess());
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(userSlice.actions.logoutFailed(error.response.data.message));
  }
};
export const addBookmark = (jobId) => async (dispatch) => {
  try {
    // Send jobId as a query parameter in the request
    await axios.post(
      `https://www.backend.vitaminjob.com/api/v1/user/bookmarks/add?jobId=${jobId}`,
      {},
      { withCredentials: true }
    );

    dispatch(userSlice.actions.addBookmarkSuccess(jobId));
  } catch (error) {
    const errorMessage = error?.response?.data?.message || "Login to add bookmark";
      dispatch(userSlice.actions.bookmarkFailed(errorMessage));
  }
};


export const removeBookmark = (jobId) => async (dispatch) => {
  try {
    // Pass jobId as a query parameter
    await axios.delete(
      `https://www.backend.vitaminjob.com/api/v1/user/bookmarks/remove?jobId=${jobId}`,
      { withCredentials: true }
    );

    dispatch(userSlice.actions.removeBookmarkSuccess(jobId));
  } catch (error) {
    const errorMessage = error?.response?.data?.message || "Failed to add bookmark";
    dispatch(userSlice.actions.bookmarkFailed(errorMessage));
  }
};
export const addStar = (roadmapId) => async (dispatch) => {
  try {
    // Send roadmapId as a query parameter in the request
    await axios.post(
      `https://www.backend.vitaminjob.com/api/v1/user/roadmaps/add?roadmapId=${roadmapId}`,
      {},
      { withCredentials: true }
    );

    dispatch(userSlice.actions.addStarSuccess(roadmapId));
  } catch (error) {
    const errorMessage = error?.response?.data?.message || "Login to star roadmap";
      dispatch(userSlice.actions.roadmapFailed(errorMessage));
  }
};


export const removeStar = (roadmapId) => async (dispatch) => {
  try {
    // Pass roadmapId as a query parameter
    await axios.delete(
      `https://www.backend.vitaminjob.com/api/v1/user/roadmaps/remove?roadmapId=${roadmapId}`,
      { withCredentials: true }
    );

    dispatch(userSlice.actions.removeStarSuccess(roadmapId));
  } catch (error) {
    const errorMessage = error?.response?.data?.message || "Failed to star roadmap";
    dispatch(userSlice.actions.roadmapFailed(errorMessage));
  }
};

export const downloadRoadmap = (roadmapId, filename) => async (dispatch) => {
  dispatch(userSlice.actions.downloadRoadmapRequest());
  try {
    const response = await axios.get(
      `https://www.backend.vitaminjob.com/api/v1/user/roadmap/download/${roadmapId}`,
      {
        withCredentials: true,
      }
    );

    if (!response.data.url) {
      throw new Error('PDF URL not found');
    }

    dispatch(userSlice.actions.downloadRoadmapSuccess('Download started successfully'));
    window.open(response.data.url, '_blank');
  } catch (error) {
    const errorMessage = "Please login to download roadmaps";  // Changed error message
    dispatch(userSlice.actions.downloadRoadmapFailed(errorMessage));
    throw error;
  }
};
export const deleteAccount = (password) => async (dispatch) => {
  dispatch(userSlice.actions.deleteAccountRequest());
  try {
      const response = await axios.delete(
          "https://www.backend.vitaminjob.com/api/v1/user/delete",
          {
              data: { password },
              withCredentials: true,
          }
      );
      dispatch(userSlice.actions.deleteAccountSuccess());
  } catch (error) {
      const errorMessage = error?.response?.data?.message || "Failed to delete account";
      dispatch(userSlice.actions.deleteAccountFailed(errorMessage));
  }
};

export const clearAllUserErrors = () => (dispatch) => {
  dispatch(userSlice.actions.clearAllErrors());
};
export { userSlice };  // Export the slice itself
export default userSlice.reducer;