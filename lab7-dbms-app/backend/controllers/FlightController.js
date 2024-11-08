const {
    listAllFlights,
    newFlight,
    updateFlightByID
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
  


  module.exports = {
    getAllFlights,
    addFlight,
    updateFlight
  };

  