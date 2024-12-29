import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const roadmapSlice = createSlice({
  name: 'roadmap',
  initialState: {
    roadmaps: [],
    loading: false,
    error: null,
    message: null,
    currentPage: 1,
    totalPages: 1,
    totalRoadmaps: 0,
  },
  reducers: {
    // Get all roadmaps
    getAllRoadmapsRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    getAllRoadmapsSuccess(state, action) {
      state.loading = false;
      state.roadmaps = action.payload.roadmaps;
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
      state.totalRoadmaps = action.payload.totalRoadmaps;
      state.error = null;
      state.message = action.payload.message;
    },
    getAllRoadmapsFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
      state.roadmaps = [];
    },
    
    // Clear errors
    clearErrors(state) {
      state.error = null;
      state.message = null;
    }
  }
});

export const fetchRoadmaps = (niche, searchKeyword = "", page = 1) => async (dispatch) => {
  dispatch(roadmapSlice.actions.getAllRoadmapsRequest());
  try {
    let url = `http://localhost:4000/api/v1/roadmap/roadmap/all?page=${page}`;
    
    if (searchKeyword) {
      url += `&keyword=${searchKeyword}`;
    }
    if (niche && niche !== "All") {
      url += `&niche=${niche}`;
    }

    const response = await axios.get(url, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" }
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch roadmaps');
    }

    dispatch(roadmapSlice.actions.getAllRoadmapsSuccess(response.data));
  } catch (error) {
    console.error('Error fetching roadmaps:', error);
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        "Failed to fetch roadmaps";
    dispatch(roadmapSlice.actions.getAllRoadmapsFailed(errorMessage));
  }
};

export const clearRoadmapErrors = () => (dispatch) => {
  dispatch(roadmapSlice.actions.clearErrors());
};

export default roadmapSlice.reducer;