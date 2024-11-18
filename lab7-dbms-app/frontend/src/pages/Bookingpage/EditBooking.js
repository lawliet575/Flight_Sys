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

  const [message, setMessage] = useState(""); // To show messages like success/error
  const [isLoading, setIsLoading] = useState(true); // Loading state for fetching booking data
  const [isSubmitting, setIsSubmitting] = useState(false); // Handle submit loading

  // Fetch the booking data when the component is mounted
  useEffect(() => {
    // Fetch booking details using the API route
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
          setIsLoading(false); // Set loading to false after data is fetched
        } else {
          setMessage("Booking data not found.");
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching booking data:", error);
        setMessage("Error fetching booking data.");
        setIsLoading(false); // Set loading to false if there is an error
      });
  }, [id]);

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
    return <p>Loading...</p>; // Show loading text until booking data is fetched
  }

  return (
    <div>
      <button onClick={handleBack}>Back to Bookings</button>
      <h1>Edit Booking</h1>
      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Passenger ID</label>
          <input
            type="text"
            name="PassengerID"
            value={booking.PassengerID}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Flight ID</label>
          <input
            type="text"
            name="FlightID"
            value={booking.FlightID}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Flight Class ID</label>
          <input
            type="text"
            name="ClassID"
            value={booking.ClassID}
            onChange={handleChange}
          />
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
          <input
            type="number"
            name="TotalPrice"
            value={booking.TotalPrice}
            onChange={handleChange}
          />
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
