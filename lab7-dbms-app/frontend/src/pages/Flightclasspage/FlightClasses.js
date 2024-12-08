import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../User_Booking_Pages/ViewBookingModule.css"



const FlightClasses = () => {
  const [flightClasses, setFlightClasses] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    // Fetching the flight classes from the backend
    fetch('http://localhost:3001/api/flightclass', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())  // Parse JSON response
      .then((data) => {
        console.log(data);  // Log the response for debugging
        setFlightClasses(data);  // Store the response data
      })
      .catch((error) => {
        console.error('Error fetching flight classes:', error);
      });
  }, []);  // Empty array means it runs only once when the component mounts

  return (
    <div className="view-booking-container" style={{ padding: "20px" }}>
      <button
        onClick={() => navigate("/adminhome")}
        className="view-booking-back-button"
        style={{
          backgroundColor: "red",
          color: "white",
          padding: "15px 30px",  // Increased padding for larger clickable area
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          display: "inline-block",
          marginTop: "20px",
          transition: "background-color 0.3s",  // Smooth transition for background change
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#b20000"; // Darker red on hover
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "red"; // Original red color when not hovered
        }}
      >
        Return to Home Page
      </button>
  
      <h1
        className="flight-classes-header"
        style={{
          fontWeight: "bold",
          color: "white",
          textAlign: "center",
          marginTop: "20px",
          marginBottom: "30px",
        }}
      >
        Flight Classes
      </h1>
  
      {flightClasses.length === 0 ? (
        <div
          className="no-bookings"
          style={{
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          <p>No flight classes available</p>
        </div>
      ) : (
        <div
          className="table-container ms-5"
          style={{
            marginTop: "30px", // Moves the table a bit down
          }}
        >
          <table
            className="table"
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th style={{ padding: "10px", textAlign: "left" }}>Class ID</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Class Description</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Baggage Allowed (kg)</th>
              </tr>
            </thead>
            <tbody>
              {flightClasses.map((flightClass) => (
                <tr key={flightClass.CLASS_ID}>
                  <td style={{ padding: "10px" }}>{flightClass.CLASS_ID}</td>
                  <td style={{ padding: "10px" }}>{flightClass.CLASS_DESCRIPTION}</td>
                  <td style={{ padding: "10px" }}>{flightClass.BAGGAGE_ALLOWED}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
  
  
  
  
  
};

export default FlightClasses;
