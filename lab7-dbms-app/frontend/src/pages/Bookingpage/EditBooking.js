import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditBooking = () => {
  const { id } = useParams(); // Get the booking ID from URL parameters
  const navigate = useNavigate(); // For redirecting after successful update

  // State to store booking details
  const [booking, setBooking] = useState({
    PassengerID: "",
    FlightID: "",
    ClassID: "",
    BookingDate: "",
    SeatNo: "",
    TotalPrice: "",
  });

  const [flights, setFlights] = useState([]); // To store flight data
  const [flightClasses, setFlightClasses] = useState([]); // To store flight class data
  const [airportNames, setAirportNames] = useState({}); // To store airport names (for display)
  const [message, setMessage] = useState(""); // To show messages like success/error
  const [isLoading, setIsLoading] = useState(true); // Loading state for fetching booking data
  const [isSubmitting, setIsSubmitting] = useState(false); // Handle submit loading

  // Fetch flight data, flight class data, and airport names
  useEffect(() => {
    // Fetch flight class details
    fetch("http://localhost:3001/api/flightclass")
      .then((response) => response.json())
      .then((data) => {
        setFlightClasses(data); // Store flight class data
      })
      .catch((error) => {
        console.error("Error fetching flight class data:", error);
        setMessage("Error fetching flight class data.");
      });

    // Fetch flight details
    fetch("http://localhost:3001/api/flights")
      .then((response) => response.json())
      .then((data) => {
        setFlights(data.data); // Store flights data
        // Fetch airport names for departure and arrival airports in all flights
        const airportIds = new Set();
        data.data.forEach((flight) => {
          airportIds.add(flight[1]); // Departure airport
          airportIds.add(flight[4]); // Arrival airport
        });

        // Fetch airport names for each unique airport ID
        const fetchAirportNames = Array.from(airportIds).map((airportId) =>
          fetch(`http://localhost:3001/api/airports/${airportId}`)
            .then((response) => response.json())
            .then((airportData) => {
              setAirportNames((prev) => ({
                ...prev,
                [airportData.data[0]]: airportData.data[1], // Save airport code and name
              }));
            })
        );

        // Wait for all airport names to be fetched
        Promise.all(fetchAirportNames).then(() => {
          setIsLoading(false); // Set loading to false after fetching airport names
        });
      })
      .catch((error) => {
        console.error("Error fetching flights or airports:", error);
        setMessage("Error fetching flight or airport data.");
        setIsLoading(false); // Set loading to false if there is an error
      });

    // Fetch booking data
    fetch(`http://localhost:3001/api/bookings/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.data && data.data.length > 1) {
          // Pre-fill the form fields with booking data (skip the first element, which is booking ID)
          setBooking({
            PassengerID: data.data[1], // PassengerID (data.data[1])
            FlightID: data.data[2],     // FlightID (data.data[2])
            ClassID: data.data[3],      // ClassID (data.data[3])
            BookingDate: new Date(data.data[4]).toISOString().split('T')[0], // Format date for input[type="date"] (data.data[4] is the date)
            SeatNo: data.data[5],       // SeatNo (data.data[5])
            TotalPrice: data.data[6],   // TotalPrice (data.data[6])
          });
        } else {
          setMessage("Booking data not found.");
        }
      })
      .catch((error) => {
        console.error("Error fetching booking data:", error);
        setMessage("Error fetching booking data.");
        setIsLoading(false);
      });
  }, [id]);

  // Fetch price based on selected flight and class
  useEffect(() => {
    if (booking.FlightID && booking.ClassID) {
      fetch(
        `http://localhost:3001/api/bookingprice/${booking.FlightID}/${booking.ClassID}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data && data.price && data.price.rows.length > 0) {
            setBooking((prevState) => ({
              ...prevState,
              TotalPrice: data.price.rows[0][0], // Set the price from the API response
            }));
          }
        })
        .catch((error) => {
          console.error("Error fetching booking price:", error);
          setMessage("Error fetching booking price.");
        });
    }
  }, [booking.FlightID, booking.ClassID]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBooking((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission to update the booking
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Indicate that the form is being submitted

    // Send PUT request to update the booking
    fetch(`http://localhost:3001/api/bookings/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(booking),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsSubmitting(false); // Stop loading after form submission
        if (data.message === "Booking updated successfully") {
          setMessage("Booking updated successfully!");
          navigate("/bookings"); // Redirect to bookings page after successful update
        } else {
          setMessage("Error updating booking.");
        }
      })
      .catch((error) => {
        setIsSubmitting(false);
        console.error("Error updating booking:", error);
        setMessage("Error updating booking.");
      });
  };

  // Back to bookings page
  const handleBack = () => {
    navigate("/bookings");
  };

  if (isLoading) {
    return <p>Loading...</p>; // Show loading text until flight and booking data is fetched
  }

  return (
    <div>
      <button onClick={handleBack}>Back to Bookings</button>
      <h1>Edit Booking</h1>
      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Passenger ID</label>
          <div
            style={{
              backgroundColor: "#f0f0f0", // Dark background color for non-editable field
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            {booking.PassengerID}
          </div>
        </div>

        <div style={{ marginTop: '15px' }}>
  <label>Change Flight</label>
  <select
    name="FlightID"
    value={booking.FlightID}
    onChange={handleChange}
  >
    {flights.map((flight) => (
      <option key={flight[0]} value={flight[0]}>
        {`${flight[0]} - ${airportNames[flight[1]]} to ${airportNames[flight[4]]}`} {/* Format as "F1 - Iqbal International to Jinnah International" */}
      </option>
    ))}
  </select>
</div>

        <div style={{ marginTop: '15px' }}>
          <label>Flight Class</label>
          <select
            name="ClassID"
            value={booking.ClassID}
            onChange={handleChange}
          >
            {flightClasses.map((flightClass) => (
              <option key={flightClass.CLASS_ID} value={flightClass.CLASS_ID}>
                {flightClass.CLASS_DESCRIPTION} {/* Display class description */}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Booking Date</label>
          <input
            type="date"
            name="BookingDate"
            value={booking.BookingDate}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Seat Number</label>
          <input
            type="text"
            name="SeatNo"
            value={booking.SeatNo}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Total Price</label>
          <div
            style={{
              backgroundColor: "#f0f0f0", // Dark background color for non-editable field
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            {booking.TotalPrice}
          </div>
        </div>

        <div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Booking"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBooking;
