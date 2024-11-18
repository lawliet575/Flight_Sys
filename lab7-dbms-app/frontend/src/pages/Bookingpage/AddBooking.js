import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddBooking() {
  const [passengerId, setPassengerId] = useState("");
  const [flightId, setFlightId] = useState("");
  const [classId, setClassId] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [seatNo, setSeatNo] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate(); // useNavigate hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!passengerId || !flightId || !classId || !bookingDate || !seatNo || !totalPrice) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError(""); // Clear previous errors
    setSuccess(false); // Reset success message

    // Prepare the data to be sent to the API
    const bookingData = {
      PassengerID: passengerId,
      FlightID: flightId,
      ClassID: classId,
      BookingDate: bookingDate,
      SeatNo: seatNo,
      TotalPrice: totalPrice,
    };

    try {
      const response = await fetch("http://localhost:3001/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error("Failed to add booking");
      }

      const data = await response.json();
      setSuccess(true); // If the booking was added successfully
      console.log("Booking added:", data);
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  const handleReturn = () => {
    navigate("/bookings"); // Navigate to the bookings page
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", textAlign: "center" }}>
      <button 
        onClick={handleReturn} 
        style={returnButtonStyle}
      >
        Return to Bookings
      </button>

      <h2>Add New Booking</h2>
      <form onSubmit={handleSubmit}>
        <div style={formFieldStyle}>
          <label>Passenger ID:</label>
          <input
            type="text"
            value={passengerId}
            onChange={(e) => setPassengerId(e.target.value)}
          />
        </div>
        <div style={formFieldStyle}>
          <label>Flight ID:</label>
          <input
            type="text"
            value={flightId}
            onChange={(e) => setFlightId(e.target.value)}
          />
        </div>
        <div style={formFieldStyle}>
          <label>Flight Class ID:</label>
          <input
            type="text"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
          />
        </div>
        <div style={formFieldStyle}>
          <label>Booking Date:</label>
          <input
            type="date"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
          />
        </div>
        <div style={formFieldStyle}>
          <label>Seat No:</label>
          <input
            type="text"
            value={seatNo}
            onChange={(e) => setSeatNo(e.target.value)}
          />
        </div>
        <div style={formFieldStyle}>
          <label>Total Price:</label>
          <input
            type="number"
            value={totalPrice}
            onChange={(e) => setTotalPrice(e.target.value)}
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>Booking added successfully!</p>}
        {loading && <p>Loading...</p>}

        <button
          type="submit"
          style={buttonStyle}
          disabled={loading}
        >
          Add Booking
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

export default AddBooking;
