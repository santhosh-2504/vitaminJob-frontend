/* eslint-disable react-refresh/only-export-components */
import { useEffect , createContext, useContext, useState} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import JobDetails from "./components/JobDetails";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { getUser } from "./store/slices/userSlice";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfService from "./components/TermsOfService";
import Roadmaps from "./pages/Roadmaps";
import Courses from "./pages/Courses";
import Donate from "./pages/Donate";
import QuizPage from "./pages/QuizPage";
import QuizDetails from "./components/QuizDetails";
import TakeQuiz from "./components/TakeQuiz";
import FeedbackForm from "./components/FeedbackForm";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import CancellationsAndRefunds from "./components/CancellationsAndRefunds";
//import PostsPage from "./pages/PostsPage";
//import SinglePost from "./pages/SinglePost";
const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const App = () => {
  const dispatch = useDispatch();
  const [darkMode, setDarkMode] = useState(()=>{
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' ||            (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches); 
  })

  useEffect(() => {
    const handleOnline = () => {
      toast.success('Connection is restored!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: darkMode ? 'dark' : 'light',
        style: {
          background: darkMode ? '#065f46' : '#dcfce7',
          color: darkMode ? '#fff' : '#166534',
        },
        icon: '🌐'
      });
    };

    const handleOffline = () => {
      toast.error('You are offline!', {
        position: "top-right",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: darkMode ? 'dark' : 'light',
        style: {
          background: darkMode ? '#7f1d1d' : '#fee2e2',
          color: darkMode ? '#fff' : '#991b1b',
        },
        icon: '📡'
      });
    };

    if (!navigator.onLine) {
      handleOffline();
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [darkMode]);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(()=>{
    if(darkMode){
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme','dark')
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  },[darkMode])

  const toggleDarkMode=()=>{
    setDarkMode(prev => !prev)
  }
  return (
    <>
    <ThemeContext.Provider value={{darkMode, toggleDarkMode}}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/apply/:jobId" element={<JobDetails />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy/>} />
          <Route path="/terms" element={<TermsOfService/>} />
          <Route path="/roadmaps" element={<Roadmaps/>} />
          <Route path="/courses" element={<Courses/>} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/quizzes" element={<QuizPage />} />
          <Route path="/quiz/:id" element={<QuizDetails/>}/>
          <Route path="/quiz/:id/start" element={<TakeQuiz/>}/>
          <Route path="/feedback" element={<FeedbackForm/>}/> 
          <Route path="/about-us" element={<AboutUs/>}/>
          <Route path="/contact-us" element={<ContactUs/>}/>
          <Route path="/cancellations-and-refunds" element={<CancellationsAndRefunds/>}/>
          {/* <Route path="/posts" element={<PostsPage/>}/> */}
          {/* <Route path="/post/:id" element={<SinglePost/>}/> */}
          </Routes>
        <Footer />
        <ToastContainer
          position="top-right"
          theme={darkMode ? 'dark' : 'light'}
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Router>
      </ThemeContext.Provider>
    </>
  );
};

export default App;