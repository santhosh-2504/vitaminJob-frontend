import { configureStore } from "@reduxjs/toolkit";
import jobReducer from "./slices/jobSlice";
import userReducer from "./slices/userSlice";
import updateProfileReducer from "./slices/updateProfileSlice";
import roadmapReducer from "./slices/roadmapSlice";
import bookmarkReducer from "./slices/bookmarkSlice.js";
import starredRoadmapReducer from "./slices/starredRoadmapSlice.js";
import courseReducer from "./slices/courseSlice.js";
import quizReducer from "./slices/quizSlice.js";
//import postReducer from "./slices/postSlice.js"
import quizTakingReducer from './slices/quizTakingSlice';
import govtJobReducer from './slices/govtJobSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    jobs: jobReducer,
    updateProfile: updateProfileReducer,
    roadmap: roadmapReducer,
    bookmarks: bookmarkReducer,
    roadmaps: starredRoadmapReducer,
    courses: courseReducer,
    quiz: quizReducer,
    //post : postReducer,
    quizTaking: quizTakingReducer,
    govtJobs: govtJobReducer,
  },
});

export default store;