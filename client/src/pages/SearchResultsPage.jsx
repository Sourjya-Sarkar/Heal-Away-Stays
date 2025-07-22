import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
const API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:3000"
  : "https://heal-away-stays.onrender.com";

export default function SearchResultsPage() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      axios
        .get(`/search?query=${query}`)
        .then((res) => setPlaces(res.data))
        .catch((err) => console.error("Search error:", err))
        .finally(() => setLoading(false));
    }
  }, [query]);

  return (
    <motion.div
      className="max-w-6xl mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Search Results for "<span className="text-indigo-600">{query}</span>"
      </h1>

      {loading ? (
        <p className="text-gray-500">Searching for wellness stays...</p>
      ) : places.length === 0 ? (
        <p className="text-gray-600">No results found for your search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {places.map((place) => (
            <motion.div
              key={place._id}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 120 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <Link to={`/place/${place._id}`}>
                <img
                  src={`${API_BASE_URL}/uploads/${place.photos[0]}`}
                  alt={place.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 space-y-2">
                  <h2 className="text-lg font-bold text-gray-800">
                    {place.title}
                  </h2>
                  <p className="text-sm text-gray-600">{place.address}</p>
                  <p className="text-indigo-600 font-semibold">
                    ₹{place.price} / night
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
