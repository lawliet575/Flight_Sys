import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


function AddFlight() {
  const [depAirportId, setDepAirportId] = useState("");
  const [depDate, setDepDate] = useState("");
  const [depTime, setDepTime] = useState("");
  const [arrAirportId, setArrAirportId] = useState("");
  const [arrDate, setArrDate] = useState("");
  const [arrTime, setArrTime] = useState("");
  const [aircraftId, setAircraftId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!depAirportId || !depDate || !depTime || !arrAirportId || !arrDate || !arrTime || !aircraftId) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError(""); // Clear previous errors
    setSuccess(false); // Reset success message

    // Prepare the data to be sent to the API
    const flightData = {
      dep_airport_id: depAirportId,
      dep_date: depDate,
      dep_time: depTime,
      arr_airport_id: arrAirportId,
      arr_date: arrDate,
      arr_time: arrTime,
      aircraft_id: aircraftId,
    };

    try {
      const response = await fetch("http://localhost:3001/api/flights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(flightData),
      });

      if (!response.ok) {
        throw new Error("Failed to add flight");
      }

      const data = await response.json();
      setSuccess(true); // If the flight was added successfully
      console.log("Flight added:", data);
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  const handleReturn = () => {
    navigate("/flights"); // Navigate to the bookings page
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", textAlign: "center" }}>
      <button 
        onClick={handleReturn} 
        style={returnButtonStyle}
        
      >
        Return to Flights
      </button>
      
      <h2>Add New Flight</h2>
      <form onSubmit={handleSubmit}>
        <div style={formFieldStyle}>
          <label>Departure Airport ID:</label>
          <input
            type="text"
            value={depAirportId}
            onChange={(e) => setDepAirportId(e.target.value)}
          />
        </div>
        <div style={formFieldStyle}>
          <label>Departure Date:</label>
          <input
            type="date"
            value={depDate}
            onChange={(e) => setDepDate(e.target.value)}
          />
        </div>
        <div style={formFieldStyle}>
          <label>Departure Time:</label>
          <input
            type="time"
            value={depTime}
            onChange={(e) => setDepTime(e.target.value)}
          />
        </div>
        <div style={formFieldStyle}>
          <label>Arrival Airport ID:</label>
          <input
            type="text"
            value={arrAirportId}
            onChange={(e) => setArrAirportId(e.target.value)}
          />
        </div>
        <div style={formFieldStyle}>
          <label>Arrival Date:</label>
          <input
            type="date"
            value={arrDate}
            onChange={(e) => setArrDate(e.target.value)}
          />
        </div>
        <div style={formFieldStyle}>
          <label>Arrival Time:</label>
          <input
            type="time"
            value={arrTime}
            onChange={(e) => setArrTime(e.target.value)}
          />
        </div>
        <div style={formFieldStyle}>
          <label>Aircraft ID:</label>
          <input
            type="text"
            value={aircraftId}
            onChange={(e) => setAircraftId(e.target.value)}
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>Flight added successfully!</p>}
        {loading && <p>Loading...</p>}

        <button
          type="submit"
          style={buttonStyle}
          disabled={loading}
        >
          Add Flight
        </button>
      </form>
    </div>
  );
}

const formFieldStyle = {
  marginBottom: "15px",
  textAlign: "left",
};

const buttonStyle = {
  backgroundColor: "#4CAF50",
  color: "white",
  padding: "10px 20px",
  border: "none",
  cursor: "pointer",
};

const returnButtonStyle = {
  position: "absolute",
  top: "20px",
  left: "20px",
  backgroundColor: "light-blue",  // Tomato color for distinction
  color: "white",
  padding: "8px 15px",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
};

export default AddFlight;
