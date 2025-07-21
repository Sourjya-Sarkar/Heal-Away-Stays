import { Link, Navigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Player } from "@lottiefiles/react-lottie-player";
import axios from "axios";
import { UserContext } from "../UserContext";

// Lottie animations
import RegisterAnimation from "../assets/lottie/Register.json"; // Use the same or a custom register animation
import SuccessAnimation from "../assets/lottie/Check_register.json"; // Optional: a success animation

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const { setUser } = useContext(UserContext);

  // Splash screen timeout
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  async function registerUser(e) {
    e.preventDefault();
    try {
      await axios.post("/register", { name, email, password });

      // Automatically log in after registration
      const { data } = await axios.post("/login", { email, password });
      setUser(data); // <-- sets user context

      setShowSuccess(true);
      setTimeout(() => setRedirect(true), 2000);
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response?.status === 409) {
        alert("User already exists. Please log in.");
      } else {
        alert("Registration failed. Please try again.");
      }
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
              src={RegisterAnimation}
              style={{ height: "150px", width: "150px" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Registration Success Animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed inset-0 bg-white flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
          >
            <Player
              autoplay
              src={SuccessAnimation}
              style={{ height: "200px", width: "200px" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Registration Form */}
      {!showSplash && !showSuccess && (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-100 px-4">
          <motion.div
            className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <Player
                autoplay
                loop
                src={RegisterAnimation}
                style={{ height: "80px", width: "80px" }}
              />
            </div>

            <motion.h1
              className="text-3xl font-bold text-center text-indigo-700 mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Create Account
            </motion.h1>

            <form className="flex flex-col gap-4" onSubmit={registerUser}>
              <motion.input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                whileFocus={{ scale: 1.02 }}
              />
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
                Register
              </motion.button>
            </form>

            <div className="text-center mt-6 text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-600 hover:underline">
                Login
              </Link>
            </div>
            <div className="text-center mt-2 text-sm">
              <a
                href="/forgot-password"
                className="text-indigo-500 hover:underline"
              >
                Forgot Password?
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
