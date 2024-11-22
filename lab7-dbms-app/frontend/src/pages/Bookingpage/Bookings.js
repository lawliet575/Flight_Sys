import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    fetch('http://localhost:3001/api/bookings/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);  // Log the response for debugging

        // Restructure the data into a more readable format
        const formattedBookings = data.map((booking) => ({
          BookingID: booking[0],
          FlightID: booking[1],
          PassengerID: booking[2],
          FlightClassID: booking[3],
          BookingDate: booking[4],
          Seat: booking[5],
          Price: booking[6],
        }));
        setBookings(formattedBookings);
      })
      .catch((error) => {
        console.error('Error fetching bookings:', error);
      });
  };

  const handleEditBooking = (bookingId) => {
    navigate(`/editbooking/${bookingId}`); // Navigate to the EditBooking page with the booking's ID
  };

  const handleDeleteBooking = (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      fetch(`http://localhost:3001/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "Booking deleted successfully") {
            alert('Booking deleted successfully');
            // Remove deleted booking from the state
            setBookings(bookings.filter((booking) => booking.BookingID !== bookingId));
          } else {
            alert('Failed to delete the booking');
          }
        })
        .catch((error) => {
          console.error('Error deleting booking:', error);
          alert('Error deleting booking');
        });
    }
  };

  return (
    <div>
      {/* Navigation button to Home Page */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', margin: '10px 0' }}>
        <button
          onClick={() => navigate('/adminhome')}
          style={{
            backgroundColor: '#2980b9',
            color: 'white',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Return to Home Page
        </button>
      </div>

      <h1>Bookings</h1>

      {/* Add New Booking Button - aligned to the left above the table */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '20px' }}>
        <button
          onClick={() => navigate('/addbooking')}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Add New Booking
        </button>
      </div>

      <div className="booking-list">
        {bookings.length === 0 ? (
          <p>No bookings available</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Passenger ID</th>
                <th>Flight ID</th>
                <th>Flight Class ID</th>
                <th>Booking Date</th>
                <th>Seat</th>
                <th>Price</th>
                <th>Actions</th> {/* Column for Edit and Delete buttons */}
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.BookingID}>
                  <td>{booking.BookingID}</td>
                  <td>{booking.FlightID}</td>
                  <td>{booking.PassengerID}</td>
                  <td>{booking.FlightClassID}</td>
                  <td>{new Date(booking.BookingDate).toLocaleDateString()}</td>
                  <td>{booking.Seat}</td>
                  <td>{booking.Price}</td>
                  <td>
                    {/* Edit button */}
                    <button onClick={() => handleEditBooking(booking.BookingID)}>
                      Edit
                    </button>
                    {/* Add gap and style Delete button */}
                    <button 
                      onClick={() => handleDeleteBooking(booking.BookingID)} 
                      style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Bookings;
