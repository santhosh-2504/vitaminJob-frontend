import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchBookmarkedJobs, clearBookmarkErrors } from "../store/slices/bookmarkSlice.js";
import { removeBookmark } from "../store/slices/userSlice.js";
import { FaBookmark, FaMapMarkerAlt, FaDollarSign } from "react-icons/fa";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";


const Bookmarks = () => {
  const dispatch = useDispatch();
  const { bookmarkedJobs, loading, error } = useSelector((state) => state.bookmarks);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (user) {
      dispatch(fetchBookmarkedJobs());
    }

    return () => {
      dispatch(clearBookmarkErrors());
    };
  }, [dispatch, user]);

  const handleRemoveBookmark = async (jobId) => {
    try {
      const resultAction = await dispatch(removeBookmark(jobId)).unwrap();
      if (resultAction) {
        await dispatch(fetchBookmarkedJobs());
        toast.success("Bookmark removed successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (err) {
      console.error("Error removing bookmark:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] bg-gray-100 dark:bg-gray-900">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white dark:bg-gray-800">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Your Bookmarks</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Manage and explore the jobs you&apos;ve saved for future opportunities
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookmarkedJobs.length > 0 ? (
          bookmarkedJobs.map((job) => (
            <div key={job._id} className="relative bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Bookmarked</span>
                <button
                  onClick={() => handleRemoveBookmark(job._id)}
                  className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                >
                  <FaBookmark size={20} />
                </button>
              </div>

              <div className="p-4 pb-16">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{job.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{job.companyName}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{job.location ? job.location.join(", ") : "N/A"}</span>
                  </div>
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <FaDollarSign className="mr-2" />
                    <span>{job.salary}</span>
                  </div>
                </div>
              </div>

              <Link
                to={`/apply/${job._id}`}
                className="absolute bottom-4 left-4 right-4 block text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 
                             dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-md 
                             transition-colors duration-200"
              >
                View Details
              </Link>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
            <p>No bookmarks found. Start bookmarking jobs to view them here!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
