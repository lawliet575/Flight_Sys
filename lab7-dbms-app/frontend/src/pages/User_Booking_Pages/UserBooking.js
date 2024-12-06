import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PassengerContext } from "../Loginpage/PassengerContext";
import "./UserBooking.css"; // Import the CSS file

function UserBook() {
  const [classId, setClassId] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [formattedDepartureDate, setFormattedDepartureDate] = useState("");
  const [seatNo, setSeatNo] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [flightClasses, setFlightClasses] = useState([]);
  const [selectedClassDescription, setSelectedClassDescription] = useState("");
  const [baggageAllowed, setBaggageAllowed] = useState(0);

  const { passengerId } = useContext(PassengerContext);
  const { id } = useParams();
  const navigate = useNavigate();

  // Function to generate random seat number
  const generateSeatNumber = () => {
    const letters = ["A", "B", "C"];
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    const randomNumber = Math.floor(Math.random() * 30) + 1; // Between 1 and 50
    return `${randomLetter}${randomNumber}`;
  };

  // Fetch flight details
  useEffect(() => {
    const fetchFlightDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/flights/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch flight details");
        }
        const flightData = await response.json();
        const rawDate = flightData.data[2]; // Assuming date is at index 2
        setDepartureDate(rawDate);

        // Format date
        const formattedDate = new Date(rawDate).toLocaleDateString("en-US");
        setFormattedDepartureDate(formattedDate);

        // Generate a random seat number
        setSeatNo(generateSeatNumber());

      } catch (err) {
        setError("Error fetching flight details: " + err.message);
      }
    };

    fetchFlightDetails();
  }, [id]);

  // Fetch flight classes
  useEffect(() => {
    const fetchFlightClasses = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/flightclass");
        if (!response.ok) {
          throw new Error("Failed to fetch flight classes");
        }
        const data = await response.json();
        setFlightClasses(data);
      } catch (err) {
        setError("Error fetching flight classes: " + err.message);
      }
    };

    fetchFlightClasses();
  }, []);

  const handleClassChange = (e) => {
    const selectedClass = e.target.value;
    setClassId(selectedClass);

    const selectedClassData = flightClasses.find(
      (flightClass) => flightClass.CLASS_ID === selectedClass
    );

    if (selectedClassData) {
      setSelectedClassDescription(selectedClassData.CLASS_DESCRIPTION);
      setBaggageAllowed(selectedClassData.BAGGAGE_ALLOWED);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!classId || !seatNo || !totalPrice) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    const bookingData = {
      PassengerID: passengerId,
      FlightID: id,
      ClassID: classId,
      BookingDate: departureDate, // Use raw date for API
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
      setSuccess(true);
      console.log("Booking added:", data);
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = () => {
    navigate("/viewflights");
  };

  return (
    <div className="booking-container">
      <button onClick={handleReturn} className="return-button">
      ←
      </button>

      <h2>Flight Booking</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Passenger ID:</label>
          <input type="text" value={passengerId} readOnly className="read-only-input" />
        </div>
        <div className="form-field">
          <label>Flight ID:</label>
          <input type="text" value={id} readOnly className="read-only-input" />
        </div>
        <div className="form-field">
          <label>Flight Class:</label>
          <select value={classId} onChange={handleClassChange} className="input">
            <option value="">Select Class</option>
            {flightClasses.map((flightClass) => (
              <option key={flightClass.CLASS_ID} value={flightClass.CLASS_ID}>
                {flightClass.CLASS_DESCRIPTION}
              </option>
            ))}
          </select>
        </div>
        {selectedClassDescription && (
          <div className="form-field">
            <p>Baggage Allowed: {baggageAllowed} kg</p>
          </div>
        )}
        <div className="form-field">
          <label>Departure Date:</label>
          <input type="text" value={formattedDepartureDate} readOnly className="read-only-input" />
        </div>
        <div className="form-field">
          <label>Seat No:</label>
          <input type="text" value={seatNo} readOnly className="read-only-input" />
        </div>
        <div className="form-field">
          <label>Total Price:</label>
          <input
            type="number"
            value={totalPrice}
            onChange={(e) => setTotalPrice(e.target.value)}
          />
        </div>

        {loading && <p>Loading...</p>}

        <button type="submit" className="button" disabled={loading}>
          Book
        </button>
        
      </form>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">Booking Done successfully!</p>}
    </div>
  );
}

export default UserBook;
