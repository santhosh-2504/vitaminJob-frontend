/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigationType, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchJobs, clearAllJobErrors } from "../store/slices/jobSlice";
import { addBookmark, removeBookmark , clearAllUserErrors} from "../store/slices/userSlice";
import Spinner from "../components/Spinner";
import { 
  FaBookmark, 
  FaRegBookmark, 
  FaMapMarkerAlt, 
  FaMoneyBillWave, 
  FaBriefcase, 
  FaClock 
} from "react-icons/fa";

// Custom debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

// City variations mapping
const cityVariations = {
  bangalore: ['bangalore', 'bengaluru', 'banglore', 'bengalooru', 'bengaluru karnataka', 'bangalore karnataka'],
  mumbai: ['mumbai', 'bombay', 'mumbai maharashtra', 'bombay maharashtra'],
  delhi: ['delhi', 'new delhi', 'delhi ncr', 'new delhi india'],
  pune: ['pune', 'poona', 'pune maharashtra'],
  hyderabad: ['hyderabad', 'hyderbad', 'hyderabad telangana'],
  chennai: ['chennai', 'madras', 'chennai tamil nadu'],
  kolkata: ['kolkata', 'calcutta', 'kolkata west bengal'],
  noida: ['noida', 'noida uttar pradesh', 'noida up', 'gautam buddha nagar'],
  gurugram: ['gurugram', 'gurgaon', 'gurgaon haryana', 'gurugram haryana'],
  ahmedabad: ['ahmedabad', 'ahmedabad gujarat'],
  thiruvananthapuram: ['thiruvananthapuram', 'trivandrum'],
  coimbatore: ['coimbatore', 'kovai'],
  kochi: ['kochi', 'cochin'],
  indore: ['indore', 'indore madhya pradesh'],
  nagpur: ['nagpur', 'nagpur maharashtra'],
  jaipur: ['jaipur', 'jaipur rajasthan'],
  lucknow: ['lucknow', 'lucknow uttar pradesh'],
  visakhapatnam: ['visakhapatnam', 'vizag', 'visakhapatnam andhra pradesh'],
  mysuru: ['mysuru', 'mysore'],
  bhubaneswar: ['bhubaneswar', 'bhubaneswar odisha'],
  vadodara: ['vadodara', 'baroda'],
};

// Function to normalize text for comparison
const normalizeText = (text) => {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
};

// Function to get all variations of a city
const getCityVariations = (cityName) => {
  const normalizedCity = normalizeText(cityName);
  for (const [key, variations] of Object.entries(cityVariations)) {
    if (variations.includes(normalizedCity)) {
      return variations;
    }
  }
  return [normalizedCity];
};

// Function to check if location matches search
const locationMatchesSearch = (locations, searchTerm) => {
  if (!locations || !searchTerm) return false;
  const normalizedSearch = normalizeText(searchTerm);
  
  return locations.some(location => {
    const normalizedLocation = normalizeText(location);
    // Check if the search term is part of the location
    return normalizedLocation.includes(normalizedSearch);
  });
};

