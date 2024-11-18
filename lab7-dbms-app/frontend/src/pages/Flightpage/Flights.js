import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Flights = () => {
  const [flights, setFlights] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = () => {
    fetch('http://localhost:3001/api/flights/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Log the response for debugging

        // Restructure the data into a more readable format
        const formattedFlights = data.data.map((flight) => ({
          FlightID: flight[0],
          DepAirportID: flight[1],
          DepartureDate: flight[2],
          DepartureTime: flight[3],
          ArrAirportID: flight[4],
          ArrivalDate: flight[5],
          ArrivalTime: flight[6],
          AircraftID: flight[7],
        }));
        setFlights(formattedFlights);
      })
      .catch((error) => {
        console.error('Error fetching flights:', error);
      });
  };

  const handleAddFlight = () => {
    navigate('/addflight'); // Redirect to the add flight page
  };

  const handleEditFlight = (flightId) => {
    navigate(`/editflight/${flightId}`); // Redirect to the EditFlight page with the selected flight's ID
  };

  const handleDeleteFlight = (flightId) => {
    if (!window.confirm(`Are you sure you want to delete flight ${flightId}?`)) return;

    fetch(`http://localhost:3001/api/flights/${flightId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          alert(`Flight ${flightId} deleted successfully.`);
          fetchFlights(); // Refresh the flights list
        } else {
          response.json().then((data) => {
            alert(`Error: ${data.message}`);
          });
        }
      })
      .catch((error) => {
        console.error('Error deleting flight:', error);
        alert('An error occurred while deleting the flight.');
      });
  };

  return (
    <div>
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

      <h1>Flights</h1>

      <button onClick={handleAddFlight}>Add Flight</button>

      <div className="flight-list">
        {flights.length === 0 ? (
          <p>No flights available</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Flight ID</th>
                <th>Departure Airport ID</th>
                <th>Departure Date</th>
                <th>Departure Time</th>
                <th>Arrival Airport ID</th>
                <th>Arrival Date</th>
                <th>Arrival Time</th>
                <th>Aircraft ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight) => (
                <tr key={flight.FlightID}>
                  <td>{flight.FlightID}</td>
                  <td>{flight.DepAirportID}</td>
                  <td>{new Date(flight.DepartureDate).toLocaleDateString()}</td>
                  <td>{flight.DepartureTime}</td>
                  <td>{flight.ArrAirportID}</td>
                  <td>{new Date(flight.ArrivalDate).toLocaleDateString()}</td>
                  <td>{flight.ArrivalTime}</td>
                  <td>{flight.AircraftID}</td>
                  <td>
                    <button onClick={() => handleEditFlight(flight.FlightID)}>Edit</button>
                    <button
                      onClick={() => handleDeleteFlight(flight.FlightID)}
                      style={{
                        marginLeft: '10px',
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        padding: '5px 10px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                      }}
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

export default Flights;
