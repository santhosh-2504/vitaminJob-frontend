/* eslint-disable react-refresh/only-export-components */
import { useEffect, createContext, useContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation,Link } from "react-router-dom";
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
import GovtJobs from "./pages/GovtJobs";
import { HelmetProvider } from "react-helmet-async";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

// Initialize Google Analytics with consent
const initializeGA = () => {
  if (window.gtag) {
    // Update consent status
    window.gtag("consent", "update", {
      analytics_storage: "granted"
    });
    
    // Configure GA with additional recommended settings
    window.gtag("config", "G-X74E9KV4LF", {
      send_page_view: true,
      anonymize_ip: true,
      page_path: window.location.pathname,
      user_properties: {
        theme_preference: localStorage.getItem("theme") || "light"
      }
    });
  }
};

const TrackPageView = () => {
  const location = useLocation();

  useEffect(() => {
    const hasConsent = getCookieConsentValue("cookieConsent") === "true";
    
    if (window.gtag && hasConsent) {
      // Track page views with additional parameters
      window.gtag("event", "page_view", {
        page_location: window.location.href,
        page_path: location.pathname,
        page_title: document.title
      });

      // Track user engagement
      window.gtag("event", "user_engagement", {
        engagement_time_msec: 1000,
        page_path: location.pathname
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
          <HelmetProvider>
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
            <Route path="/govtjobs" element={<GovtJobs />} />
          </Routes>
          </HelmetProvider>
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
                    color: darkMode ? "#f3f4f6" : "#111827",
                    padding: "1rem",
                    alignItems: "center",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "1rem",
                    boxShadow: "0 -4px 6px -1px rgba(0, 0, 0, 0.1)",
                    borderTop: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`
                  }}
                  buttonStyle={{
                    background: darkMode ? "#059669" : "#047857",
                    color: "#ffffff",
                    borderRadius: "0.375rem",
                    padding: "0.625rem 1.25rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    transition: "all 150ms ease-in-out",
                    cursor: "pointer",
                    border: "none",
                    outline: "2px solid transparent",
                    outlineOffset: "2px"
                  }}
                  declineButtonStyle={{
                    background: "transparent",
                    border: darkMode ? "2px solid #f3f4f6" : "2px solid #111827",
                    color: darkMode ? "#f3f4f6" : "#111827",
                    borderRadius: "0.375rem",
                    padding: "0.625rem 1.25rem",
                    marginRight: "0.625rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 150ms ease-in-out"
                  }}
                  expires={365}
                  onAccept={() => {
                    initializeGA();
                  }}
                  onDecline={() => {
                    if (window.gtag) {
                      window.gtag("consent", "update", {
                        analytics_storage: "denied",
                        anonymize_ip: true
                      });
                    }
                  }}
                  role="alertdialog"
                  aria-describedby="cookie-consent-description"
                >
                  <div id="cookie-consent-description">
                    <p className="text-base">
                      We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
                    </p>
                    <p className="text-sm mt-2">
                      Read our{" "}
                      <Link
                        to="/privacy-policy"
                        className={`underline font-medium ${
                          darkMode 
                            ? "text-blue-400 hover:text-blue-300" 
                            : "text-blue-600 hover:text-blue-700"
                        }`}
                        aria-label="Read our privacy policy"
                      >
                        Privacy Policy
                      </Link>
                      {" "}and{" "}
                      <Link
                        to="/cookie-policy"
                        className={`underline font-medium ${
                          darkMode 
                            ? "text-blue-400 hover:text-blue-300" 
                            : "text-blue-600 hover:text-blue-700"
                        }`}
                        aria-label="Read our cookie policy"
                      >
                        Cookie Policy
                      </Link>
                    </p>
                  </div>
             </CookieConsent>
        </Router>
      </ThemeContext.Provider>
    </>
  );
};

export default App;