const Jobs = () => {
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedNiche, setSelectedNiche] = useState("All");
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem('jobPageNumber');
    return savedPage ? parseInt(savedPage) : 1;
  });
  const searchInputRef = useRef(null);

  // Apply debouncing to search input
  const searchKeyword = useDebounce(searchInput, 500);

  const { 
    jobs, 
    loading, 
    error, 
    isFetched,
    totalPages,
    totalJobs,
    appliedJobs 
  } = useSelector((state) => state.jobs);
  
  const { user, error: userError } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigationType = useNavigationType();
  const navigate = useNavigate();

  // Function to check if a job matches the search criteria
  const jobMatchesSearch = (job) => {
    if (!searchKeyword) return true;
    
    const normalizedSearch = normalizeText(searchKeyword);
    
    // Check title
    if (normalizeText(job.title).includes(normalizedSearch)) return true;
    
    // Check company name
    if (normalizeText(job.companyName).includes(normalizedSearch)) return true;
    
    // Check location
    if (job.location && locationMatchesSearch(job.location, searchKeyword)) return true;
    
    // Check description
    if (job.shortDescription && normalizeText(job.shortDescription).includes(normalizedSearch)) return true;
    
    return false;
  };

  // Filter jobs based on search
  const filteredJobs = jobs?.filter(jobMatchesSearch) || [];

  // Function to check if a job is bookmarked
  const isBookmarked = (jobId) => {
    return user?.bookmarks?.includes(jobId);
  };

  // Function to toggle bookmark
  const toggleBookmark = (jobId) => {
    if (!user?._id) {
      toast.error("Please login to bookmark jobs");
      navigate('/login');
      return;
    }
    
    if (isBookmarked(jobId)) {
      dispatch(removeBookmark(jobId));
    } else {
      dispatch(addBookmark(jobId));
    }
  };

  // Maintain focus after re-render
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [filteredJobs]); // Re-focus when jobs are filtered

  // Reset page only for filter changes, not for navigation back
  useEffect(() => {
    if (selectedCity !== "All" || selectedNiche !== "All" || searchKeyword !== "") {
      setCurrentPage(1);
      localStorage.setItem('jobPageNumber', '1');
    }
  }, [selectedCity, selectedNiche, searchKeyword]);

  // Modify the fetch effect to ensure it uses the saved page
  useEffect(() => {
    if (error && error !== "User not authenticated") {
      toast.error(error);
      dispatch(clearAllJobErrors());
    }

    if (userError) {
      toast.error(userError);
      dispatch(clearAllUserErrors());
    }

    const savedPage = localStorage.getItem('jobPageNumber');
    if (savedPage) {
      setCurrentPage(parseInt(savedPage));
    }
    
    dispatch(fetchJobs(selectedNiche, selectedCity, searchKeyword, currentPage));
  }, [dispatch, error, userError, selectedNiche, selectedCity, searchKeyword, currentPage]);

  // Add useEffect to handle initial mount and page changes
  useEffect(() => {
    // Scroll to top when component mounts or page changes
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentPage]); // Dependency on currentPage ensures this runs on page changes

  // Update the handlePageChange function
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    localStorage.setItem('jobPageNumber', newPage.toString());
  };

  // Save scroll position before navigating to details
  const handleViewDetails = (jobId) => {
    localStorage.setItem('jobsScrollPosition', window.scrollY.toString());
    navigate(`/apply/${jobId}`);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen pt-16">
      {/* Fixed Search Section */}
      <div className="fixed top-16 left-0 right-0 z-10 bg-gray-100 dark:bg-gray-900 px-4 py-2">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search jobs, companies, or locations..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Cities</option>
                {Object.keys(cityVariations).map((city) => (
                  <option key={city} value={city}>
                    {city.charAt(0).toUpperCase() + city.slice(1)}
                  </option>
                ))}
              </select>
              <select
                value={selectedNiche}
                onChange={(e) => setSelectedNiche(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Niches</option>
                <option value="Software">Software</option>
                <option value="Marketing">Marketing</option>
                <option value="Design">Design</option>
                <option value="Sales">Sales</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pt-28 max-w-7xl">
        <div className="grid grid-cols-12 gap-4">
          {/* Left sidebar for ads */}
          <div className="hidden lg:block lg:col-span-2">
            <div className="sticky top-44 bg-white dark:bg-gray-800" />
          </div>

          {/* Main content */}
          <div className="col-span-12 lg:col-span-8">
            {loading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <Spinner />
              </div>
            ) : (
              <>
                {filteredJobs.length > 0 ? (
                  <>
                    <div className="space-y-6">
                      {filteredJobs.map((job) => (
                        <div
                          key={job._id}
                          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px]"
                        >
                          {/* Job Header */}
                          <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center space-x-4">
                                {job.companyLogo ? (
                                  <img
                                    src={job.companyLogo}
                                    alt={`${job.companyName} logo`}
                                    className="w-16 h-16 rounded-xl object-cover"
                                  />
                                ) : (
                                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold text-2xl">
                                    {job.companyName.charAt(0)}
                                  </div>
                                )}
                                <div>
                                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-1">
                                    {job.title}
                                  </h3>
                                  <p className="text-blue-600 dark:text-blue-400 font-medium">
                                    {job.companyName}
                                  </p>
                                </div>
                              </div>
                              {/* Action buttons container */}
                              <div className="flex items-center space-x-3">
                                {appliedJobs.includes(job._id) && (
                                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
                                    Applied
                                  </span>
                                )}
                                <button
                                  onClick={() => toggleBookmark(job._id)}
                                  className="text-gray-400 hover:text-blue-600 transition-colors"
                                >
                                  {isBookmarked(job._id) ? (
                                    <FaBookmark className="text-blue-600 text-2xl" />
                                  ) : (
                                    <FaRegBookmark className="text-2xl" />
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Job Details */}
                            <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-2">
                              {job.shortDescription || "No description available"}
                            </p>

                            {/* Job Metadata */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                              <div className="flex items-center text-gray-600 dark:text-gray-400">
                                <FaMapMarkerAlt className="mr-2 text-blue-500" />
                                <span>{job.location ? job.location.join(", ") : "N/A"}</span>
                              </div>
                              <div className="flex items-center text-gray-600 dark:text-gray-400">
                                <FaMoneyBillWave className="mr-2 text-green-500" />
                                <span>{job.salary || "Not specified"}</span>
                              </div>
                              <div className="flex items-center text-gray-600 dark:text-gray-400">
                                <FaBriefcase className="mr-2 text-purple-500" />
                                <span>{job.jobType || "Full Time"}</span>
                              </div>
                              <div className="flex items-center text-gray-600 dark:text-gray-400">
                                <FaClock className="mr-2 text-orange-500" />
                                <span>{job.experience || "Not specified"}</span>
                              </div>
                            </div>

                            {/* Apply Button */}
                            <button
                              onClick={() => handleViewDetails(job._id)}
                              className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center items-center space-x-4 mt-8 mb-8">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-lg ${
                          currentPage === 1
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                        } text-white transition`}
                      >
                        Previous
                      </button>
                      
                      <span className="text-gray-600 dark:text-gray-300">
                        Page {currentPage} of {totalPages} ({totalJobs} total jobs)
                      </span>
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-lg ${
                          currentPage === totalPages
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                        } text-white transition`}
                      >
                        Next
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-4 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
                    <img
                      src="./notfound.png"
                      alt="job-not-found"
                      className="max-w-xs opacity-70"
                    />
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                      No jobs found matching your criteria
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right sidebar for ads */}
          <div className="hidden lg:block lg:col-span-2">
            <div className="sticky top-44 bg-white dark:bg-gray-800" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;