import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import PlacesFormPage from "./PlacesFormPage";
const API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:3000"
  : "https://heal-away-stays.onrender.com";

export default function PlacesPage() {
  const { action } = useParams();
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    if (action !== "new") {
      axios.get("/user-places").then((response) => {
        setPlaces(response.data);
      });
    }
  }, [action]);

  function handleDelete(id) {
    if (confirm("Delete this place?")) {
      axios.delete(`/places/${id}`).then(() => {
        setPlaces((prev) => prev.filter((p) => p._id !== id));
      });
    }
  }

  return (
    <div>
      {action !== "new" && (
        <div className="mt-8">
          <div className="text-center mb-4">
            <Link
              className="inline-flex gap-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-full"
              to={"/account/places/new"}
            >
              Add New Place
            </Link>
          </div>

          <div className="grid gap-4">
            {places.length > 0 ? (
              places.map((place) => (
                <div
                  key={place._id}
                  className="flex gap-4 bg-gray-100 p-4 rounded-xl relative"
                >
                  <div className="w-32 h-32 bg-gray-300 rounded-lg overflow-hidden">
                    {place.photos?.[0] && (
                      <img
                        src={`${API_BASE_URL}/uploads/${place.photos[0]}`}
                        alt={place.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="grow">
                    <h2 className="text-xl font-semibold">{place.title}</h2>
                    <p className="text-sm text-gray-600">{place.description}</p>
                    <div className="flex gap-4 mt-2">
                      <Link
                        to={`/account/places/${place._id}/edit`}
                        className="text-white bg-blue-500 px-4 py-2 rounded-full hover:bg-blue-600"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(place._id)}
                        className="text-white bg-blue-500 px-4 py-2 rounded-full"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No places added yet.</p>
            )}
          </div>
        </div>
      )}

      {action === "new" && <PlacesFormPage />}
    </div>
  );
}
