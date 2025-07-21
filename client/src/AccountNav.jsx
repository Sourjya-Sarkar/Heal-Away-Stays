// src/components/AccountNav.jsx
import { Link, useParams } from "react-router-dom";

export default function AccountNav() {
  const { subpage } = useParams();

  function linkClasses(type) {
    let classes = "py-2 px-6";
    if (type === subpage || (subpage === undefined && type === "profile")) {
      classes +=
        " bg-blue-500 text-white border border-gray-300 rounded-full shadow hover:bg-blue-600 transition";
    }
    return classes;
  }

  return (
    <nav className="w-full flex justify-center mt-8 gap-4">
      <Link className={linkClasses("profile")} to="/account/profile">
        My profile
      </Link>
      <Link className={linkClasses("bookings")} to="/account/bookings">
        My bookings
      </Link>
      <Link className={linkClasses("places")} to="/account/places">
        My accommodations
      </Link>
    </nav>
  );
}
