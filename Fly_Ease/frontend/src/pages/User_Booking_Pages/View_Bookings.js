import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { PassengerContext } from "../Loginpage/PassengerContext";
import "./ViewBookingModule.css";

function ViewBooking() {
  const { passengerId } = useContext(PassengerContext);
  const [bookings, setBookings] = useState([]);
  const [flightClasses, setFlightClasses] = useState({});
  const [airports, setAirports] = useState({});
  const [flightDetails, setFlightDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filteredBookings, setFilteredBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!passengerId) {
      alert("Please log in to view bookings.");
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [bookingsResponse, classesResponse, airportsResponse] = await Promise.all([
          fetch("http://localhost:3001/api/bookings"),
          fetch("http://localhost:3001/api/flightclass"),
          fetch("http://localhost:3001/api/airports"),
        ]);

        if (!bookingsResponse.ok || !classesResponse.ok || !airportsResponse.ok) {
          throw new Error("Failed to fetch data.");
        }

        const bookingsData = await bookingsResponse.json();
        const classesData = await classesResponse.json();
        const airportsData = await airportsResponse.json();

        setBookings(bookingsData);

        // Map class IDs to descriptions
        const classMap = {};
        classesData.forEach((cls) => {
          classMap[cls.CLASS_ID] = cls.CLASS_DESCRIPTION;
        });
        setFlightClasses(classMap);

        // Map airport IDs to details
        const airportMap = {};
        airportsData.data.forEach((airport) => {
          airportMap[airport[0]] = {
            name: airport[1],
            city: airport[2],
          };
        });
        setAirports(airportMap);

        // Filter bookings by passengerId
        const filtered = bookingsData.filter((booking) => booking[1] === passengerId);
        setFilteredBookings(filtered);

        // Fetch flight details for each booking
        const flightPromises = filtered.map((booking) =>
          fetch(`http://localhost:3001/api/flights/${booking[2]}`)
        );

        const flightResponses = await Promise.all(flightPromises);
        const flightDetailsMap = {};

        for (let i = 0; i < flightResponses.length; i++) {
          if (flightResponses[i].ok) {
            const flightData = await flightResponses[i].json();
            flightDetailsMap[flightData.data[0]] = {
              departureAirport: flightData.data[1],
              arrivalAirport: flightData.data[4],
            };
          }
        }
        setFlightDetails(flightDetailsMap);
      } catch (err) {
        setError("Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [passengerId, navigate]);

  if (loading) {
    return <div className="loading">Loading bookings...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="view-booking-container">
      <div className="view-booking-header">
        <h1>My Booked Flights</h1>
      </div>

      <button onClick={() => navigate("/home")} className="view-booking-back-button">
        ←
      </button>

      {filteredBookings.length === 0 ? (
        <div className="no-bookings">
          <p>No bookings found for your account.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Departure </th>
                <th>Arrival </th>
                <th>Class</th>
                <th>Seat</th>
                <th>Flight Date</th>
                <th>Price (in USD)</th>
                
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking, index) => {
                const flightId = booking[2];
                const flightDetail = flightDetails[flightId] || {};
                const departureAirport = airports[flightDetail.departureAirport] || {};
                const arrivalAirport = airports[flightDetail.arrivalAirport] || {};

                return (
                  <tr key={index}>
                    <td>{booking[0]}</td>
                    <td>
                      {departureAirport.name}, {departureAirport.city}
                    </td>
                    <td>
                      {arrivalAirport.name}, {arrivalAirport.city}
                    </td>
                    <td>{flightClasses[booking[3]] || "Unknown Class"}</td>
                    <td>{booking[5]}</td>
                    <td>{new Date(booking[4]).toLocaleDateString()}</td>
                    <td>{booking[6]}</td>
                    
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ViewBooking;
