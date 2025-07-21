import { useState, useEffect, useContext } from "react";
import { useParams, Navigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";
import { differenceInCalendarDays } from "date-fns";

export default function BookingPage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [phone, setPhone] = useState("");
  const [redirect, setRedirect] = useState(null);

  const { user } = useContext(UserContext);

  useEffect(() => {
    if (id) {
      axios.get(`/places/${id}`).then((res) => {
        setPlace(res.data);
      });
    }
  }, [id]);

  if (!place) return <div>Loading...</div>;

  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
  }

  async function bookThisPlace() {
    if (!checkIn || !checkOut) return alert("Select dates");
    if (!user) return alert("Login to book");

    try {
      const response = await axios.post("/bookings", {
        place: place._id,
        checkIn,
        checkOut,
        guests,
        phone,
        price: numberOfNights * place.price,
      });
      const bookingId = response.data._id;
      setRedirect(`/account/bookings/${bookingId}`);
    } catch (err) {
      console.error(err);
      alert("Booking failed. Try again.");
    }
  }

  if (redirect) return <Navigate to={redirect} />;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-4">{place.title}</h1>
      <img
        src={`http://localhost:3000/uploads/${place.photos?.[0]}`}
        alt=""
        className="rounded-lg mb-6"
      />
      <div className="bg-white shadow p-6 rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>Check In:</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label>Check Out:</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label>Guests:</label>
            <input
              type="number"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              min={1}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label>Phone Number:</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        {numberOfNights > 0 && (
          <div className="mt-4">
            <p className="text-lg">
              Total for {numberOfNights} nights:{" "}
              <span className="font-bold">₹{numberOfNights * place.price}</span>
            </p>
          </div>
        )}

        <button
          onClick={bookThisPlace}
          className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg transition"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
