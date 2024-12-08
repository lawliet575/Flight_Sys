import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import './Passengers.css'; // Assuming the CSS is saved in a file named Passengers.css
import "../User_Booking_Pages/ViewBookingModule.css"


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
    <div className="view-booking-container">
      <div className="view-booking-header mt-5">
        <h1>Passengers</h1>
  
        <button
          onClick={() => navigate("/adminhome")}
          className="view-booking-back-button"
        >
          ←
        </button>
        <button
          onClick={() => navigate("/addpassenger")}
          className="view-booking-add-button"
        >
          Add New Passenger
        </button>
      </div>
  
      {passengers.length === 0 ? (
        <div className="no-bookings">
          <p>No passengers available</p>
        </div>
      ) : (
        <div className="table-container ms-5">
          <table className="table">
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
                  <td
                    style={{
                      display: "flex",
                      justifyContent: "flex-center",
                      alignItems: "center",
                      height: "88.17px",
                    }}
                  >
                    <button
                      onClick={() => handleEditPassenger(passenger.PassengerID)}
                      style={{
                        marginRight: "10px",
                        backgroundColor: "#2980b9",
                        color: "white",
                        padding: "5px 10px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        height: "30px",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePassenger(passenger.PassengerID)}
                      style={{
                        backgroundColor: "#e74c3c",
                        color: "white",
                        padding: "5px 10px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        height: "30px",
                      }}
                    >
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

export default Passengers;
