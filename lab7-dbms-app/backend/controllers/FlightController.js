const {
    listAllFlights,
    getFlightByIdFromDB,
    newFlight,
    updateFlightByID,
    deleteFlightByIdFromDB,
    filterByDate,
    filterByArrDep,
    filterByDateArrDep
  } = require("../models/FlightModel");
  
  /**
   * Get all flights
   * @param req - Request object
   * @param res - Response object
   */

  
  async function getAllFlights(req, res) {
    try {
      // get all flights
      const flights = await listAllFlights();
      console.log(flights)
      // send response with flights in json
      res.json({ data: flights });
    } catch (err) {
      res.status(500).json({ message: "Error fetching flights", error: err });
    }
  }

  async function getFlightById(req, res) {
    const { id } = req.params; // Get the flight ID from the URL parameters
  
    try {
      const flight = await getFlightByIdFromDB(id); // Fetch the flight by ID from the model
  
      if (flight) {
        res.json({ data: flight });
      } else {
        res.status(404).json({ message: "Flight not found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Error fetching flight details", error: err.message });
    }
  }

  async function deleteFlightById(req, res) {
    const { id } = req.params; // Get the flight ID from the URL parameters
  
    try {
      const result = await deleteFlightByIdFromDB(id); // Delete the flight by ID from the model
  
      if (result) {
        res.json({ message: "Flight deleted successfully" });
      } else {
        res.status(404).json({ message: "Flight not found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Error deleting flight", error: err.message });
    }
  }


  /**
 * Add a new flight
 * @param req - Request object
 * @param res - Response object
 */
async function addFlight(req, res) {
    try {
      await newFlight(req.body);
      res.status(201).json({ message: "Flight added successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error adding flight", error: err });
    }
  }

  async function updateFlight(req, res) {
    const flightId = req.params.id;  // Get the flight ID from the URL
    const updatedData = req.body;    // Get the updated flight data from the request body
  
    try {
      // Pass both the flightId and updatedData separately to the model function
      const result = await updateFlightByID(flightId, updatedData);
  
      // Check if the flight was updated
      if (result.rowsAffected > 0) {
        res.json({ message: "Flight updated successfully" });
      } else {
        res.status(404).json({ message: "Flight not found" });
      }
    } catch (err) {
      console.error('Error updating flight:', err);
      res.status(500).json({ message: "Error updating flight", error: err.message });
    }
  }
 
// Controller to filter flights by date
async function filterByDateController(req, res) {
  const dep_date = req.params.dep_date;

  try {
    const flights = await filterByDate(dep_date);
    if (flights.length > 0) {
      res.status(200).json({ message: "Flights found", data: flights });
    } else {
      res.status(404).json({ message: "No flights found for this date" });
    }
  } catch (error) {
    console.error("Error fetching flights by date:", error); // Log full error
    res.status(500).json({ message: "Error fetching flights by date", error: error.message || error });
  }
}

// Controller to filter flights by departure and arrival airports
async function filterByArrDepController(req, res) {
  const { dep_airport_id, arr_airport_id } = req.params;

  try {
    const flights = await filterByArrDep(dep_airport_id, arr_airport_id);
    res.status(200).json(flights);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching flights by airports",
      error: err.message || err
    });
  }
}

async function filterByArrDepController(req, res) {
  const { dep_airport_name, arr_airport_name } = req.params;

  try {
    const flights = await filterByArrDep(dep_airport_name, arr_airport_name);
    res.status(200).json(flights);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching flights by airport names",
      error: err.message || err
    });
  }
}

// Controller to filter flights by date, departure, and arrival airports
async function filterByDateArrDepController(req, res) {
  const { dep_date, dep_airport_name, arr_airport_name } = req.params;

  try {
    const flights = await filterByDateArrDep(dep_date, dep_airport_name, arr_airport_name);
    res.status(200).json(flights);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching flights by date and airport names",
      error: err.message || err
    });
  }
}


  module.exports = {
    getAllFlights,
    getFlightById,
    addFlight,
    updateFlight,
    filterByDateController,
    filterByArrDepController,
    filterByDateArrDepController,
    deleteFlightById
  };

  