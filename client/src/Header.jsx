import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Player } from "@lottiefiles/react-lottie-player";
import { UserContext } from "./UserContext";
import axios from "axios";
import logoAnimation from "./assets/lottie/Home1.json";
import avatarAnimation from "./assets/lottie/Discord user 2.json";

export default function Header() {
  const { user, setUser } = useContext(UserContext);
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Remove this line (you don't need it anymore)
  // const [searchTerm, setSearchTerm] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?query=${encodeURIComponent(search.trim())}`);
    }
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "";

  const handleLogout = async () => {
    try {
      await axios.post("/logout", {}, { withCredentials: true });
      setUser(null);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };
  return (
    <header className="px-6 py-4 animated-gradient shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* ✨ Animated Logo */}
        <Link to="/" className="flex items-center gap-2 overflow-hidden">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1 }}
          >
            <Player
              autoplay
              loop
              src={logoAnimation}
              style={{ height: 40, width: 40 }}
            />
          </motion.div>
          <motion.span
            layout
            className="font-bold text-xl text-blue-500 whitespace-nowrap"
          >
            HEAL-AWAY-STAYS
          </motion.span>
        </Link>

        {/* Search Bar */}
        <motion.form
          onSubmit={handleSearch}
          className="flex items-center border-gray-200 rounded-full px-4 py-1 w-full max-w-md mx-4 focus-within:ring-2 focus-within:ring-blue-300 transition"
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search wellness stays..."
            className="flex-grow bg-transparent outline-none placeholder-gray-400 text-gray-700"
          />
          <button
            type="submit"
            className="p-2 rounded-full hover:bg-blue-100 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 5.2 5.2a7.5 7.5 0 0 0 11.45 11.45Z"
              />
            </svg>
          </button>
        </motion.form>

        {/* User Avatar / Menu */}
        <motion.div className="relative" ref={dropdownRef}>
          {!user ? (
            <Link
              to="/login"
              className="border border-gray-300 rounded-full p-2 shadow-md bg-white text-blue-500 hover:bg-gray-50 transition"
            >
              <Player
                autoplay
                loop
                src={avatarAnimation}
                style={{ height: 50, width: 50 }}
              />
            </Link>
          ) : (
            <>
              <button
                onClick={() => setDropdownOpen((p) => !p)}
                className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold shadow-md hover:shadow-lg transition"
              >
                {initials}
              </button>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg w-40 z-50 overflow-hidden"
                >
                  <Link
                    to="/account"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(false); // close dropdown first
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </header>
  );
}
