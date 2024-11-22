import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


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
    <div>
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
      <h1>Flight Classes</h1>
      <div className="flight-class-list">
        {flightClasses.length === 0 ? (
          <p>No flight classes available</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Class ID</th>
                <th>Class Description</th>
                <th>Baggage Allowed (kg)</th>
              </tr>
            </thead>
            <tbody>
              {flightClasses.map((flightClass) => (
                <tr key={flightClass.CLASS_ID}>
                  <td>{flightClass.CLASS_ID}</td>
                  <td>{flightClass.CLASS_DESCRIPTION}</td>
                  <td>{flightClass.BAGGAGE_ALLOWED}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FlightClasses;
