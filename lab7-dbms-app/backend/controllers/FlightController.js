const {
    listAllFlights,
    newFlight,
    updateFlightByID,
    filterByDate,
    filterByArrDep,
    filterByDateArrDep
  } = require("../models/FlightModel");
  const db = require("../config/db");
  
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
    try {
      const updatedData = req.body;
      console.log(updatedData);
  
      const result = await updateFlightByID(updatedData);
  
      if (result.rowsAffected > 0) {
        res.json({ message: "Flight updated successfully" });
      } else {
        res.status(404).json({ message: "Flight not found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Error updating flight sad", error: err });
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
// async function filterByArrDepController(req, res) {
//   const { dep_airport_id, arr_airport_id } = req.params;

//   try {
//     const flights = await filterByArrDep(dep_airport_id, arr_airport_id);
//     res.status(200).json(flights);
//   } catch (err) {
//     res.status(500).json({
//       message: "Error fetching flights by airports",
//       error: err.message || err
//     });
//   }
// }

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
    addFlight,
    updateFlight,
    filterByDateController,
    filterByArrDepController,
    filterByDateArrDepController
  };

  