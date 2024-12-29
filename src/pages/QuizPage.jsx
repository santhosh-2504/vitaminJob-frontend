import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchQuizzes, clearQuizErrors } from "../store/slices/quizSlice";
import Spinner from "../components/Spinner";
import { FaBook } from "react-icons/fa";

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

export default function QuizPage() {
  const [selectedNiche, setSelectedNiche] = useState("All");
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem('quizPageNumber');
    return savedPage ? parseInt(savedPage) : 1;
  });
  const searchInputRef = useRef(null);
  const searchKeyword = useDebounce(searchInput, 500);

  const { 
    quizzes, 
    loading, 
    error,
    totalPages,
    totalQuizzes 
  } = useSelector((state) => state.quiz);
  
  const dispatch = useDispatch();

  // Modify the fetch effect to ensure it uses the saved page
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearQuizErrors());
    }

    const savedPage = localStorage.getItem('quizPageNumber');
    if (savedPage) {
      setCurrentPage(parseInt(savedPage));
    }
    
    dispatch(fetchQuizzes(selectedNiche, searchKeyword, currentPage));
  }, [dispatch, error, selectedNiche, searchKeyword, currentPage]);

  // Only reset page for filter changes, not for navigation
  useEffect(() => {
    if (selectedNiche !== "All" || searchKeyword !== "") {
      setCurrentPage(1);
      localStorage.setItem('quizPageNumber', '1');
    }
  }, [selectedNiche, searchKeyword]);

  // Add effect to maintain focus after re-render
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [quizzes]);

  // Add useEffect for scroll behavior
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentPage]);

  // Update handlePageChange
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    localStorage.setItem('quizPageNumber', newPage.toString());
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
                  placeholder="Search quizzes..."
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
                <option value="All">All Categories</option>
                <option value="Programming">Programming</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
                <option value="General Knowledge">General Knowledge</option>
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
                {/* Change this grid to 2 columns instead of 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {quizzes && quizzes.length > 0 ? (
                    quizzes.map((quiz) => (
                      <div
                        key={quiz._id}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px] flex flex-col h-full"
                      >
                        <div className="p-6 flex-1 flex flex-col">
                          <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                              <FaBook className="text-xl" />
                            </div>
                            <div className="ml-4">
                              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 line-clamp-1">
                                {quiz.title}
                              </h3>
                              <span className="text-sm text-blue-600 dark:text-blue-400">
                                {quiz.niche}
                              </span>
                            </div>
                          </div>

                          <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">
                            {quiz.description}
                          </p>

                          <div className="flex justify-between items-center mb-2 mt-auto">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {quiz.questions?.length || 0} Questions
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(quiz.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-4 pt-0">
                          <Link
                            to={`/quiz/${quiz._id}`}
                            className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                          >
                            Start Quiz
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full flex flex-col items-center justify-center space-y-4 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
                      <img
                        src="/notfound.png"
                        alt="no-quizzes-found"
                        className="max-w-xs opacity-70"
                      />
                      <p className="text-gray-600 dark:text-gray-300 text-lg">
                        No quizzes found matching your criteria
                      </p>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {quizzes && quizzes.length > 0 && (
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
                      Page {currentPage} of {totalPages} ({totalQuizzes} total quizzes)
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
}