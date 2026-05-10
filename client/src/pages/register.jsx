import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/authContext";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validatePassword = (password) => {
    const minLength = /.{8,}/;
    const uppercase = /[A-Z]/;
    const lowercase = /[a-z]/;
    const number = /[0-9]/;
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/;
    return (
      minLength.test(password) &&
      uppercase.test(password) &&
      lowercase.test(password) &&
      number.test(password) &&
      specialChar.test(password)
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // check passwords match
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    // validate password strength
    if (!validatePassword(formData.password)) {
      return setError(
        "Password must be at least 8 characters and include uppercase, lowercase, number and special character"
      );
    }

    setLoading(true);
    try {
      const res = await api.post("/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password, // only send password, not confirmPassword
      });
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">

      {/* Left Side */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-indigo-600 text-white p-10">
        <h1 className="text-4xl font-bold mb-4">StudyTogether</h1>
        <p className="text-lg text-indigo-200 text-center max-w-sm">
          Join thousands of students studying smarter together.
        </p>
      </div>

      {/* Right Side */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-10">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Create Account
          </h2>

          {error && (
            <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500"
              required
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create Password"
                value={formData.password}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:border-indigo-500 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:border-indigo-500 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Password hint */}
            <p className="text-xs text-gray-400">
              Must be 8+ characters with uppercase, lowercase, number and special character
            </p>

            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>

          <p className="text-gray-500 text-sm text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
};

export default Register;