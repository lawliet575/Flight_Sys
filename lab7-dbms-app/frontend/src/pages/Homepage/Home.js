import React from "react";
import { useNavigate } from "react-router-dom";
import "./Homemodule.css"; // Correct CSS import

function Home() {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate("/viewflights");
  };

  const handleSignOut = () => {
    navigate("/");
  };

  return (
    <div className="home-container">

      {/* Sign Out Button */}
      <button onClick={handleSignOut} className="sign-out-button">
        Sign Out
      </button>

      {/* Welcome message */}
      <div className="header">
        <h2>Welcome to the Flight Booking System</h2>
        <p className="subtitle">
          Your one-stop solution for booking and managing flights
        </p>
      </div>

      {/* Book Now Button */}
      <div className="content">
        <button onClick={handleBookNow} className="book-button">
          View Flights
        </button>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 Flight Booking System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
