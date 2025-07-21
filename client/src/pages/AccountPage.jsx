import { useContext, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";
import PlacesPage from "./PlacesPage";
import AccountNav from "../AccountNav";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

export default function AccountPage() {
  const [redirect, setRedirect] = useState(false);
  const { user, ready, setUser } = useContext(UserContext);
  const { subpage } = useParams();

  async function Logout() {
    await axios.post("/logout");
    setUser(null);
    setRedirect("/");
  }

  if (!ready) return "Loading...";
  if (ready && !user && !redirect) return <Navigate to="/login" />;
  if (redirect) return <Navigate to={redirect} />;

  return (
    <div className="min-h-screen bg-[#f2f7f5] px-4 py-10">
      <AccountNav />

      <AnimatePresence mode="wait">
        {(!subpage || subpage === "profile") && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="flex justify-center mt-12"
          >
            <div className="bg-white shadow-md rounded-xl p-8 max-w-lg w-full text-center border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome, {user.name}
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Logged in as <span className="font-medium">{user.email}</span>
              </p>

              <button
                onClick={Logout}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 transition text-white font-semibold rounded-full shadow-sm"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}

        {subpage === "places" && (
          <motion.div
            key="places"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <PlacesPage />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
