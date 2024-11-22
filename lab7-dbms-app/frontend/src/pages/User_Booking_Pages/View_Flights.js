import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";


function ViewFlight() {
  const [flights, setFlights] = useState([]);
  const [airportDetails, setAirportDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [departureSearch, setDepartureSearch] = useState(""); // Search state for departure city
  const [arrivalSearch, setArrivalSearch] = useState(""); // Search state for arrival city
  const [departureCityOptions, setDepartureCityOptions] = useState([]); // List of available departure cities
  const [arrivalCityOptions, setArrivalCityOptions] = useState([]); // List of available arrival cities
  const [showDepartureDropdown, setShowDepartureDropdown] = useState(false); // Controls showing of dropdown
  const [showArrivalDropdown, setShowArrivalDropdown] = useState(false); // Controls showing of dropdown
  const departureRef = useRef(null);
  const arrivalRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside the input fields
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (departureRef.current && !departureRef.current.contains(event.target)) {
        setShowDepartureDropdown(false);
      }
      if (arrivalRef.current && !arrivalRef.current.contains(event.target)) {
        setShowArrivalDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchAirportDetails = async (airportId) => {
      try {
        const response = await fetch(`http://localhost:3001/api/airports/${airportId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch details for airport ${airportId}`);
        }
        const airportData = await response.json();
        return {
          name: airportData.data[1],
          city: airportData.data[2],
        };
      } catch (error) {
        console.error(error);
        return { name: "Unknown", city: "Unknown" };
      }
    };

    const fetchFlights = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/flights");
        if (!response.ok) {
          throw new Error("Failed to fetch flights data.");
        }
        const data = await response.json();
        const flightData = data.data;

        const airportIds = [
          ...new Set(flightData.flatMap(flight => [flight[1], flight[4]])) // Collect unique airport IDs (departure and arrival)
        ];

        const airportPromises = airportIds.map(airportId => fetchAirportDetails(airportId));
        const airports = await Promise.all(airportPromises);

        const airportInfo = airports.reduce((acc, airport, index) => {
          acc[airportIds[index]] = airport;
          return acc;
        }, {});

        // Extract cities for departure and arrival
        const departureCities = Array.from(new Set(flightData.map(flight => airportInfo[flight[1]]?.city))).filter(Boolean);
        const arrivalCities = Array.from(new Set(flightData.map(flight => airportInfo[flight[4]]?.city))).filter(Boolean);

        setFlights(flightData);
        setAirportDetails(airportInfo);
        setDepartureCityOptions(departureCities);
        setArrivalCityOptions(arrivalCities);
      } catch (err) {
        setError("Error fetching flight or airport data.");
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, []);

  // Filter flights based on departure or arrival city
  const filteredFlights = flights.filter((flight) => {
    const departureCity = airportDetails[flight[1]]?.city.toLowerCase() || "";
    const arrivalCity = airportDetails[flight[4]]?.city.toLowerCase() || "";

    return (
      (departureSearch === "" || departureCity.includes(departureSearch.toLowerCase())) &&
      (arrivalSearch === "" || arrivalCity.includes(arrivalSearch.toLowerCase()))
    );
  });

  if (loading) {
    return <div>Loading flights...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const formatDate = (date) => new Date(date).toLocaleDateString();
  const formatTime = (time) => time;

  const handleBookClick = (flightId) => {
    navigate(`/userbooking/${flightId}`);
  };

  const handleDepartureSearchChange = (e) => {
    const value = e.target.value;
    setDepartureSearch(value);
    setShowDepartureDropdown(value === ""); // Show dropdown if input is empty
  };

  const handleArrivalSearchChange = (e) => {
    const value = e.target.value;
    setArrivalSearch(value);
    setShowArrivalDropdown(value === ""); // Show dropdown if input is empty
  };

  const handleSwapClick = () => {
    setDepartureSearch(arrivalSearch);
    setArrivalSearch(departureSearch);
  };

  // Reset the search fields and filtered flights
  const resetSearch = () => {
    setDepartureSearch("");
    setArrivalSearch("");
    setShowDepartureDropdown(false);
    setShowArrivalDropdown(false);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Available Flights</h1>
      
      <button onClick={() => navigate("/home")} style={styles.backButton}>Go Back to Home</button>

      {/* Search filters */}
      <div style={styles.searchContainer}>
        {/* Departure Search */}
        <div style={styles.inputContainer} ref={departureRef}>
          <input
            type="text"
            placeholder="From"
            value={departureSearch}
            onChange={handleDepartureSearchChange}
            onFocus={() => setShowDepartureDropdown(true)} // Show dropdown when focused
            style={styles.searchInput}
          />
          {showDepartureDropdown && (
            <div style={styles.dropdown}>
              {departureCityOptions.map((city, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setDepartureSearch(city);
                    setShowDepartureDropdown(false); // Close dropdown after selection
                  }}
                  style={styles.dropdownItem}
                >
                  {city}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Swap Button */}
        <button onClick={handleSwapClick} style={styles.swapButton}>↔</button>

        {/* Arrival Search */}
        <div style={styles.inputContainer} ref={arrivalRef}>
          <input
            type="text"
            placeholder="To"
            value={arrivalSearch}
            onChange={handleArrivalSearchChange}
            onFocus={() => setShowArrivalDropdown(true)} // Show dropdown when focused
            style={styles.searchInput}
          />
          {showArrivalDropdown && (
            <div style={styles.dropdown}>
              {arrivalCityOptions.map((city, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setArrivalSearch(city);
                    setShowArrivalDropdown(false); // Close dropdown after selection
                  }}
                  style={styles.dropdownItem}
                >
                  {city}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reset Button */}
      <button onClick={resetSearch} style={styles.resetButton}>
        Reset Search
      </button>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Departure Airport Name</th>
              <th>Departure City</th>
              <th>Departure Date</th>
              <th>Departure Time</th>
              <th>Arrival Airport Name</th>
              <th>Arrival City</th>
              <th>Arrival Date</th>
              <th>Arrival Time</th>
              <th>Book</th>
            </tr>
          </thead>
          <tbody>
            {filteredFlights.map((flight, index) => (
              <tr key={index}>
                <td>{airportDetails[flight[1]]?.name || "Unknown"}</td>
                <td>{airportDetails[flight[1]]?.city || "Unknown"}</td>
                <td>{formatDate(flight[2])}</td>
                <td>{formatTime(flight[3])}</td>
                <td>{airportDetails[flight[4]]?.name || "Unknown"}</td>
                <td>{airportDetails[flight[4]]?.city || "Unknown"}</td>
                <td>{formatDate(flight[5])}</td>
                <td>{formatTime(flight[6])}</td>
                <td>
                  <button
                    onClick={() => handleBookClick(flight[0])}
                    style={styles.bookButton}
                  >
                    Book
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
  },
  header: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  searchContainer: {
    marginBottom: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputContainer: {
    position: "relative",
    width: "45%",
  },
  searchInput: {
    width: "100%",
    padding: "8px",
    fontSize: "16px",
    borderRadius: "4px",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: "0",
    right: "0",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    maxHeight: "200px",
    overflowY: "auto",
    zIndex: "1",
  },
  dropdownItem: {
    padding: "8px",
    cursor: "pointer",
  },
  swapButton: {
    margin: "0 10px",
    padding: "8px",
    cursor: "pointer",
  },
  resetButton: {
    padding: "8px 16px",
    backgroundColor: "#ff4500",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    marginTop: "20px",
  },
  tableContainer: {
    marginTop: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  bookButton: {
    padding: "8px 16px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};

export default ViewFlight;
