import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { PassengerContext } from "../Loginpage/PassengerContext"; // Import the context
import "./Homemodule.css"; // Correct CSS import

function Home() {
  const navigate = useNavigate();
  const { passengerId, setPassengerId } = useContext(PassengerContext); // Access passengerId and setPassengerId

  const handleBookNow = () => {
    navigate("/viewflights");
  };

  const handleSignIn = () => {
    navigate("/login");
  };

  const handleEditProfile = () => {
    navigate(`/editprofile/${passengerId}`);
  };

  const handleViewMyFlights = () => {
    navigate(`/viewbooking/${passengerId}`);
  };

  const handleSignOut = () => {
    setPassengerId(null); // Clear the passenger context
    navigate("/"); // Redirect to the home page after sign out
  };

  return (
    <div className="home-container d-flex flex-column justify-content-between">
      <nav className="navbar navbar-expand-lg pt-3" style={{ textShadow: "0 0 15px #5c5c5c" }}>
        <div className="container-fluid ps-5 pe-3">
          <a className="navbar-brand text-light fw-bold fs-3 ms-3" href="/" style={{ letterSpacing: "2px" }}>
            FlyEase
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentColor"
              className="bi bi-send mx-2 fw-bold"
              viewBox="0 0 16 16"
            >
              <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
            </svg>
          </a>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a href="#" className="nav-link fw-semibold text-light fs-5 px-3">
                Contact Us
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link fw-semibold text-light fs-5 px-3">
                About
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link fw-semibold text-light fs-5 px-3">
                Flights
              </a>
            </li>

            {/* Conditionally render buttons based on passengerId */}
            {passengerId ? (
              <>
                <li className="nav-item">
                  <button
                    className="btn btn-primary fw-semibold me-3"
                    onClick={handleViewMyFlights}
                  >
                    View My Booked Flights
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-success fw-semibold"
                    onClick={handleEditProfile}
                  >
                    Edit Profile
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-danger fw-semibold ms-3"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button
                  className="btn btn-success fw-semibold"
                  onClick={handleSignIn}
                >
                  Sign In
                </button>
              </li>
            )}
          </ul>
        </div>
      </nav>

      <div className="header" style={{ textShadow: "0 0 15px #5c5c5c" }}>
        <h2 className="fw-semibold">Welcome to FlyEase</h2>
        <p className="subtitle fw-semibold fst-italic">
          Your one-stop solution for booking and managing flights
        </p>
        <button
          onClick={handleBookNow}
          className="btn btn-large w-25 text-light fs-5 fw-semibold"
          style={{ backgroundColor: "#375c84", textShadow: "0 0 5px #303030" }}
        >
          Book Now
        </button>
      </div>

      <footer className="footer">
        <p className="fs-6">&copy; 2024 FlyEase Booking System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
