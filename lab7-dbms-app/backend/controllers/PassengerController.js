const {
    listAllPassengers,
    getPassengerByIdFromDB,
    newPassenger,
    updatePassengerByID,
    deletePassengerByIdFromDB
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

  async function getPassengerById(req, res) {
    const { id } = req.params; // Get the passenger ID from the URL parameters

    try {
        const passenger = await getPassengerByIdFromDB(id); // Fetch the passenger by ID from the model

        if (passenger) {
            res.json({ data: passenger });
        } else {
            res.status(404).json({ message: "Passenger not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error fetching passenger details", error: err.message });
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
    const passengerId = req.params.id; // Get the passenger ID from the URL
    const updatedData = req.body;    // Get the updated passenger data from the request body
  
    try {
      // Pass both the passengerId and updatedData separately to the model function
      const result = await updatePassengerByID(passengerId, updatedData);
  
      // Check if the passenger was updated
      if (result.rowsAffected > 0) {
        res.json({ message: "Passenger updated successfully" });
      } else {
        res.status(404).json({ message: "Passenger not found" });
      }
    } catch (err) {
      console.error('Error updating passenger:', err);
      res.status(500).json({ message: "Error updating passenger", error: err.message });
    }
  }

  async function deletePassengerById(req, res) {
    const { id } = req.params; // Get the passenger ID from the URL parameters

    try {
        const result = await deletePassengerByIdFromDB(id); // Delete the passenger by ID from the model

        if (result) {
            res.json({ message: "Passenger deleted successfully" });
        } else {
            res.status(404).json({ message: "Passenger not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error deleting passenger", error: err.message });
    }
}
  
  module.exports = {
    getAllPassengers,
    getPassengerById,
    addPassenger,
    updatePassenger,
    deletePassengerById
  };
  