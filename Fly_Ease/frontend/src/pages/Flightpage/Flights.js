import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../User_Booking_Pages/ViewBookingModule.css"

const Flights = () => {
  const [flights, setFlights] = useState([]);
  const [aircraftData, setAircraftData] = useState([]);
  const [airlineNames, setAirlineNames] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchFlights();
    fetchAircraftData(); // Fetch the aircraft data when the component loads
  }, []);

  // Fetch flights data
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

        // Fetch departure and arrival airport names and cities
        const fetchAirportDetails = (airportId) => {
          return fetch(`http://localhost:3001/api/airports/${airportId}`)
            .then((response) => response.json())
            .then((data) => ({
              name: data.data[1], // Only airport name, no city
              city: data.data[2], // City
            }));
        };

        // Restructure the data into a more readable format and fetch airport details
        const formattedFlightsPromises = data.data.map((flight) => {
          return Promise.all([
            fetchAirportDetails(flight[1]), // Departure Airport ID
            fetchAirportDetails(flight[4]), // Arrival Airport ID
          ]).then(([departureDetails, arrivalDetails]) => ({
            FlightID: flight[0],
            DepAirport: departureDetails.name, // Only the airport name
            DepAirportCity: departureDetails.city, // City in separate column
            DepartureDate: flight[2],
            DepartureTime: flight[3],
            ArrAirport: arrivalDetails.name, // Only the airport name
            ArrAirportCity: arrivalDetails.city, // City in separate column
            ArrivalDate: flight[5],
            ArrivalTime: flight[6],
            AircraftID: flight[7],
          }));
        });

        // Wait for all airport details to be fetched
        Promise.all(formattedFlightsPromises)
          .then((formattedFlights) => {
            setFlights(formattedFlights);
          })
          .catch((error) => {
            console.error('Error fetching airport details:', error);
          });
      })
      .catch((error) => {
        console.error('Error fetching flights:', error);
      });
  };

  // Fetch aircraft data
  const fetchAircraftData = () => {
    fetch('http://localhost:3001/api/aircrafts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAircraftData(data.data); // Set aircraft data to state
        fetchAirlineNames(data.data); // Once aircraft data is loaded, fetch airline names
      })
      .catch((error) => {
        console.error('Error fetching aircraft data:', error);
      });
  };

  // Fetch airline names for all aircraft
  const fetchAirlineNames = (aircraftData) => {
    const airlinePromises = aircraftData.map((aircraft) => {
      const airlineId = aircraft[3];
      return fetch(`http://localhost:3001/api/airlines/${airlineId}`)
        .then((response) => response.json())
        .then((data) => ({
          [airlineId]: data.data[1], // Store airline name with airlineId as key
        }));
    });

    // After fetching all airline names, update the state
    Promise.all(airlinePromises)
      .then((airlines) => {
        const airlinesObject = airlines.reduce((acc, airline) => ({ ...acc, ...airline }), {});
        setAirlineNames(airlinesObject);
      })
      .catch((error) => {
        console.error('Error fetching airline names:', error);
      });
  };

  // Handle add flight
  const handleAddFlight = () => {
    navigate('/addflight'); // Redirect to the add flight page
  };

  // Handle edit flight
  const handleEditFlight = (flightId) => {
    navigate(`/editflight/${flightId}`); // Redirect to the EditFlight page with the selected flight's ID
  };

  // Handle delete flight
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
    <div className="view-booking-container">
      <div className='view-booking-header mt-5'>
      <h1 >Flights</h1>

      <button onClick={() => navigate("/adminhome")} className="view-booking-back-button">
        ←
      </button>
      <button onClick={handleAddFlight} className='view-booking-add-button'>Add Flight</button>
      
      </div>    

      {flights.length === 0 ? (
        <div className="no-bookings">
          <p>No flights.</p>
        </div>
      ) : ( <div className='table-container ms-5'>
          <table className='table'>
            <thead>
              <tr>
                <th>Flight ID</th>
                <th>Departure Airport</th> {/* Only airport name */}
                <th style={{ width: '200px' }}>Departure Airport City</th> {/* Wider column for city */}
                <th>Departure Date</th>
                <th>Departure Time</th>
                <th>Arrival Airport</th> {/* Only airport name */}
                <th style={{ width: '200px' }}>Arrival Airport City</th> {/* Wider column for city */}
                <th>Arrival Date</th>
                <th>Arrival Time</th>
                <th>Airline</th> {/* Replaced Aircraft ID with Airline */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight) => {
                // Match the AircraftID with the data and fetch the corresponding airline name
                const aircraft = aircraftData.find((ac) => ac[0] === flight.AircraftID);
                const airlineId = aircraft ? aircraft[3] : null;
                const airlineName = airlineId ? airlineNames[airlineId] : 'Loading...';

                return (
                  <tr key={flight.FlightID}>
                    <td>{flight.FlightID}</td>
                    <td>{flight.DepAirport}</td> {/* Only airport name */}
                    <td>{flight.DepAirportCity}</td> {/* City in separate column */}
                    <td>{new Date(flight.DepartureDate).toLocaleDateString()}</td>
                    <td>{flight.DepartureTime}</td>
                    <td>{flight.ArrAirport}</td> {/* Only airport name */}
                    <td>{flight.ArrAirportCity}</td> {/* City in separate column */}
                    <td>{new Date(flight.ArrivalDate).toLocaleDateString()}</td>
                    <td>{flight.ArrivalTime}</td>
                    <td>{airlineName}</td> {/* Display airline name */}
                    <td style={{ display: 'flex', justifyContent: 'flex-center', alignItems: 'center', height: '88.17px'}}>
                      <button
                        onClick={() => handleEditFlight(flight.FlightID)}
                        style={{
                          marginRight: '10px',
                          backgroundColor: '#2980b9',
                          color: 'white',
                          padding: '5px 10px',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          height: '30px'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteFlight(flight.FlightID)}
                        style={{
                          backgroundColor: '#e74c3c',
                          color: 'white',
                          padding: '5px 10px',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          height: '30px'
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        )}
      </div>
    
  );
};

export default Flights;
