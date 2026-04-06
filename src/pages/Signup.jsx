// src/pages/Signup.jsx
import { useState } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import Content from "../components/Content";
import toast from "react-hot-toast";
import { getErrorMessage } from "./Login";
import { sendEmailVerification } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function Signup() {
  const { signup, googleLogin } = useAuth();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const [focused, setFocused] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFocus = (field) => {
    setFocused({ ...focused, [field]: true });
  };

  const handleBlur = (field) => {
    if (!form[field]) {
      setFocused({ ...focused, [field]: false });
    }
  };

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()[\]{}<>~_+=|\\\/.,:;'"-]).{8,}$/;


const handleSubmit = async (e) => {
  e.preventDefault();

  if (form.password.trim() !== form.confirmPassword.trim()) {
    return toast.error("Passwords do not match");
  }

  if (!passwordRegex.test(form.password)) {
    return toast.error(
      "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
    );
  }

  setLoading(true);

  try {
    const res = await signup(form.email, form.password);

    // Send verification email
    await sendEmailVerification(res.user);

    // Show popup
    setShowVerifyModal(true);

    toast.success("Account created! Verify your email.");

    // Start polling for verification
    const interval = setInterval(async () => {
      await res.user.reload(); // refresh user object
      if (res.user.emailVerified) {
        clearInterval(interval);

        // Update Firestore emailVerified field
        await setDoc(
          doc(db, "users", res.user.uid),
          { emailVerified: true },
          { merge: true }
        );

        setShowVerifyModal(false);
        toast.success("Email verified! Redirecting...");
        navigate("/dashboard");
      }
    }, 3000); // check every 3 seconds
  } catch (err) {
    toast.error(getErrorMessage(err) || "Failed to create account");
  } finally {
    setLoading(false);
  }
};

const handleResendEmail = async () => {
  try {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
      toast.success("Verification email resent");
    }
  } catch (err) {
    console.log(err);
    
    toast.error("Failed to resend email");
  }
};

  const handleGoogle = async () => {
    try {
      await googleLogin();
      toast.success('Google signup successful!')
      navigate("/dashboard");
    } catch (err) {
      toast.error(getErrorMessage(err) || "Google sign-in failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-white lg:h-screen pb-10 flex flex-col-reverse lg:flex-row items-stretch">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-3">
        <div className="bg-white rounded-md w-full overflow-hidden">
          
          <div className="p-6 md:p-8">
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
<div className="relative">
  <label
    htmlFor="email"
    className={`absolute left-3 transition-all duration-200 pointer-events-none ${
      focused.email || form.email
        ? "text-xs -top-2 bg-white px-1 text-[#00786A]"
        : "text-gray-500 text-sm top-4"
    }`}
  >
    Email Address
  </label>

    <input
      type="email"
      id="email"
      name="email"
      value={form.email}
      onChange={handleChange}
      onFocus={() => handleFocus("email")}
      onBlur={() => handleBlur("email")}
      className="w-full px-3 py-2 border-b-2 border-gray-300 focus:outline-none focus:border-b-[#00786A] transition"
      required
    />
</div>
              
              {/* Password Field */}
              <div className="relative">
                <label
                  htmlFor="password"
                  className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                    focused.password || form.password
                      ? "text-xs -top-2 bg-white px-1 text-[#00786A]"
                      : "text-gray-500 text-sm top-4"
                  }`}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    onFocus={() => handleFocus("password")}
                    onBlur={() => handleBlur("password")}
                    className="w-full px-3 py-2 border-b-2 border-gray-300 focus:outline-none focus:border-b-[#00786A] transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>
              </div>
              
              {/* Confirm Password Field */}
              <div className="relative">
                <label
                  htmlFor="confirmPassword"
                  className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                    focused.confirmPassword || form.confirmPassword
                      ? "text-xs -top-2 bg-white px-1 text-[#00786A]"
                      : "text-gray-500 text-sm top-4"
                  }`}
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => handleFocus("confirmPassword")}
                  onBlur={() => handleBlur("confirmPassword")}
                  className="w-full px-3 py-2 border-b-2 border-gray-300 focus:outline-none focus:border-b-[#00786A] transition"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00786A] cursor-pointer text-white font-semibold py-3 px-4 rounded-md hover:bg-[#004D3E] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <button
              onClick={handleGoogle}
              className="w-full flex items-center cursor-pointer justify-center gap-3 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-md transition"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            
            <p className="text-center text-gray-600 mt-3">
              Already have an account?{" "}
              <Link to="/login" className="text-[#00786A] hover:text-[#004D3E] font-semibold transition">
                Login
              </Link>
            </p>
            
            <p className="text-xs text-gray-500 text-center mt-3">
              By signing up, you agree to our <NavLink style={{ textDecoration: 'underline' }} to={'/privacy'} className="cursor-pointer">Terms and Policy</NavLink>
            </p>
          </div>
        </div>
      </div>

      {showVerifyModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-[90%] max-w-sm text-center shadow-lg">
      
      <h2 className="text-xl font-semibold mb-2">
        Verify your email
      </h2>

      <p className="text-gray-600 text-sm mb-4">
        We've sent a verification link to your email address.
        Please verify your email before continuing.
      </p>

      <button
        onClick={handleResendEmail}
        className="w-full mb-2 bg-[#00786A] text-white py-2 rounded-md hover:bg-[#004D3E]"
      >
        Resend Email
      </button>
    </div>
  </div>
)}

      {/* Right Side - Content */}
      <Content/>
    </div>
  );
}