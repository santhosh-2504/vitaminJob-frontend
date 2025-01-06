import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSinglePost, toggleLike, addComment, deleteComment } from '../store/slices/postSlice';
import { FaHeart, FaRegHeart, FaComment, FaShare, FaTrash, FaPaperPlane, FaArrowLeft } from 'react-icons/fa';
import ShareModal from '../components/ShareModal';
import { getInitials, getRandomColor } from '../utils/avatarUtils';
import PropTypes from 'prop-types';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
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
    name: PropTypes.string,
    avatar: PropTypes.string
  }),
  className: PropTypes.string
};

const SinglePost = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { singlePost: post, loading, commentError } = useSelector(state => state.post);
  const { user } = useSelector(state => state.user);
  const [comment, setComment] = useState('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [localComments, setLocalComments] = useState([]);
  const [deleteCommentId, setDeleteCommentId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchSinglePost(id));
    }
  }, [dispatch, id]);

  // Update only localComments when post changes
  useEffect(() => {
    if (post) {
      setLocalComments(post.comments || []);
    }
  }, [post]);

  const handleLike = () => {
    if (!user?._id) {
      toast.error("Please login to like posts");
      navigate('/login');
      return;
    }
    
    dispatch(toggleLike(id));
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user?._id) {
      toast.error("Please login to comment");
      navigate('/login');
      return;
    }
    
    if (comment.trim()) {
      // Optimistic update
      const newComment = {
        _id: Date.now().toString(), // temporary ID
        content: comment,
        user: {
          _id: user._id,
          name: user.name,
          avatar: user.avatar
        },
        createdAt: new Date().toISOString()
      };
      
      setLocalComments(prev => [...prev, newComment]);
      setComment('');

      const success = await dispatch(addComment(id, comment));
      if (!success) {
        // Revert if failed
        setLocalComments(prev => prev.filter(c => c._id !== newComment._id));
        setComment(comment);
      }
    }
  };

  const handleShare = () => {
    if (!user) {
      toast.error("Please login to share posts");
      navigate('/login');
      return;
    }
    
    setIsShareModalOpen(true);
  };

  const handleDeleteComment = async () => {
    if (deleteCommentId) {
      await dispatch(deleteComment(id, deleteCommentId));
      toast.success("Comment deleted successfully");
      setShowDeleteModal(false);
      setDeleteCommentId(null);
    }
  };

  const renderShareModal = () => {
    if (!post) return null;
    
    return (
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        postId={post._id || ''}
        title={post.content || ''}
      />
    );
  };

  const DeleteConfirmationModal = () => (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center ${showDeleteModal ? '' : 'hidden'}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm mx-4">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">Delete Comment</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Are you sure you want to delete this comment?</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => {
              setShowDeleteModal(false);
              setDeleteCommentId(null);
            }}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteComment}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <Spinner />;
  }

  if (!post) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Post not found</p>
      </div>
    );
  }

  return (
    <>
    <Helmet>
      <title>Blogs | Vitamin Job</title>
      <meta name="description" content="Read this blog and learn something new today." />

    </Helmet>
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-20">
      <div className="max-w-3xl mx-auto px-4 mb-6">
        <button
          onClick={() => navigate('/posts')}
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200"
        >
          <FaArrowLeft />
          <span>Back to Feed</span>
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Post Header */}
          <div className="p-6 border-b dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <Avatar 
                user={post.author}
                className="w-12 h-12"
              />
              <div>
                <h4 className="font-semibold dark:text-white">{post.author?.name}</h4>
                <p className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4 dark:text-white">{post.title}</h1>
            <p className="text-gray-700 dark:text-gray-300 mb-6">{post.content}</p>
            {post.image && (
              <img 
                src={post.image} 
                alt="post content" 
                className="w-full rounded-lg mb-6"
              />
            )}

            {/* Engagement Stats */}
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-6">
              <span>{post.likes?.length || 0} likes</span>
              <span>{localComments.length || 0} comments</span>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-around py-4 border-t border-b dark:border-gray-700">
              <button 
                onClick={handleLike}
                className={`flex items-center space-x-2 ${
                  post.likes?.includes(user?._id) 
                    ? 'text-blue-500' 
                    : 'text-gray-500 hover:text-blue-500'
                } transition-colors duration-200`}
              >
                {post.likes?.includes(user?._id) ? (
                  <FaHeart className="text-xl" />
                ) : (
                  <FaRegHeart className="text-xl" />
                )}
                <span>Like</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors duration-200">
                <FaComment className="text-xl" />
                <span>Comment</span>
              </button>
              <button 
                onClick={handleShare}
                className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors duration-200"
              >
                <FaShare className="text-xl" />
                <span>Share</span>
              </button>
            </div>

            {/* Comments Section */}
            <div className="mt-6">
              <h3 className="font-semibold mb-4 dark:text-white">Comments</h3>
              
              {/* Comment Form */}
              {user ? (
                <form onSubmit={handleComment} className="mb-6">
                  {commentError && (
                    <p className="text-red-500 mb-2">{commentError}</p>
                  )}
                  <div className="flex space-x-4">
                    <Avatar 
                      user={user}
                      className="w-10 h-10"
                    />
                    <div className="flex-1 relative">
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full px-4 py-3 pr-12 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-none"
                        rows="1"
                      />
                      <button 
                        type="submit"
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-blue-500 hover:text-blue-600 transition-colors duration-200 disabled:text-gray-400"
                        disabled={!comment.trim()}
                      >
                        <FaPaperPlane 
                          className="text-xl transform rotate-90" 
                          style={{ transform: 'rotate(45deg)' }}
                        />
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <p className="text-gray-500 mb-4">Please login to comment</p>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {localComments.map((comment) => (
                  comment && comment.user && (
                    <div key={comment._id} className="flex space-x-4 group">
                      <Avatar 
                        user={comment.user}
                        className="w-10 h-10"
                      />
                      <div className="flex-1">
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold dark:text-white">
                                {comment.user?.name || 'Anonymous'}
                              </h4>
                              <span className="text-sm text-gray-500">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            {user && comment.user._id === user._id && (
                              <button
                                onClick={() => {
                                  setDeleteCommentId(comment._id);
                                  setShowDeleteModal(true);
                                }}
                                className="text-gray-400 hover:text-red-500 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                              >
                                <FaTrash size={14} />
                              </button>
                            )}
                          </div>
                          <p className="mt-2 text-gray-700 dark:text-gray-300">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                ))}
                {localComments.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No comments yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {renderShareModal()}
      <DeleteConfirmationModal />
    </div>
  );
};

export default SinglePost;