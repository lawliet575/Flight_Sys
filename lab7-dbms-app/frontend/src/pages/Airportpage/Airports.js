import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";


const Airports = () => {
  const [airports, setAirports] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    fetch('http://localhost:3001/api/airports/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        console.log('Response status:', response.status); // Log response status
        return response.json();
      })
      .then((data) => {
        console.log('Fetched data:', data); // Log fetched data
        if (data.data) {
          const formattedAirports = data.data.map((airport) => ({
            AirportID: airport[0],
            AirportName: airport[1],
            City: airport[2],
          }));
          setAirports(formattedAirports);
        } else {
          console.error('No data found in response');
        }
      })
      .catch((error) => {
        console.error('Error fetching airports:', error);
      });
  }, []);

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

      <h1>Airports</h1>
      <div className="airport-list">
        {airports.length === 0 ? (
          <p>No airports available</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Airport ID</th>
                <th>Airport Name</th>
                <th>City</th>
              </tr>
            </thead>
            <tbody>
              {airports.map((airport) => (
                <tr key={airport.AirportID}>
                  <td>{airport.AirportID}</td>
                  <td>{airport.AirportName}</td>
                  <td>{airport.City}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Airports;
