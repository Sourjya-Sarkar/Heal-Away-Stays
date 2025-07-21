import { Link, Navigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { UserContext } from "../UserContext";
import { Player } from "@lottiefiles/react-lottie-player";
import axios from "axios";

// Animated logo file (place in /src/assets/lottie/)
import LoginAnimation from "../assets/lottie/Login.json";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUser } = useContext(UserContext);

  // Splash screen logic
  const [showSplash, setShowSplash] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowSplash(false);
    }, 2000); // show splash for 2 seconds
    return () => clearTimeout(timeout);
  }, []);

  async function handleLoginSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post("/login", { email, password });
      setUser(response.data);
      alert("Login successful!");
      setRedirect(true);
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    }
  }

  if (redirect) return <Navigate to="/" />;

  return (
    <>
      {/* Splash Screen */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            className="fixed inset-0 bg-white flex items-center justify-center z-50"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <Player
              autoplay
              loop
              src={LoginAnimation}
              style={{ height: "150px", width: "150px" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Form */}
      {!showSplash && (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
          <motion.div
            className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Centered Animated Logo */}
            <div className="flex justify-center mb-4">
              <Player
                autoplay
                loop
                src={LoginAnimation}
                style={{ height: "80px", width: "80px" }}
              />
            </div>

            <motion.h1
              className="text-3xl font-bold text-center text-indigo-700 mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Welcome Back
            </motion.h1>

            <form className="flex flex-col gap-4" onSubmit={handleLoginSubmit}>
              <motion.input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded transition"
                whileTap={{ scale: 0.98 }}
              >
                Login
              </motion.button>
            </form>

            <div className="text-center mt-6 text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link to="/register" className="text-indigo-600 hover:underline">
                Register
              </Link>
            </div>
            <div className="text-center mt-2 text-sm">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
