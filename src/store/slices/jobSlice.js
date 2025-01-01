import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    loading: false,
    error: null,
    message: null,
    singleJob: {},
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
    appliedJobs: [],
  }, 
  reducers: {
    requestForAllJobs(state) {
      state.loading = true;
      state.error = null;
    },
    failureForAllJobs(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    requestForSingleJob(state) {
      state.message = null;
      state.error = null;
      state.loading = true;
    },
    successForSingleJob(state, action) {
      state.loading = false;
      state.error = null;
      state.singleJob = action.payload;
    },
    failureForSingleJob(state, action) {
      state.singleJob;
      state.error = action.payload;
      state.loading = false;
    },
    clearAllErrors(state) {
      state.error = null;
      state.jobs;
    },
    resetJobSlice(state) {
      state.error = null;
      state.jobs;
      state.loading = false;
      state.message = null;
      state.singleJob = {};
    },
    successForAllJobs(state, action) {
      state.loading = false;
      state.jobs = action.payload.jobs;
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
      state.totalJobs = action.payload.totalJobs;
    },
    applyJobRequest(state) {
      state.loading = true;
    },
    applyJobSuccess(state, action) {
      state.loading = false;
      if (!state.appliedJobs.includes(action.payload)) {
        state.appliedJobs.push(action.payload);
      }
    },
    applyJobFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    setAppliedJobs(state, action) {
      state.appliedJobs = action.payload;
    },
  },
});

export const fetchJobs = (city, niche, searchKeyword = "", page = 1) => async (dispatch) => {
  try {
    dispatch(jobSlice.actions.requestForAllJobs());
    let link = "https://www.backend.vitaminjob.com/api/v1/job/getall?";
    let queryParams = [`page=${page}`];

    if (searchKeyword) {
      queryParams.push(`searchKeyword=${searchKeyword}`);
    }
    if (city && city !== "All") {
      queryParams.push(`city=${city}`);
    }
    if (niche && niche !== "All") {
      queryParams.push(`niche=${niche}`);
    }

    link += queryParams.join("&");
    const response = await axios.get(link, { withCredentials: true });
    dispatch(jobSlice.actions.successForAllJobs(response.data));
    dispatch(jobSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(jobSlice.actions.failureForAllJobs(error.response.data.message));
  }
};


export const fetchSingleJob = (jobId) => async (dispatch) => {
  dispatch(jobSlice.actions.requestForSingleJob());
  try {
    const response = await axios.get(
      `https://www.backend.vitaminjob.com/api/v1/job/get/${jobId}`,
      { withCredentials: true }
    );
    dispatch(jobSlice.actions.successForSingleJob(response.data.job));
    dispatch(jobSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(jobSlice.actions.failureForSingleJob(error.response.data.message));
  }
};
export const clearAllJobErrors = () => (dispatch) => {
  dispatch(jobSlice.actions.clearAllErrors());
};

export const resetJobSlice = () => (dispatch) => {
  dispatch(jobSlice.actions.resetJobSlice());
};

export const applyForJob = (jobId) => async (dispatch, getState) => {
  try {
    const { isAuthenticated } = getState().user;
    if (!isAuthenticated) {
      throw new Error("Please login to apply for jobs");
    }

    dispatch(jobSlice.actions.applyJobRequest());
    await axios.post(
      `https://www.backend.vitaminjob.com/api/v1/job/apply/${jobId}`,
      {},
      { withCredentials: true }
    );
    dispatch(jobSlice.actions.applyJobSuccess(jobId));
  } catch (error) {
    dispatch(jobSlice.actions.applyJobFailure(
      error.message || "Failed to apply for job"
    ));
    throw error;
  }
};

export const syncAppliedJobs = (appliedJobs) => (dispatch) => {
  dispatch(jobSlice.actions.setAppliedJobs(appliedJobs));
};

export const { clearErrors } = jobSlice.actions;
export default jobSlice.reducer;