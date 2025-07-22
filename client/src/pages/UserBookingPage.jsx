import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { format } from "date-fns";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
const API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:3000"
  : "https://heal-away-stays.onrender.com";
export default function UserBookingPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get("/bookings").then((res) => {
      setBookings(res.data);
    });
  }, []);

  function cancelBooking(id) {
    const reason = prompt("Why are you cancelling this booking?");
    if (!reason) return;

    if (window.confirm("Are you sure you want to cancel this booking?")) {
      axios
        .delete(`/bookings/${id}`, { data: { reason } }) // pass reason in body
        .then(() => {
          setBookings((prev) => prev.filter((b) => b._id !== id));
        })
        .catch(() => {
          alert("Cancellation failed. Try again.");
        });
    }
  }

  return (
    <motion.div
      className="max-w-6xl mx-auto px-4 py-8"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-blue-900 mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-600 text-lg">No bookings yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <AnimatePresence>
            {bookings.map((booking) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 120 }}
              >
                <div className="relative">
                  <Link
                    to={`/place/${booking.place._id}`}
                    className="block bg-white border rounded-lg shadow hover:shadow-md transition overflow-hidden"
                  >
                    <img
                      src={`${API_BASE_URL}/uploads/${booking.place.photos[0]}`}
                      alt={booking.place.title}
                      className="h-48 w-full object-cover"
                    />

                    <div className="p-4 space-y-2">
                      <h2 className="text-xl font-semibold text-gray-800">
                        {booking.place.title}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {format(new Date(booking.checkIn), "MMM d, yyyy")} →{" "}
                        {format(new Date(booking.checkOut), "MMM d, yyyy")}
                      </p>
                      <p className="text-sm text-gray-600">
                        Guests: <strong>{booking.guests}</strong>
                      </p>
                      <p className="text-sm text-gray-600">
                        Phone: {booking.phone}
                      </p>
                      <p className="text-sm font-medium text-blue-600">
                        Total Paid: ₹{booking.price}
                      </p>
                    </div>
                  </Link>

                  {/* Cancel Button */}
                  <button
                    onClick={() => cancelBooking(booking._id)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
