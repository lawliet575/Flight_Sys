import React, { useState, useEffect } from 'react';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
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
  }, []);  // Empty array means it runs only once when the component mounts

  return (
    <div>
      <h1>Bookings</h1>
      <div className="booking-list">
        {bookings.length === 0 ? (
          <p>No bookings available</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Flight ID</th>
                <th>Passenger ID</th>
                <th>Flight Class ID</th>
                <th>Booking Date</th>
                <th>Seat</th>
                <th>Price</th>
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
