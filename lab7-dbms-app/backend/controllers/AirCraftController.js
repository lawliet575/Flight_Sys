const { createAircraft, listAllAircrafts, updateAircraft,/* ,deleteAircraft*/ }
 = require("../models/AircraftModel");

/**
 * Add a new aircraft
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function addAircraft(req, res) {
  const { aircraftID, modelNo, capacity, airlineId } = req.body;

  try {
    await createAircraft(aircraftID, modelNo, capacity, airlineId);
    res.status(201).json({ message: "Aircraft added successfully" });
  } catch (err) {
    console.error("Error adding aircraft:", err);
    res.status(500).json({ message: "Error adding aircraft", error: err.message });
  }
}


/**
 * Get all aircrafts
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function getAllAircrafts(req, res) {
  try {
    const aircrafts = await listAllAircrafts();
    res.json({ data: aircrafts });
  } catch (err) {
    res.status(500).json({ message: "Error fetching aircrafts", error: err.message });
  }
}

/**
 * Get aircraft by ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */

/**
 * Update aircraft details
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function updateAircraftDetails(req, res) {
  const { id, modelNo, capacity, airlineId } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Aircraft ID is required" });
  }

  try {
    // Call model function to update aircraft with only provided fields
    const result = await updateAircraft(id, modelNo, capacity, airlineId);
    if (result > 0) {
      res.json({ message: "Aircraft updated successfully" });
    } else {
      res.status(404).json({ message: "Aircraft not found" });
    }
  } catch (err) {
    console.error("Error updating aircraft:", err);
    res.status(500).json({ message: "Error updating aircraft", error: err.message });
  }
}




module.exports = {
  addAircraft,
  getAllAircrafts,
  updateAircraftDetails
};
