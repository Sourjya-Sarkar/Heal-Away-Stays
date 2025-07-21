import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import PhotosUploader from "../PhotosUploader";
import Perks from "../Perks";

export default function PlacesFormPage() {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const { action, id } = useParams();

  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [price, setPrice] = useState(0);

  // Fetch existing place if in edit mode
  useEffect(() => {
    if (id) {
      axios.get(`/places/${id}`).then((res) => {
        const data = res.data;
        setTitle(data.title || "");
        setAddress(data.address || "");
        setAddedPhotos(data.photos || []);
        setDescription(data.description || "");
        setPerks(data.perks || []);
        setExtraInfo(data.extraInfo || "");
        setCheckIn(data.checkIn || "");
        setCheckOut(data.checkOut || "");
        setMaxGuests(data.maxGuests || 1);
        setPrice(data.price || 0);
      });
    }
  }, [id]);

  function inputHeader(text) {
    return <h2 className="text-2xl mt-4">{text}</h2>;
  }

  function inputDescription(text) {
    return <p className="text-gray-500 text-sm mb-1">{text}</p>;
  }

  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  async function savePlace(e) {
    e.preventDefault();

    const placeData = {
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    };

    try {
      if (id) {
        // Edit existing place
        await axios.put(`places/${id}`, placeData);
      } else {
        // Add new place
        await axios.post("/api/places", placeData);
      }

      navigate("/account/places");
    } catch (err) {
      console.error("Error saving place:", err);
      alert("Failed to save place.");
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4">
      <form onSubmit={savePlace}>
        {preInput("Title", "Title for the place")}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full border rounded px-3 py-2 mb-4"
        />

        {preInput("Address", "Address of the place")}
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
          className="w-full border rounded px-3 py-2 mb-4"
        />

        {preInput("Photos", "Add photos via URL or from your device")}
        <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />

        {preInput("Description", "Description of the place")}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Type your description here..."
          className="w-full border rounded px-3 py-2 mb-4"
        />

        {preInput("Perks", "Select all the perks available")}
        <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3">
          <Perks selected={perks} onChange={setPerks} />
        </div>

        {preInput("Extra Info", "Any additional information about the place")}
        <textarea
          value={extraInfo}
          onChange={(e) => setExtraInfo(e.target.value)}
          placeholder="Additional information"
          className="w-full border rounded px-3 py-2 mb-4"
        />

        {preInput("Check-in & Check-out", "Specify times and guest limit")}
        <div className="grid sm:grid-cols-3 gap-2 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Check-in</label>
            <input
              type="time"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Check-out</label>
            <input
              type="time"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Max Guests</label>
            <input
              type="number"
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
              min="1"
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Price For A Night
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <button className="primary bg-primary text-white px-6 py-2 rounded-full mt-4">
          Save
        </button>
      </form>
    </div>
  );
}
