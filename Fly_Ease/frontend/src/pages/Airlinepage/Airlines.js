import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../User_Booking_Pages/ViewBookingModule.css"



const Airlines = () => {
  const [airlines, setAirlines] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    fetch('http://localhost:3001/api/airlines/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        console.log('Response status:', response.status);  // Check the response status
        return response.json();
      })
      .then((data) => {
        console.log('Fetched data:', data);  // Check the fetched data
        if (data.data) {
          const formattedAirlines = data.data.map((airline) => ({
            AirlineID: airline[0],
            AirlineName: airline[1],
            FoundedDate: airline[2],
            Type: airline[3],
          }));
          setAirlines(formattedAirlines);
        } else {
          console.error('No data found in response');
        }
      })
      .catch((error) => {
        console.error('Error fetching airlines:', error);
      });
  }, []);

  return (
    <div className="view-booking-container">
      <div className="view-booking-header mt-5">
        <h1>Airlines</h1>
  
        <button
          onClick={() => navigate("/adminhome")}
          className="view-booking-back-button"
        >
          ←
        </button>
      </div>
  
      {airlines.length === 0 ? (
        <div className="no-bookings">
          <p>No airlines available</p>
        </div>
      ) : (
        <div className="table-container ms-5">
          <table className="table">
            <thead>
              <tr>
                <th>Airline ID</th>
                <th>Airline Name</th>
                <th>Founded Date</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {airlines.map((airline) => (
                <tr key={airline.AirlineID}>
                  <td>{airline.AirlineID}</td>
                  <td>{airline.AirlineName}</td>
                  <td>{new Date(airline.FoundedDate).toLocaleDateString()}</td>
                  <td>{airline.Type}</td>
                 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
  
};

export default Airlines;
