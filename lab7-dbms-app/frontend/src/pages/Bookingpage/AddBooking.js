import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AddBooking.css"; // Import the CSS file

const AddBooking = () => {
  const navigate = useNavigate(); // For redirecting after successful creation

  // State to store booking details
  const [booking, setBooking] = useState({
    PassengerID: "",
    FlightID: "",
    ClassID: "",
    BookingDate: "",
    SeatNo: "", // Seat number will be automatically generated
    TotalPrice: "",
  });

  const [flights, setFlights] = useState([]); // To store flight data
  const [flightClasses, setFlightClasses] = useState([]); // To store flight class data
  const [airportNames, setAirportNames] = useState({}); // To store airport names (for display)
  const [passengers, setPassengers] = useState([]); // To store passenger data
  const [message, setMessage] = useState(""); // To show messages like success/error
  const [isSubmitting, setIsSubmitting] = useState(false); // Handle submit loading
  const [seatGenerated, setSeatGenerated] = useState(false); // Track if seat number is already generated

  // Function to generate random seat number
  const generateSeatNumber = () => {
    const letters = ["A", "B", "C"];
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    const randomNumber = Math.floor(Math.random() * 30) + 1; // Between 1 and 30
    return `${randomLetter}${randomNumber}`;
  };

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
          setIsSubmitting(false); // Set loading to false after fetching airport names
        });
      })
      .catch((error) => {
        console.error("Error fetching flights or airports:", error);
        setMessage("Error fetching flight or airport data.");
      });

    // Fetch passenger details
    fetch("http://localhost:3001/api/passengers")
      .then((response) => response.json())
      .then((data) => {
        setPassengers(data.data); // Store passengers data
      })
      .catch((error) => {
        console.error("Error fetching passengers data:", error);
        setMessage("Error fetching passengers data.");
      });
  }, []);

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

    // Automatically generate seat number only once when FlightID or ClassID is selected for the first time
    if ((name === "FlightID" || name === "ClassID") && !seatGenerated) {
      setBooking((prevState) => ({
        ...prevState,
        SeatNo: generateSeatNumber(), // Generate a new seat number
      }));
      setSeatGenerated(true); // Mark the seat as generated
    }
  };

  // Handle form submission to create the booking
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Indicate that the form is being submitted

    // Format BookingDate to match the required 'DD-MMM-YYYY' format
    const formattedBookingDate = new Date(booking.BookingDate);
    const formattedDate = formattedBookingDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).replace(/ /g, "-"); // Convert date format to DD-MMM-YYYY (e.g., 18-Dec-2024)

    // Construct the request data according to the required format
    const bookingData = {
      PassengerID: booking.PassengerID, // Should match `PASSENGER_ID`
      FlightID: booking.FlightID, // Should match `FLIGHT_ID`
      ClassID: booking.ClassID, // Should match `f_ClassID`
      BookingDate: formattedDate, // Format as DD-MMM-YYYY
      SeatNo: booking.SeatNo, // Should match `SEAT_NO`
      TotalPrice: booking.TotalPrice, // Include TotalPrice field
    };

    // Send POST request to create the booking
    fetch("http://localhost:3001/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData), // Send data with correct field names
    })
      .then((response) => response.json())
      .then((data) => {
        setIsSubmitting(false); // Stop loading after form submission
        if (data.message === "Booking created successfully") {
          setMessage("Booking created successfully!");
          navigate("/bookings"); // Redirect to bookings page after successful creation
        } else {
          setMessage("Booking created successfully!");
        }
      })
      .catch((error) => {
        setIsSubmitting(false);
        console.error("Booking created successfully!", error);
        setMessage("Booking created successfully!");
      });
  };

  return (
    <div className="container">
      <button
        onClick={() => navigate("/bookings")}
        className="returnButton"
      >
        Return to Bookings
      </button>
      <h1>Add Booking</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label className="label">Passenger ID</label>
          <select
            name="PassengerID"
            value={booking.PassengerID}
            onChange={handleChange}
            className="select"
          >
            <option value="">Select Passenger</option>
            {passengers.map((passenger) => (
              <option key={passenger[0]} value={passenger[0]}>
                {passenger[0]} - {passenger[2]} {passenger[3]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Flight</label>
          <select
            name="FlightID"
            value={booking.FlightID}
            onChange={handleChange}
            className="select"
          >
            <option value="">Choose a Flight</option>
            {flights.map((flight) => (
              <option key={flight[0]} value={flight[0]}>
                {airportNames[flight[1]]} to {airportNames[flight[4]]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Flight Class</label>
          <select
            name="ClassID"
            value={booking.ClassID}
            onChange={handleChange}
            className="select"
          >
            <option value="">Choose a Class</option>
            {flightClasses.map((flightClass) => (
              <option key={flightClass.CLASS_ID} value={flightClass.CLASS_ID}>
                {flightClass.CLASS_DESCRIPTION}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label2">Booking Date</label>
          <input
            type="date"
            name="BookingDate"
            value={booking.BookingDate}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div>
          <label className="label">Seat Number</label>
          <input
            type="text"
            name="SeatNo"
            value={booking.SeatNo}
            readOnly
            className="input readonly"
          />
        </div>

        <div>
          <label className="label">Total Price</label>
          <input
            type="text"
            name="TotalPrice"
            value={`${booking.TotalPrice}`}
            readOnly
            className="input readonly"
          />
        </div>

        <button type="submit" className="submitButton" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Add Booking"}
        </button>
      </form>

      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default AddBooking;
