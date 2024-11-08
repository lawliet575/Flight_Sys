const {
    listAllPassengers,
    newPassenger,
    updatePassengerByID
  } = require("../models/PassengerModel");
  
  /**
   * Get all passengers
   * @param req - Request object
   * @param res - Response object
   */
  async function getAllPassengers(req, res) {
    try {
      // Fetch all passengers from the database
      const passengers = await listAllPassengers();
      // Respond with passengers data in JSON format
      res.json({ data: passengers });
    } catch (err) {
      res.status(500).json({ message: "Error fetching passengers", error: err });
    }
  }
  
  /**
   * Add a new passenger
   * @param req - Request object
   * @param res - Response object
   */
  async function addPassenger(req, res) {
    try {
      // Validate request body against the database schema requirements
      const passengerData = req.body;
      if (!passengerData.PassengerID || !passengerData.Name || !passengerData.Contact) {
        return res.status(400).json({ message: "PassengerID, Name, and Contact are required fields." });
      }
  
      // Call model function to add new passenger to the database
      await newPassenger(passengerData);
      res.status(201).json({ message: "Passenger added successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error adding passenger", error: err });
    }
  }
  
  /**
   * Update a passenger by ID
   * @param req - Request object
   * @param res - Response object
   */
  async function updatePassenger(req, res) {
    try {
      const updatedData = req.body;
      
      // Ensure the request includes the necessary PassengerID to locate the passenger record
      if (!updatedData.PassengerID) {
        return res.status(400).json({ message: "PassengerID is required to update a passenger record." });
      }
  
      // Update the passenger details in the database
      const result = await updatePassengerByID(updatedData);
  
      if (result.rowsAffected > 0) {
        res.json({ message: "Passenger updated successfully" });
      } else {
        res.status(404).json({ message: "Passenger not found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Error updating passenger", error: err });
    }
  }
  
  module.exports = {
    getAllPassengers,
    addPassenger,
    updatePassenger
  };
  