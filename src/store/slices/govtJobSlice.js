import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const govtJobSlice = createSlice({
  name: "govtJobs",
  initialState: {
    jobs: [],
    loading: false,         
    error: null,
    message: null,
    singleJob: {},
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
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
  }
},
});

export const fetchGovtJobs = (searchKeyword = "", page = 1) => async (dispatch) => {
    try {
        dispatch(govtJobSlice.actions.requestForAllJobs());
        let link = "https://www.backend.vitaminjob.com/api/v1/govtjob/getall?";
        let queryParams = [`page=${page}`];
    
        if (searchKeyword) {
          queryParams.push(`searchKeyword=${searchKeyword}`);
        }
    
        link += queryParams.join("&");
        const response = await axios.get(link, { withCredentials: true });
        dispatch(govtJobSlice.actions.successForAllJobs(response.data));
        dispatch(govtJobSlice.actions.clearAllErrors());
      } catch (error) {
        dispatch(govtJobSlice.actions.failureForAllJobs(error.response.data.message));
      }
};

export const fetchSingleGovtJob = (jobId) => async (dispatch) => {
    dispatch(govtJobSlice.actions.requestForSingleJob());
    try {
        const response = await axios.get(`https://www.backend.vitaminjob.com/api/v1/govtjob/get/${jobId}`, { withCredentials: true });
        dispatch(govtJobSlice.actions.successForSingleJob(response.data.job));
        dispatch(govtJobSlice.actions.clearAllErrors());
    } catch (error) {
        dispatch(govtJobSlice.actions.failureForSingleJob(error.response.data.message));
    }
};

export const clearAllGovtJobErrors = () => (dispatch) => {
    dispatch(govtJobSlice.actions.clearAllErrors());
};

export const resetGovtJobSlice = () => (dispatch) => {
    dispatch(govtJobSlice.actions.resetJobSlice());
};

export const applyForGovtJob = (jobId) => async (dispatch, getState) => {
    try {
        const { isAuthenticated } = getState().user;
        if (!isAuthenticated) {
            throw new Error("Please login to apply for jobs");
        }
        dispatch(govtJobSlice.actions.applyJobRequest());
        await axios.post(`https://www.backend.vitaminjob.com/api/v1/govtjob/apply/${jobId}`, {}, { withCredentials: true });
        dispatch(govtJobSlice.actions.applyJobSuccess(jobId));
    } catch (error) {
        dispatch(govtJobSlice.actions.applyJobFailure(error.message || "Failed to apply for job"));
        throw error;
    }
}

export const syncAppliedGovtJobs = (appliedJobs) => (dispatch) => {
    dispatch(govtJobSlice.actions.setAppliedJobs(appliedJobs));
};

export const { clearErrors } = govtJobSlice.actions;
export default govtJobSlice.reducer;
