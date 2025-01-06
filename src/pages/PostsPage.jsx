import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaComment, FaShare } from 'react-icons/fa';
import ShareModal from '../components/ShareModal';
import { fetchPosts, toggleLike, addComment } from '../store/slices/postSlice';
import PropTypes from 'prop-types';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import { getInitials, getRandomColor } from '../utils/avatarUtils';
import useScrollToTop from '../hooks/useScrollToTop';
import { Helmet } from 'react-helmet-async';

const Avatar = ({ user, className }) => {
  if (!user) return null;
  
  if (user.avatar) {
    return (
      <img 
        src={user.avatar}
        alt={user.name}
        className={`${className} rounded-full`}
      />
    );
  }

  return (
    <div className={`${className} rounded-full ${getRandomColor(user.name)} flex items-center justify-center text-white font-semibold`}>
      {getInitials(user.name)}
    </div>
  );
};

Avatar.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string
  }),
  className: PropTypes.string
};

const PostCard = ({ post: initialPost }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.user);
  const [post, setPost] = useState(initialPost);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  // Update local post when props change
  useEffect(() => {
    if (initialPost) {
      setPost(initialPost);
    }
  }, [initialPost]);

  const handleLike = async () => {
    if (!user?._id) {
      toast.error("Please login to like posts");
      navigate('/login');
      return;
    }

    // Optimistic update
    const isLiked = post.likes?.includes(user._id);
    setPost(prev => ({
      ...prev,
      likes: isLiked 
        ? prev.likes?.filter(id => id !== user._id) || []
        : [...(prev.likes || []), user._id]
    }));

    await dispatch(toggleLike(post._id));
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user?._id) {
      toast.error("Please login to comment");
      navigate('/login');
      return;
    }

    if (commentText.trim()) {
      const newComment = {
        _id: Date.now().toString(),
        content: commentText,
        user: {
          _id: user._id,
          name: user.name,
          avatar: user.avatar
        },
        createdAt: new Date().toISOString()
      };

      setPost(prev => ({
        ...prev,
        comments: [...(prev.comments || []), newComment]
      }));

      setCommentText('');
      await dispatch(addComment(post._id, commentText));
    }
  };

  const handleViewFullPost = () => {
    if (!user?._id) {
      toast.error("Please login to view full post");
      navigate('/login');
      return;
    }
    navigate(`/post/${post._id}`);
  };

  const displayComments = post.comments?.slice(0, 3) || [];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
      {/* Post Header */}
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <img 
            src="/logo.png"
            alt="Vitamin Job"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h4 className="font-semibold dark:text-white">Vitamin Job</h4>
            <p className="text-sm text-gray-500">
              {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Date not available'}
            </p>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 py-3 border-t border-b dark:border-gray-700">
        <p className="text-gray-800 dark:text-gray-200">{post.title}</p>
      </div>

      {/* Engagement Stats */}
      <div className="px-4 py-2 flex items-center justify-between text-sm text-gray-500">
        <span>{post.likes?.length || 0} likes</span>
        <span>{post.comments?.length || 0} comments</span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between px-4 py-2 border-t dark:border-gray-700">
        <div className="flex space-x-6">
          <button 
            onClick={handleLike}
            className={`flex items-center space-x-2 ${
              post.likes?.includes(user?._id) ? 'text-red-500' : 'text-gray-500'
            } hover:text-red-500`}
          >
            {post.likes?.includes(user?._id) ? <FaHeart /> : <FaRegHeart />}
            <span>Like</span>
          </button>

          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 text-gray-500 hover:text-blue-500"
          >
            <FaComment />
            <span>Comment</span>
          </button>

          <button 
            onClick={() => setShowShareModal(true)}
            className="flex items-center space-x-2 text-gray-500 hover:text-green-500"
          >
            <FaShare />
            <span>Share</span>
          </button>
        </div>

        <button
          onClick={handleViewFullPost}
          className="text-blue-500 hover:text-blue-600 text-sm font-medium"
        >
          View Full Post
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="p-4 border-t dark:border-gray-700">
          <form onSubmit={handleComment} className="mb-4">
            <div className="flex space-x-3">
              <Avatar 
                user={user}
                className="w-8 h-8"
              />
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-4 py-2 rounded-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
              >
                Post
              </button>
            </div>
          </form>

          <div className="space-y-3">
            {displayComments.map(comment => (
              <div key={comment._id} className="flex space-x-3">
                <Avatar 
                  user={comment.user}
                  className="w-8 h-8"
                />
                <div className="flex-1 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <p className="font-medium dark:text-white">{comment.user?.name || 'Anonymous'}</p>
                  <p className="text-gray-600 dark:text-gray-300">{comment.content}</p>
                </div>
              </div>
            ))}
            {post.comments?.length > 3 && (
              <button
                onClick={() => navigate(`/post/${post._id}`)}
                className="text-blue-500 hover:text-blue-600 text-sm"
              >
                View all {post.comments.length} comments
              </button>
            )}
          </div>
        </div>
      )}

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        postId={post._id}
        title={post.content}
      />
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string,
    likes: PropTypes.array,
    comments: PropTypes.array
  }).isRequired
};

const PostsPage = () => {
  const dispatch = useDispatch();
  const { posts, loading, error, totalPosts, totalPages } = useSelector(state => state.post);
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef(null);
  
  // Get currentPage from localStorage or URL params
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem('postsCurrentPage');
    return savedPage ? parseInt(savedPage) : 1;
  });

  // Fetch posts with pagination and search
  useEffect(() => {
    dispatch(fetchPosts({ 
      page: currentPage, 
      limit: 4,
      searchKeyword: searchTerm 
    }));
  }, [dispatch, currentPage, searchTerm]);

  // Focus search input after posts load
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [posts]);

  // Save current page to localStorage and URL
  useEffect(() => {
    localStorage.setItem('postsCurrentPage', currentPage.toString());
    // Update URL with current page
    const url = new URL(window.location);
    url.searchParams.set('page', currentPage.toString());
    window.history.replaceState({}, '', url);
  }, [currentPage]);

  // Initialize page from URL on component mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get('page');
    if (pageParam) {
      const parsedPage = parseInt(pageParam);
      setCurrentPage(parsedPage);
      localStorage.setItem('postsCurrentPage', parsedPage.toString());
    }
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
    localStorage.setItem('postsCurrentPage', '1');
  };

  useScrollToTop();

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
    <Helmet>
      <title>Posts | Vitamin Job</title>
      <meta name="description" content="Read the latest posts and news from Vitamin Job. Stay updated with the latest job opportunities and industry trends." />

    </Helmet>
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      {/* Search Section */}
      <div className="fixed top-16 left-0 right-0 z-10 bg-gray-100 dark:bg-gray-900 px-4 py-2">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 mt-8 pt-28">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {posts?.map(post => (
          <PostCard key={post._id} post={post} />
        ))}
        
        {!loading && posts?.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No posts found
          </div>
        )}

        {/* Pagination */}
        {totalPosts > 0 && (
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
              Page {currentPage} of {totalPages} ({totalPosts} total posts)
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
      </div>
    </div>
    </>
  );
};

export default PostsPage;