import React from "react";
import { useNavigate } from "react-router-dom";

function Admin_Home() {
  const navigate = useNavigate();

  const goToFlights = () => {
    navigate("/flights");
  };

  const goToBookings = () => {
    navigate("/bookings");
  };

  const goToPassengers = () => {
    navigate("/passengers");
  };

  const goToAirlines = () => {
    navigate("/airlines");
  };

  const goToFlightClasses = () => {
    navigate("/flightclass");
  };


  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to Admin Dashboard</h1>
      <p>Manage flights, bookings, passengers, and more!</p>

      <div style={{ marginTop: "30px" }}>
        <button
          onClick={goToFlights}
          style={buttonStyle}
        >
          View Flights
        </button>
        <br />
        <button
          onClick={goToBookings}
          style={buttonStyle}
        >
          View Bookings
        </button>
        <br />
        <button
          onClick={goToPassengers}
          style={buttonStyle}
        >
          View Passengers
        </button>
        <br />
        <button
          onClick={goToAirlines}
          style={buttonStyle}
        >
          View Airlines
        </button>
        <br />
        <button
          onClick={goToFlightClasses}
          style={buttonStyle}
        >
          View Flight Classes
        </button>
        
      </div>
    </div>
  );
}

const buttonStyle = {
  backgroundColor: "#4CAF50",
  color: "white",
  padding: "10px 20px",
  border: "none",
  cursor: "pointer",
  marginBottom: "15px",
  width: "200px",
  fontSize: "16px",
};

export default Admin_Home;
