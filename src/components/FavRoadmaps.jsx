import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchStarredRoadmaps, clearStarredRoadmapErrors } from "../store/slices/starredRoadmapSlice";
import { removeStar, downloadRoadmap } from "../store/slices/userSlice";
import { Download, Star } from "lucide-react";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

const FavRoadmaps = () => {
  const { starredRoadmaps, loading, error } = useSelector((state) => state.roadmaps);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // Fetch starred roadmaps on component mount
  useEffect(() => {
    dispatch(fetchStarredRoadmaps());
  }, [dispatch]);

  // Display errors via toast notifications
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearStarredRoadmapErrors());
    }
  }, [error, dispatch]);

  // Handle removing a star from a roadmap
  const handleRemoveStar = (roadmapId) => {
    dispatch(removeStar(roadmapId)).then(() => {
      dispatch(fetchStarredRoadmaps());
    });
  };
  

  // Handle downloading a roadmap
  const handleDownload = (roadmapId, title) => {
    if (!user) {
      toast.error("Please login to download roadmaps");
      return;
    }
    const filename = `${title.toLowerCase().replace(/\s+/g, "-")}-roadmap.pdf`;
    dispatch(downloadRoadmap(roadmapId, filename))
      .then(() => toast.success("Download started successfully"))
      .catch((error) => console.error("Download error:", error));
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white dark:bg-gray-800">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Starred Roadmaps
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Access and manage your starred roadmaps for your learning journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {starredRoadmaps.length > 0 ? (
          starredRoadmaps.map((roadmap) => (
            <div key={roadmap._id} className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{roadmap.niche}</span>
                <button
                  onClick={() => handleRemoveStar(roadmap._id)}
                  className="text-yellow-500 hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-300"
                >
                  <Star size={20} className="fill-current" />
                </button>
              </div>

              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{roadmap.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{roadmap.description}</p>
                <button
                  onClick={() => handleDownload(roadmap._id, roadmap.title)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 
                             bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 
                             text-white rounded-md transition-colors duration-200"
                >
                  <Download className="h-4 w-4" />
                  Download Roadmap
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
            <p>No starred roadmaps found. Start starring roadmaps to view them here!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavRoadmaps;
