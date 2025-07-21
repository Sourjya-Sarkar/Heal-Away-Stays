import { Routes, Route } from "react-router-dom";
import "./App.css";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import Layout from "./Layout";
import RegisterPage from "./pages/RegisterPage";
import axios from "axios";
import PlacesFormPage from "./pages/PlacesFormPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import PlaceDetailPage from "./pages/PlaceDetailPage";
import { UserContextProvider } from "./UserContext";
import AccountPage from "./pages/AccountPage";
import UserBookingPage from "./pages/UserBookingPage";
import BookingPage from "./pages/BookingPage";
import SearchResultsPage from "./pages/SearchResultsPage";

// Set the base URL for axios requests
axios.defaults.baseURL = "http://localhost:3000"; // Adjust this to your API
axios.defaults.withCredentials = true; // Enable sending cookies with requests

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/account/:subpage" element={<AccountPage />} />
          <Route path="/account/:subpage/:action" element={<AccountPage />} />
          <Route path="/account/places/:id/edit" element={<PlacesFormPage />} />
          <Route
            path="/account/places/new"
            element={<PlacesFormPage action="new" />}
          />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/place/:id" element={<PlaceDetailPage />} />
          <Route path="/account/bookings" element={<UserBookingPage />} />
          <Route path="/book/:id" element={<BookingPage />} />
          <Route path="/search-results" element={<SearchResultsPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Add more routes as needed */}
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
