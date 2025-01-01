/* eslint-disable react-refresh/only-export-components */
import { useEffect, createContext, useContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import CookieConsent, { getCookieConsentValue } from "react-cookie-consent";
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
import TermsOfService from "./components/TermsOfService"
import Roadmaps from "./pages/Roadmaps";
import Courses from "./pages/Courses";
import QuizPage from "./pages/QuizPage";
import QuizDetails from "./components/QuizDetails";
import TakeQuiz from "./components/TakeQuiz";
import FeedbackForm from "./components/FeedbackForm";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import CookiePolicy from "./components/CookiePolicy";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

// Initialize Google Analytics with consent
const initializeGA = () => {
  if (window.gtag) {
    window.gtag("consent", "update", {
      analytics_storage: "granted"
    });
    window.gtag("config", "", {
      send_page_view: false,
      anonymize_ip: true
    });
  }
};

const TrackPageView = () => {
  const location = useLocation();

  useEffect(() => {
    const hasConsent = getCookieConsentValue("cookieConsent") === "true";
    
    if (window.gtag && hasConsent) {
      window.gtag("event", "page_view", {
        page_path: location.pathname,
      });
    }
  }, [location]);

  return null;
};

const App = () => {
  const dispatch = useDispatch();
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return (
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  // Initialize GA if consent exists
  useEffect(() => {
    const hasConsent = getCookieConsentValue("cookieConsent") === "true";
    if (hasConsent) {
      initializeGA();
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      toast.success("Connection is restored!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: darkMode ? "dark" : "light",
        style: {
          background: darkMode ? "#065f46" : "#dcfce7",
          color: darkMode ? "#fff" : "#166534",
        },
        icon: "🌐",
      });
    };

    const handleOffline = () => {
      toast.error("You are offline!", {
        position: "top-right",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: darkMode ? "dark" : "light",
        style: {
          background: darkMode ? "#7f1d1d" : "#fee2e2",
          color: darkMode ? "#fff" : "#991b1b",
        },
        icon: "📡",
      });
    };

    if (!navigator.onLine) {
      handleOffline();
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [darkMode]);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <>
      <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
        <Router>
          <TrackPageView />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/apply/:jobId" element={<JobDetails />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/roadmaps" element={<Roadmaps />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/quizzes" element={<QuizPage />} />
            <Route path="/quiz/:id" element={<QuizDetails />} />
            <Route path="/quiz/:id/start" element={<TakeQuiz />} />
            <Route path="/feedback" element={<FeedbackForm />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact-us" element={<ContactUs />} />
          </Routes>
          <Footer />
          <ToastContainer
            position="top-right"
            theme={darkMode ? "dark" : "light"}
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <CookieConsent
            location="bottom"
            buttonText="Accept"
            declineButtonText="Decline"
            enableDeclineButton
            cookieName="cookieConsent"
            style={{ 
              background: darkMode ? "#1f2937" : "#f3f4f6",
              color: darkMode ? "#fff" : "#000",
              padding: "1rem",
              alignItems: "center",
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem"
            }}
            buttonStyle={{
              background: darkMode ? "#059669" : "#047857",
              color: "#fff",
              borderRadius: "6px",
              padding: "8px 16px",
              fontSize: "0.875rem"
            }}
            declineButtonStyle={{
              background: "transparent",
              border: darkMode ? "1px solid #fff" : "1px solid #000",
              color: darkMode ? "#fff" : "#000",
              borderRadius: "6px",
              padding: "8px 16px",
              marginRight: "10px",
              fontSize: "0.875rem"
            }}
            expires={365}
            onAccept={() => {
              initializeGA();
            }}
            onDecline={() => {
              // Optional: Handle decline action
              if (window.gtag) {
                window.gtag("consent", "update", {
                  analytics_storage: "denied",
                  anonymize_ip: true
                });
              }
            }}
          >
            <div>
              We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.{" "}
              <span style={{ fontSize: "12px", display: "block", marginTop: "8px" }}>
                Read our{" "}
                <a 
                  href="/privacy-policy"
                  style={{ 
                    color: darkMode ? "#10b981" : "#059669",
                    textDecoration: "underline" 
                    
                  }}
                >
                  Privacy Policy
                </a>
                {" "}and{" "}
                <a 
                  href="/cookie-policy"
                  style={{ 
                    color: darkMode ? "#10b981" : "#059669",
                    textDecoration: "underline" 
                  }}
                >
                  Cookie Policy
                </a>
              </span>
            </div>
          </CookieConsent>
        </Router>
      </ThemeContext.Provider>
    </>
  );
};

export default App;