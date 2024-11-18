import React, { useState, useEffect } from 'react';

const Passengers = () => {
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true); // To show loading indicator

  useEffect(() => {
    fetch('http://localhost:3001/api/passengers/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        console.log('Response status:', response.status);  // Log response status
        return response.json();
      })
      .then((data) => {
        console.log('Data received:', data);  // Log the data received
        if (data && data.data) {
          const formattedPassengers = data.data.map((passenger) => ({
            PassengerID: passenger[0],
            PassportNumber: passenger[1],
            FirstName: passenger[2],
            LastName: passenger[3],
            Email: passenger[4],
            Phone: passenger[5],
            Address: passenger[6],
            Gender: passenger[7],
            DateOfBirth: passenger[8],
          }));
          setPassengers(formattedPassengers);
        } else {
          console.error('No passengers data found');
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching passengers:', error);
        setLoading(false); // Stop loading if error occurs
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;  // Show loading message while data is being fetched
  }

  return (
    <div>
      <h1>Passengers</h1>
      <div className="passenger-list">
        {passengers.length === 0 ? (
          <p>No passengers available</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Passenger ID</th>
                <th>Passport Number</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Gender</th>
                <th>Date of Birth</th>
              </tr>
            </thead>
            <tbody>
              {passengers.map((passenger) => (
                <tr key={passenger.PassengerID}>
                  <td>{passenger.PassengerID}</td>
                  <td>{passenger.PassportNumber}</td>
                  <td>{passenger.FirstName}</td>
                  <td>{passenger.LastName}</td>
                  <td>{passenger.Email}</td>
                  <td>{passenger.Phone}</td>
                  <td>{passenger.Address}</td>
                  <td>{passenger.Gender}</td>
                  <td>{new Date(passenger.DateOfBirth).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Passengers;