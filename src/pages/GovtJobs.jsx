/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigationType, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchGovtJobs, clearAllGovtJobErrors } from "../store/slices/govtJobSlice";
import Spinner from "../components/Spinner";
import { FaBookmark, FaRegBookmark, FaMapMarkerAlt, FaMoneyBillWave, FaBriefcase, FaClock } from "react-icons/fa";
import { addBookmark, removeBookmark, clearAllUserErrors } from "../store/slices/userSlice";
import { Helmet } from 'react-helmet-async';

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debouncedValue;
};
const normalizeText = (text) => {
    return text.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .trim();
  };
  
const GovtJobs = () => {
    
    const [searchInput, setSearchInput] = useState("");
    const [currentPage, setCurrentPage] = useState(() => {
        const savedPage = localStorage.getItem('govtJobPageNumber');
        return savedPage ? parseInt(savedPage) : 1;
    });
    const searchInputRef = useRef(null);
    const searchKeyword = useDebounce(searchInput, 500);

    const { 
        govtJobs, 
        loading, 
        error, 
        isFetched,
        totalPages,
        totalJobs,
        appliedJobs 
    } = useSelector((state) => state.govtJobs);

    const { user, error: userError } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigationType = useNavigationType();
    const navigate = useNavigate();

    const jobMatchesSearch = (job) => {
        if (!searchKeyword) return true;
        
        const normalizedSearch = normalizeText(searchKeyword);

        if (normalizeText(job.title).includes(normalizedSearch)) return true;
        if (normalizeText(job.description).includes(normalizedSearch)) return true;
        if (job.qualification && normalizeText(job.qualification).includes(normalizedSearch)) return true;
        
        return false;

    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const filteredJobs = govtJobs?.filter(jobMatchesSearch) || [];

    const isBookmarked = (jobId) => {
        return user?.bookmarks?.includes(jobId);
    };

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

    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [filteredJobs]);

    useEffect(() => {
        if (searchKeyword !== "") {
            setCurrentPage(1);
            localStorage.setItem('govtJobPageNumber', '1');
        }
    }, [searchKeyword]);

    useEffect(() => {
        if (error && error !== "User not authenticated") {
            toast.error(error);
            dispatch(clearAllGovtJobErrors());
        }
        if (userError && userError !== "User not authenticated") {
            toast.error(userError);
            dispatch(clearAllUserErrors());
        }
        const savedPage = localStorage.getItem('govtJobPageNumber');
        if (savedPage) {
            setCurrentPage(parseInt(savedPage));
        }
        dispatch(fetchGovtJobs(searchKeyword, currentPage));
    }, [dispatch, error, userError, searchKeyword, currentPage]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [currentPage]);

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        setCurrentPage(newPage);
        localStorage.setItem('govtJobPageNumber', newPage.toString());
    };

    const handleViewDetails = (jobId) => {
        localStorage.setItem('govtJobsScrollPosition', window.scrollY.toString());
        navigate(`/apply/${jobId}`);
    };

    return (
        <>
        <Helmet>
            <title>Govt Jobs | Vitamin Job</title>
            <meta name="description" content="Vitamin Job is a job search platform that helps you find government jobs. We provide a wide range of government jobs, view and apply for your desired position today." />

        </Helmet>
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
                                    placeholder="Search government jobs..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}      
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
            {/* Main Content */}
            <div className="container mx-auto px-6 pt-52 max-w-7xl md:pt-28">
                <div className="grid grid-cols-12 gap-4">
                    {/* Left sidebar for ads */}
                    <div className="hidden lg:block lg:col-span-2">
                        <div className="sticky top-44 bg-white dark:bg-gray-800" />
                    </div>
                    
                    {/* Main content */ }
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
                                        <div key={job._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px]">
                                            {/* Job Header */}
                                            <div className="p-6">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center space-x-4">
                                                        {job.companyLogo ? (
                                                        <img src={job.companyLogo} alt={`${job.companyName} logo`} className="w-16 h-16 rounded-xl object-cover" />
                                                        ) : (
                                                            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold text-2xl">
                                                                {job.companyName.charAt(0)}
                                                                </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-1">
                                                            {job.title}
                                                        </h3>
                                                        <p className="text-blue-600 dark:text-blue-400 font-medium">
                                                            {job.companyName}
                                                        </p>
                                                    </div>
                                                </div>
                                                {/* Actions */}
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
                                                            <FaRegBookmark className="text-gray-400 text-2xl" />
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
                                                    <FaMoneyBillWave className="mr-2 text-blue-500" />
                                                    <span>{job.salary ? job.salary.join(", ") : "N/A"}</span>
                                                </div>
                                                <div className="flex items-center text-gray-600 dark:text-gray-400">
                                                    <FaBriefcase className="mr-2 text-purple-500" />
                                                    <span>{job.companyName || "Government Job"}</span>
                                                </div>
                                                <div className="flex items-center text-gray-600 dark:text-gray-400">
                                                    <FaClock className="mr-2 text-orange-500" />
                                                    <span>{job.applicationDeadline || "Not specified"}</span>
                                                </div>
                                                <div className="flex items-center text-gray-600 dark:text-gray-400">
                                                    <FaMapMarkerAlt className="mr-2 text-blue-500" />
                                                    <span>{job.qualification || "Not specified"}</span>
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
                                    <img src="./notfound.png" alt="job-not-found" className="max-w-xs opacity-70" />
                                    <p className="text-gray-600 dark:text-gray-300 text-lg">No jobs found matching your criteria</p>
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
        </>
    );
};

export default GovtJobs;

