import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearAllUserErrors, login, resetAuthErrors } from "../store/slices/userSlice";
import { toast } from "react-toastify";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Only get loading and error from Redux state
  const { loading, error } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  // Check authentication status only after successful login
  const { isAuthenticated } = useSelector((state) => state.user);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    const loginData = {
      email,
      password
    };
    dispatch(login(loginData));
  };

  // Reset auth errors when component mounts
  useEffect(() => {
    dispatch(resetAuthErrors());
    // Reset scroll position
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [dispatch]);

  // Navigate after successful login
  useEffect(() => {
    if (isAuthenticated) {
      navigateTo("/");
    }
  }, [isAuthenticated, navigateTo]);

  // Handle errors
  useEffect(() => {
    if (error && error !== "User not authenticated") {
      toast.error(error);
      dispatch(clearAllUserErrors());
    }
  }, [error, dispatch]);

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h3 className="text-2xl font-semibold text-center text-gray-900 dark:text-white mb-6">
          Login to Your Account
        </h3>
        <form onSubmit={handleLogin}>
          {/* Email Field */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-md mt-2 p-2 bg-gray-50 dark:bg-gray-700">
              <MdOutlineMailOutline className="text-xl text-gray-500 dark:text-gray-400" />
              <input
                type="email"
                id="email"
                placeholder="youremail@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-transparent border-none focus:outline-none px-2 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-md mt-2 p-2 bg-gray-50 dark:bg-gray-700">
              <RiLock2Fill className="text-xl text-gray-500 dark:text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="flex-1 bg-transparent border-none focus:outline-none px-2 text-gray-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 dark:text-gray-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white font-medium rounded-md transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Register Link */}
          <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-500 dark:text-blue-400 hover:underline"
            >
              Register Now
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Login;