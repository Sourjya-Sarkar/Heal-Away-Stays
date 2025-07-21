import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function PlaceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  /* ---------------- Fetch place ---------------- */
  useEffect(() => {
    async function fetchPlace() {
      try {
        const res = await fetch(`http://localhost:3000/places/${id}`);
        if (!res.ok) throw new Error("Place not found");
        setPlace(await res.json());
        setError(false);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchPlace();
  }, [id]);

  function goToBookingPage() {
    navigate(`/book/${place._id}`);
  }

  /* ---------------- Loading / Error ---------------- */
  if (loading)
    return <div className="p-6 text-center text-gray-500">Loading…</div>;
  if (error || !place)
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load place. Please try again later.
      </div>
    );

  /* ---------------- Page ---------------- */
  return (
    <motion.div
      className="max-w-4xl mx-auto px-4 py-8 space-y-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Title & Address */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-3xl font-bold text-blue-900">{place.title}</h1>
        <p className="text-gray-600">{place.address}</p>
      </motion.div>

      {/* Photo grid */}
      <motion.div
        className="grid sm:grid-cols-2 gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {place.photos?.map((url, i) => (
          <motion.img
            key={i}
            src={`http://localhost:3000/uploads/${url}`}
            alt=""
            className="rounded-lg w-full h-48 object-cover"
            whileHover={{ scale: 1.03 }}
          />
        ))}
      </motion.div>

      {/* Description */}
      <section>
        <h2 className="text-xl font-semibold mb-1">Description</h2>
        <p className="text-gray-700">{place.description}</p>
      </section>

      {/* Perks */}
      {place.perks?.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-1">Perks</h2>
          <ul className="flex flex-wrap gap-2 text-sm text-gray-600">
            {place.perks.map((perk) => (
              <li
                key={perk}
                className="bg-gray-100 px-3 py-1 rounded hover:scale-[1.03] transition"
              >
                {perk}
              </li>
            ))}
          </ul>
        </section>
      )}
      <section className="space-y-6">
        {/* Map Section */}
        <div className="h-64 rounded overflow-hidden">
          <MapContainer
            center={[place.latitude || 20.5937, place.longitude || 78.9629]}
            zoom={13}
            scrollWheelZoom={false}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[place.latitude || 20.5937, place.longitude || 78.9629]}
            >
              <Popup>{place.title}</Popup>
            </Marker>
          </MapContainer>
        </div>

        {/* Animated Booking Box */}
        <motion.div
          className="mt-8 bg-white shadow-lg rounded-xl px-6 py-5 text-center max-w-md mx-auto border"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-3xl font-bold text-gray-900 mb-2">
            ₹{place.price}{" "}
            <span className="text-base font-medium text-gray-600">/night</span>
          </div>

          <motion.button
            onClick={goToBookingPage}
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Book Now
          </motion.button>
        </motion.div>
      </section>
    </motion.div>
  );
}
