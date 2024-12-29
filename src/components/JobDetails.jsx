import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MdLocationOn, MdWork, MdAttachMoney, MdLabel } from "react-icons/md";
import { fetchSingleJob } from "../store/slices/jobSlice";
import Spinner from "../components/Spinner";
import { FaExternalLinkAlt, FaArrowLeft } from "react-icons/fa";


const JobDetails = () => {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const { singleJob, loading, error } = useSelector((state) => state.jobs);
  const navigate = useNavigate();

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
    // Simply open the application link
    window.open(singleJob.applyLink, '_blank');
  };

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
        {/* Add Back Button */}
        <button
          onClick={handleBack}
          className="mb-6 flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to Jobs
        </button>

        {/* Job Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between">
            <div className="flex items-center space-x-4">
              {singleJob.companyLogo ? (
                <div className="w-16 h-16 flex items-center justify-center rounded-xl overflow-hidden bg-white">
                  <img
                    src={singleJob.companyLogo}
                    alt={`${singleJob.companyName} logo`}
                    className="w-14 h-14 object-contain"
                  />
                </div>
              ) : (
                <div>
                </div>
              )}
              <div>
                <h1 className="text-2xl font-semibold dark:text-white">{singleJob.title}</h1>
                <p className="text-gray-600 dark:text-gray-400">{singleJob.companyName}</p>
              </div>
            </div>
          </div>

          {/* Job Quick Details */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <MdLocationOn className="text-gray-600 dark:text-gray-400 text-xl" />
              <span className="dark:text-gray-300">
                {Array.isArray(singleJob.location)
                  ? singleJob.location.join(", ")
                  : singleJob.location || "Not specified"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <MdAttachMoney className="text-gray-600 dark:text-gray-400 text-xl" />
              <span className="dark:text-gray-300">{singleJob.salary || "Not specified"}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MdWork className="text-gray-600 dark:text-gray-400 text-xl" />
              <span className="dark:text-gray-300">{singleJob.jobType || "Not specified"}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MdLabel className="text-gray-600 dark:text-gray-400 text-xl" />
              <span className="dark:text-gray-300">{singleJob.niche || "Not specified"}</span>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Job Description</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {singleJob.shortDescription || "No short description available"}
          </p>
          <h3 className="text-lg font-medium mb-2 dark:text-white">Detailed Overview</h3>
          <p className="text-gray-700 dark:text-gray-300">
            {singleJob.lengthyDescription || "No detailed description available"}
          </p>
        </div>

        {/* Skills Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Required Skills</h2>
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

        {/* Apply Button - simplified version */}
        <div className="text-center mt-6">
          <button
            onClick={handleApply}
            className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-lg transform transition-all duration-200"
          >
            Apply Now
            <FaExternalLinkAlt className="ml-2 w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;