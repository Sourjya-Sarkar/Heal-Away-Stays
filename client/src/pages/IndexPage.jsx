import { useEffect, useState } from "react";
import axios from "axios";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function IndexPage() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get("/places").then((response) => {
      setPlaces(response.data);
    });
  }, []);

  if (!places.length) {
    return (
      <div className="text-center py-20 text-gray-500">
        No places available right now.
      </div>
    );
  }

  return (
    <div className="mt-4 px-4 md:px-8">
      {/* Hero Section */}

      <section className="relative rounded-xl overflow-hidden mb-8 shadow-md h-[400px]">
        {/* 🎥 Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        >
          <source src="/video/healing-bg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* ✨ Hero Text Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-blue-900 px-4">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
            Find your healing space
          </h1>
          <p className="text-lg text-blue-800 drop-shadow-sm">
            Wellness homes and hospitals across India
          </p>
        </div>
      </section>

      {/* Animated Cards Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {places.map((place, index) => (
          <motion.div
            key={place._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-lg shadow hover:shadow-xl transition-shadow duration-300 overflow-hidden"
          >
            <Link to={`/place/${place._id}`}>
              <div className="aspect-w-4 aspect-h-3 bg-gray-200">
                {place.photos?.[0] && (
                  <LazyLoadImage
                    src={`http://localhost:3000/uploads/${place.photos[0]}`}
                    alt={place.title}
                    effect="blur"
                    className="object-cover w-full h-full"
                  />
                )}
              </div>
              <div className="p-4">
                <h2 className="font-semibold text-lg truncate">
                  {place.title}
                </h2>
                <p className="text-sm text-gray-500 truncate">
                  {place.address}
                </p>
                {place.price && (
                  <p className="mt-1 text-blue-600 font-medium">
                    ₹{place.price} / night
                  </p>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
