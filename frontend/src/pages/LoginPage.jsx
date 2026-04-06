// Enhanced LoginPage.jsx
import { useState } from "react";
import { ShipWheelIcon, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Link } from "react-router";
import useLogin from "../hooks/useLogin";
import { motion } from "framer-motion"; 

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { isPending, error, loginMutation } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    // Basic client-side validation
    if (!loginData.email || !loginData.password) {
      alert("Please fill in all fields.");
      return;
    }
    loginMutation(loginData);
    if (rememberMe) {
      // Implement localStorage persistence if needed
      localStorage.setItem("rememberMe", "true");
    }
  };

  const handleInputChange = (field, value) => {
    setLoginData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-base-200 to-base-300"
      data-theme="forest"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="border border-primary/20 flex flex-col lg:flex-row w-full max-w-6xl mx-auto bg-base-100/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* LOGIN FORM SECTION */}
        <motion.div
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-center"
        >
          {/* LOGO */}
          <div className="mb-6 flex items-center justify-start gap-3">
            <motion.div
              whileHover={{ scale: 1.05, rotate: -5 }}
              className="p-2 bg-primary/10 rounded-full"
            >
              <ShipWheelIcon className="size-8 text-primary" />
            </motion.div>
            <span className="text-3xl lg:text-4xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent tracking-wider">
              Streamify
            </span>
          </div>

          {/* ERROR MESSAGE DISPLAY */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="alert alert-error mb-6 shadow-lg"
            >
              <span>{error.response?.data?.message || "Invalid credentials. Please try again."}</span>
            </motion.div>
          )}

          <div className="w-full">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl lg:text-3xl font-bold text-base-content">
                  Welcome Back
                </h2>
                <p className="text-sm opacity-70">
                  Sign in to continue your immersive language journey with Streamify
                </p>
              </div>

              <div className="space-y-5">
                <div className="relative form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Email Address</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50 w-4 h-4" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="input input-bordered w-full pl-10 pr-4 py-3 focus:input-primary transition-colors"
                      value={loginData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="relative form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Password</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50 w-4 h-4" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="input input-bordered w-full pl-10 pr-10 py-3 focus:input-primary transition-colors"
                      value={loginData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/50 hover:text-primary transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-3 p-3 bg-base-200 rounded-lg">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary checkbox-sm"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span className="text-sm leading-tight">Remember me</span>
                  </label>
                </div>

                <Link
                  to="/forgot-password"
                  className="block text-right text-sm text-primary hover:underline font-medium"
                >
                  Forgot Password?
                </Link>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isPending}
                className="btn btn-primary w-full text-base py-3 shadow-lg hover:shadow-xl transition-shadow"
                type="submit"
              >
                {isPending ? (
                  <>
                    <span className="loading loading-spinner loading-sm mr-2"></span>
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </motion.button>

              <div className="text-center">
                <p className="text-sm opacity-80">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-primary hover:underline font-medium">
                    Create one now
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </motion.div>

        {/* IMAGE SECTION */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 items-center justify-center relative overflow-hidden"
        >
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--fallback-p,#a78bfa,oklch(0.618 0.186 289.4))_0%,transparent_50%)]" />
          </div>
          <div className="relative max-w-md p-8 lg:p-12 z-10">
            {/* Enhanced Illustration */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="relative aspect-square max-w-xs lg:max-w-sm mx-auto mb-6"
            >
              <img
                src="/i.png" // Suggest: Replace with a high-quality SVG of users connecting via speech bubbles
                alt="Global language connections illustration"
                className="w-full h-full rounded-xl shadow-lg object-cover"
              />
            </motion.div>

            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-base-content">
                Unlock Your World
              </h2>
              <p className="text-sm opacity-80 leading-relaxed">
                Reconnect with your learning community, dive into engaging conversations, and elevate your fluency with every session.
              </p>
              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-4 mt-6 text-xs opacity-70">
                <div className="text-center">
                  <div className="font-bold text-primary text-lg">50K+</div>
                  <div>Active Users</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-secondary text-lg">100+</div>
                  <div>Languages</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-accent text-lg">1M+</div>
                  <div>Sessions</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;