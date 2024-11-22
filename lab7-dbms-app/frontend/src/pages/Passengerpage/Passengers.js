import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Passengers.css'; // Assuming the CSS is saved in a file named Passengers.css

const Passengers = () => {
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch passengers data
  useEffect(() => {
    fetch('http://localhost:3001/api/passengers/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        console.log('Response status:', response.status);
        return response.json();
      })
      .then((data) => {
        console.log('Data received:', data);
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
            LoginID: passenger[9],
            LoginPW: passenger[10],
          }));
          setPassengers(formattedPassengers);
        } else {
          console.error('No passengers data found');
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching passengers:', error);
        setLoading(false);
      });
  }, []);

  // Navigate to edit page
  const handleEditPassenger = (passengerId) => {
    navigate(`/editpassenger/${passengerId}`);
  };

  // Handle deleting a passenger
  const handleDeletePassenger = (passengerId) => {
    fetch(`http://localhost:3001/api/passengers/${passengerId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status === 200) {
          setPassengers(passengers.filter((passenger) => passenger.PassengerID !== passengerId));
        } else {
          alert('Failed to delete passenger, first delete it from bookings');
        }
      })
      .catch((error) => {
        console.error('Error deleting passenger first delete it from bookings:', error);
        alert('Error deleting passenger first delete it from bookings');
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Return to Home Page Button (Positioned Top Left) */}
      <div className="return-home-btn-container">
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

      <h1>Passengers</h1>

      {/* Buttons Container */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', margin: '10px 0' }}>
        <button
          onClick={() => navigate('/addpassenger')}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Add New Passenger
        </button>
      </div>

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
                <th>Login ID</th>
                <th>Login Password</th>
                <th>Actions</th>
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
                  <td>{passenger.LoginID}</td>
                  <td>{passenger.LoginPW}</td>
                  <td>
                    <button onClick={() => handleEditPassenger(passenger.PassengerID)}>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePassenger(passenger.PassengerID)}
                      className="delete-button"
                    >
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

export default Passengers;
