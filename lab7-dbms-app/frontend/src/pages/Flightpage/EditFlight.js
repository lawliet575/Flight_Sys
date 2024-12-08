import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './EditFlight.css';

const EditFlight = () => {
  const { id } = useParams(); // Get the flight ID from the URL
  const navigate = useNavigate();

  const [flightData, setFlightData] = useState({
    dep_airport_id: "",
    dep_date: "",
    dep_time: "",
    arr_airport_id: "",
    arr_date: "",
    arr_time: "",
  });
  const [airports, setAirports] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);  // Set initial state to true for loading
  const [isSubmitting, setIsSubmitting] = useState(false); // Handle submit loading

  // Fetch the flight details when the component mounts
  useEffect(() => {
    fetch(`http://localhost:3001/api/flights/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.data) {
          // Pre-fill the form fields with flight data
          setFlightData({
            dep_airport_id: data.data[1],  // Assuming data[1] is dep_airport_id
            dep_date: formatDate(data.data[2]), // Fixed the date format issue
            dep_time: data.data[3],
            arr_airport_id: data.data[4],  // Assuming data[4] is arr_airport_id
            arr_date: formatDate(data.data[5]), // Fixed the date format issue
            arr_time: data.data[6],
          });
          setIsLoading(false);  // Set loading to false after data is loaded
        } else {
          setMessage("Flight data not found.");
          setIsLoading(false);  // Set loading to false even if data is not found
        }
      })
      .catch((error) => {
        console.error("Error fetching flight data:", error);
        setMessage("Error fetching flight data.");
        setIsLoading(false);  // Set loading to false if there's an error
      });

    // Fetch airports list for dropdowns
    fetch("http://localhost:3001/api/airports")
      .then((response) => response.json())
      .then((data) => {
        setAirports(data.data); // Set airports data for dropdown
      })
      .catch((error) => {
        console.error("Error fetching airports:", error);
      });
  }, [id]);

  // Utility function to format date to 'YYYY-MM-DD' format
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Handle form submission to update flight data
  const handleUpdateFlight = (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Indicate that the form is being submitted

    // Prepare updated data
    const updatedData = {
      dep_airport_id: flightData.dep_airport_id,
      dep_date: flightData.dep_date,
      dep_time: flightData.dep_time,
      arr_airport_id: flightData.arr_airport_id,
      arr_date: flightData.arr_date,
      arr_time: flightData.arr_time,
    };

    // Send PUT request to update the flight
    fetch(`http://localhost:3001/api/flights/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsSubmitting(false); // Stop loading after form submission
        if (data.message === "Flight updated successfully") {
          setMessage("Flight updated successfully!");
        } else {
          setMessage("Error updating flight.");
        }
      })
      .catch((error) => {
        setIsSubmitting(false);
        console.error("Error updating flight:", error);
        setMessage("Error updating flight.");
      });
  };

  // Handle input change to update state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFlightData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Back to flights page
  const handleBack = () => {
    navigate("/flights");
  };

  if (isLoading) {
    return <p>Loading...</p>; // Show loading text until flight data is fetched
  }

  return (
    <div>
      <button onClick={handleBack}>Back to Flights</button>

      <h1>Edit Flight</h1>
      {message && <p>{message}</p>}

      <form  className="edit" onSubmit={handleUpdateFlight}>
        <div>
          <label>Departure Airport</label>
          <select
            name="dep_airport_id"
            value={flightData.dep_airport_id}
            onChange={handleChange}
          >
            {airports.map((airport) => (
              <option key={airport[0]} value={airport[0]}>
                {airport[1]} {/* Display the airport name */}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Departure Date</label>
          <input
            type="date"
            name="dep_date"
            value={flightData.dep_date}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Departure Time</label>
          <input
            type="text"
            name="dep_time"
            value={flightData.dep_time}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Arrival Airport</label>
          <select
            name="arr_airport_id"
            value={flightData.arr_airport_id}
            onChange={handleChange}
          >
            {airports.map((airport) => (
              <option key={airport[0]} value={airport[0]}>
                {airport[1]} {/* Display the airport name */}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Arrival Date</label>
          <input
            type="date"
            name="arr_date"
            value={flightData.arr_date}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Arrival Time</label>
          <input
            type="text"
            name="arr_time"
            value={flightData.arr_time}
            onChange={handleChange}
          />
        </div>

        <div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Flight"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditFlight;
