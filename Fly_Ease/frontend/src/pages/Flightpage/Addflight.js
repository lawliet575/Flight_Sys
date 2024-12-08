import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AddFlight() {
  const [depAirportId, setDepAirportId] = useState("");
  const [depDate, setDepDate] = useState("");
  const [depTime, setDepTime] = useState("");
  const [arrAirportId, setArrAirportId] = useState("");
  const [arrDate, setArrDate] = useState("");
  const [arrTime, setArrTime] = useState("");
  const [aircraftId, setAircraftId] = useState("");
  const [airlineId, setAirlineId] = useState(""); // Added airlineId state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [airports, setAirports] = useState([]);
  const [aircrafts, setAircrafts] = useState([]);
  const [airlines, setAirlines] = useState([]);

  const navigate = useNavigate();

  // Fetch the airports data from the API
  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/airports");
        if (!response.ok) {
          throw new Error("Failed to fetch airports");
        }
        const data = await response.json();
        setAirports(data.data); // Set the airports state with the fetched data
      } catch (err) {
        setError("Error: " + err.message);
      }
    };

    const fetchAircrafts = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/aircrafts");
        if (!response.ok) {
          throw new Error("Failed to fetch aircrafts");
        }
        const data = await response.json();
        setAircrafts(data.data); // Set the aircrafts state with the fetched data
      } catch (err) {
        setError("Error: " + err.message);
      }
    };

    const fetchAirlines = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/airlines");
        if (!response.ok) {
          throw new Error("Failed to fetch airlines");
        }
        const data = await response.json();
        setAirlines(data.data); // Set the airlines state with the fetched data
      } catch (err) {
        setError("Error: " + err.message);
      }
    };

    fetchAirports();
    fetchAircrafts();
    fetchAirlines();
  }, []);

  // Set the aircraft automatically based on selected airline
  useEffect(() => {
    if (airlineId === "AL1") {
      setAircraftId("AC1"); // Qatar -> AC1
    } else if (airlineId === "AL2") {
      setAircraftId("AC2"); // PIA -> AC2
    } else if (airlineId === "AL3") {
      setAircraftId("AC3"); // Emirates -> AC3
    }
  }, [airlineId]); // Run this effect when airlineId changes

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
      <button onClick={handleReturn} style={returnButtonStyle}>
        Return to Flights
      </button>

      <h2>Add New Flight</h2>
      <form onSubmit={handleSubmit}>
        <div style={formFieldStyle}>
          <label>Departure Airport:</label>
          <select
            value={depAirportId}
            onChange={(e) => setDepAirportId(e.target.value)}
          >
            <option value="">Select Airport</option>
            {airports.map((airport) => (
              <option key={airport[0]} value={airport[0]}>
                {airport[1]} - {airport[2]} {/* Airport name and city */}
              </option>
            ))}
          </select>
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
          <label>Arrival Airport:</label>
          <select
            value={arrAirportId}
            onChange={(e) => setArrAirportId(e.target.value)}
          >
            <option value="">Select Airport</option>
            {airports.map((airport) => (
              <option key={airport[0]} value={airport[0]}>
                {airport[1]} - {airport[2]} {/* Airport name and city */}
              </option>
            ))}
          </select>
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
          <label>Airline:</label>
          <select
            value={airlineId}
            onChange={(e) => setAirlineId(e.target.value)}
          >
            <option value="">Select Airline</option>
            {airlines.map((airline) => (
              <option key={airline[0]} value={airline[0]}>
                {airline[1]} {/* Airline name */}
              </option>
            ))}
          </select>
        </div>

        {/* Aircraft field is hidden, no need to display it */}
        {/* {aircraftId && (
          <div style={formFieldStyle}>
            <label>Aircraft:</label>
            <input type="text" value={aircraftId} readOnly />
          </div>
        )} */}

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>Flight added successfully!</p>}
        {loading && <p>Loading...</p>}

        <button type="submit" style={buttonStyle} disabled={loading}>
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
  backgroundColor: "light-blue", // Tomato color for distinction
  color: "white",
  padding: "8px 15px",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
};

export default AddFlight;
