import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import "../User_Booking_Pages/ViewBookingModule.css"

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
    <div className="view-booking-container">
     
      <div className='view-booking-header mt-5'>
      <h1>Bookings</h1>
        <button
          onClick={() => navigate('/adminhome')}
          className="view-booking-back-button"
        >
           ←
        </button>
    
        <button
          onClick={() => navigate('/addbooking')}
          className="view-booking-add-button"
        >
          Add New Booking
        </button>
      </div>      

      {bookings.length === 0 ? (
        <div className="no-bookings">
          <p>No bookings.</p>
        </div>
      ) : (
        <div className='table-container ms-5'>
          <table className='table'>
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
                    <button style={{
                          marginRight: '10px',
                          backgroundColor: '#2980b9',
                          color: 'white',
                          padding: '5px 10px',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          height: '30px'
                        }} onClick={() => handleEditBooking(booking.BookingID)}>
                      Edit
                    </button>
                    {/* Add gap and style Delete button */}
                    <button 
                      onClick={() => handleDeleteBooking(booking.BookingID)} 
                      style={{
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        padding: '5px 10px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        height: '30px'
                      }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    
  );
};

export default Bookings;
