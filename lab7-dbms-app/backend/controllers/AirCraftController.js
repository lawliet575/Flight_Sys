const { createAircraft, listAllAircrafts, updateAircraft } = require("../models/AircraftModel");

/**
 * Add a new aircraft
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function addAircraft(req, res) {
  const { modelNo, capacity, airlineId } = req.body; // Extract details from the body

  try {
    await createAircraft(modelNo, capacity, airlineId); // Call the model function to create the aircraft
    res.status(201).json({ message: "Aircraft added successfully" }); // Success response
  } catch (err) {
    console.error("Error adding aircraft:", err);
    res.status(500).json({ message: "Error adding aircraft", error: err.message }); // Error handling
  }
}

/**
 * Get all aircrafts
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function getAllAircrafts(req, res) {
  try {
    const aircrafts = await listAllAircrafts(); // Call the model function to list all aircrafts
    res.json({ data: aircrafts }); // Return all aircrafts in the response
  } catch (err) {
    res.status(500).json({ message: "Error fetching aircrafts", error: err.message }); // Error handling
  }
}

/**
 * Update aircraft details
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function updateAircraftDetails(req, res) {
  try {
    const updatedData = req.body;
    

    // Update the passenger details in the database
    const result = await updateAircraft(updatedData);

    if (result.rowsAffected > 0) {
      res.json({ message: "Aircraft updated successfully" });
    } else {
      res.status(404).json({ message: "Aircraft not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error updating Aircraft", error: err });
  }
}

module.exports = {
  addAircraft,
  getAllAircrafts,
  updateAircraftDetails
};
