import { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MdLocationOn, MdWork, MdAttachMoney, MdLabel } from "react-icons/md";
import { fetchSingleJob } from "../store/slices/jobSlice";
import Spinner from "../components/Spinner";
import { FaExternalLinkAlt, FaArrowLeft, FaBuilding } from "react-icons/fa";
import { toast } from 'react-toastify';

const JobDetails = () => {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const { singleJob, loading, error } = useSelector((state) => state.jobs);
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchSingleJob(jobId));
  }, [dispatch, jobId]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    return () => {
      const savedScrollPosition = localStorage.getItem('jobsScrollPosition');
      if (savedScrollPosition) {
        setTimeout(() => {
          window.scrollTo(0, parseInt(savedScrollPosition));
          localStorage.removeItem('jobsScrollPosition');
        }, 0);
      }
    };
  }, []);

  const handleApply = () => {
    if (!isAuthenticated) {
      toast.info("Please Login to Apply", {
        position: "top-right",
        autoClose: 3000,
      });
      
      navigate('/login', { 
        state: { 
          from: `/apply/${jobId}`,
          applyAfterLogin: true 
        } 
      });
      return;
    }
    
    window.open(singleJob.applyLink, '_blank');
  };

  useEffect(() => {
    const { state } = location;
    if (isAuthenticated && state?.from === location.pathname && state?.applyAfterLogin) {
      navigate(location.pathname, { replace: true });
      window.open(singleJob.applyLink, '_blank');
    }
  }, [isAuthenticated, location, navigate, singleJob?.applyLink]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        An error occurred: {error}
      </div>
    );
  }

  if (!singleJob) {
    return (
      <div className="text-center py-10 text-gray-600 dark:text-gray-300">
        No job details found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-20 dark:text-white">
        <button
          onClick={handleBack}
          className="mb-6 flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to Jobs
        </button>

        {/* Company Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/4">
              <div className="w-full aspect-square max-w-[200px] mx-auto md:mx-0 bg-white rounded-xl p-4 flex items-center justify-center">
                {singleJob.companyLogo ? (
                  <img
                    src={singleJob.companyLogo}
                    alt={`${singleJob.companyName} logo`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <FaBuilding className="w-16 h-16 text-gray-400" />
                )}
              </div>
            </div>
            <div className="w-full md:w-3/4">
              <div className="mb-6">
                <h1 className="text-2xl font-bold dark:text-white mb-2">{singleJob.title}</h1>
                <h2 className="text-xl text-blue-600 dark:text-blue-400 font-semibold">
                  {singleJob.companyName}
                </h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <MdLocationOn className="text-blue-500 dark:text-blue-400 text-xl" />
                  <span className="dark:text-gray-300">
                    {Array.isArray(singleJob.location)
                      ? singleJob.location.join(", ")
                      : singleJob.location || "Not specified"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <MdAttachMoney className="text-blue-500 dark:text-blue-400 text-xl" />
                  <span className="dark:text-gray-300">{singleJob.salary || "Not specified"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MdWork className="text-blue-500 dark:text-blue-400 text-xl" />
                  <span className="dark:text-gray-300">{singleJob.jobType || "Not specified"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MdLabel className="text-blue-500 dark:text-blue-400 text-xl" />
                  <span className="dark:text-gray-300">{singleJob.niche || "Not specified"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6 dark:text-white">Job Description</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {singleJob.shortDescription || "No short description available"}
            </p>
            <h3 className="text-lg font-medium mb-4 dark:text-white">Detailed Overview</h3>
            <p className="text-gray-700 dark:text-gray-300">
              {singleJob.lengthyDescription || "No detailed description available"}
            </p>
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6 dark:text-white">Required Skills</h2>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(singleJob.skills) && singleJob.skills.length > 0 ? (
              singleJob.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-300 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-gray-600 dark:text-gray-300">
                No skills specified
              </span>
            )}
          </div>
        </div>

        {/* About the Company Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 flex-shrink-0 bg-white rounded-lg p-2">
              {singleJob.companyLogo ? (
                <img
                  src={singleJob.companyLogo}
                  alt={`${singleJob.companyName} logo`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <FaBuilding className="w-full h-full text-gray-400" />
              )}
            </div>
            <h2 className="text-xl font-semibold dark:text-white">About {singleJob.companyName}</h2>
          </div>
          <div className="prose dark:prose-invert max-w-none mb-8">
            <p className="text-gray-700 dark:text-gray-300">
              {singleJob.companyDescription || "No company description available"}
            </p>
          </div>
          
          {/* Apply Now Button - Moved to bottom with enhanced design */}
          <div className="flex justify-center">
            <button
              onClick={handleApply}
              className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
            >
              <span className="relative flex items-center">
                Apply Now
                <FaExternalLinkAlt className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;