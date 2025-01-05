import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchCourses, clearCourseErrors } from "../store/slices/courseSlice";
import Spinner from "../components/Spinner";
import { 
  FaGraduationCap, 
  FaCertificate,
  FaCode,
  FaExternalLinkAlt
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

const Courses = () => {
  const [selectedNiche, setSelectedNiche] = useState("All");
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem('coursePageNumber');
    return savedPage ? parseInt(savedPage) : 1;
  });
  const searchInputRef = useRef(null);

  // Apply debouncing to search input
  const searchKeyword = useDebounce(searchInput, 500);

  const { 
    courses, 
    loading, 
    error, 
    totalPages,
    totalCourses 
  } = useSelector((state) => state.courses);
  
  const dispatch = useDispatch();

  // Function to check if a course matches the search criteria
  const courseMatchesSearch = (course) => {
    if (!searchKeyword) return true;
    
    const normalizedSearch = searchKeyword.toLowerCase();
    
    // Check title
    if (course.title?.toLowerCase().includes(normalizedSearch)) return true;
    
    // Check provider
    if (course.provider?.toLowerCase().includes(normalizedSearch)) return true;
    
    // Check description
    if (course.description?.toLowerCase().includes(normalizedSearch)) return true;
    
    return false;
  };

  // Filter courses based on search
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const filteredCourses = courses?.filter(courseMatchesSearch) || [];

  // Maintain focus after re-render
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [filteredCourses]);

  // Reset page only for filter changes, not for navigation back
  useEffect(() => {
    if (selectedNiche !== "All" || searchKeyword !== "") {
      setCurrentPage(1);
      localStorage.setItem('coursePageNumber', '1');
    }
  }, [selectedNiche, searchKeyword]);

  // Modify the fetch effect to ensure it uses the saved page
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearCourseErrors());
    }

    const savedPage = localStorage.getItem('coursePageNumber');
    if (savedPage) {
      setCurrentPage(parseInt(savedPage));
    }
    
    dispatch(fetchCourses(selectedNiche, searchKeyword, currentPage));
  }, [dispatch, error, selectedNiche, searchKeyword, currentPage]);

  // Update handlePageChange to save page number
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    localStorage.setItem('coursePageNumber', newPage.toString());
  };

  // Save scroll position before navigating to course link
  const handleCourseClick = (courseLink) => {
    localStorage.setItem('coursesScrollPosition', window.scrollY.toString());
    window.open(courseLink, '_blank');
  };

  // Restore scroll position when returning to courses list
  useEffect(() => {
    const savedScrollPosition = localStorage.getItem('coursesScrollPosition');
    if (savedScrollPosition) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScrollPosition));
        localStorage.removeItem('coursesScrollPosition');
      }, 0);
    }
  }, []);

  // Pagination component
  const Pagination = () => {
    return (
      <div className="flex justify-center items-center space-x-4 mt-8 mb-8">
        <button
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
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
          Page {currentPage} of {totalPages} ({totalCourses} total courses)
        </span>
        
        <button
          onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
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
    );
  };

  // Add useEffect for scroll behavior
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentPage]);

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
                  placeholder="Search courses..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
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
      <div className="container mx-auto px-6 pt-40 md:pt-28 max-w-7xl">
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
                {filteredCourses.length > 0 ? (
                  <>
                    <div className="space-y-6">
                      {filteredCourses.map((course) => (
                        <div
                          key={course._id}
                          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px]"
                        >
                          <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center space-x-4">
                                {course.companyLogo ? (
                                  <img
                                    src={course.companyLogo}
                                    alt={`${course.provider || 'Course'} logo`}
                                    className="w-16 h-16 rounded-xl object-cover"
                                  />
                                ) : (
                                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold text-2xl">
                                    {course.provider ? course.provider.charAt(0) : 'C'}
                                  </div>
                                )}
                                <div>
                                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-1">
                                    {course.title || 'Untitled Course'}
                                  </h3>
                                  <p className="text-blue-600 dark:text-blue-400 font-medium">
                                    {course.provider || 'Unknown Provider'}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-2">
                              {course.description || "No description available"}
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                              <div className="flex items-center text-gray-600 dark:text-gray-400">
                                <FaCode className="mr-2 text-blue-500" />
                                <span>{course.niche || 'General'}</span>
                              </div>
                              <div className="flex items-center text-gray-600 dark:text-gray-400">
                                <FaCertificate className="mr-2 text-green-500" />
                                <span>Free Certification: {course.freeCertification ? "Yes" : "No"}</span>
                              </div>
                              <div className="flex items-center text-gray-600 dark:text-gray-400">
                                <FaGraduationCap className="mr-2 text-purple-500" />
                                <span>Course by {course.provider || 'Unknown Provider'}</span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleCourseClick(course.siteLink)}
                              className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                            >
                              Visit Course <FaExternalLinkAlt className="ml-2 inline" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Pagination />
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-4 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
                    <img
                      src="./notfound.png"
                      alt="course-not-found"
                      className="max-w-xs opacity-70"
                    />
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                      No courses found matching your criteria
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

export default Courses;