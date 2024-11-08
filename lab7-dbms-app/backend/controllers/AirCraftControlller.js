const { createAircraft, listAllAircrafts, findAircraftById, updateAircraft, deleteAircraft } = require("../models/AircraftModel");

/**
 * Add a new aircraft
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function addAircraft(req, res) {
  const { modelNo, capacity, airlineId } = req.body;

  try {
    await createAircraft(modelNo, capacity, airlineId);
    res.status(201).json({ message: "Aircraft added successfully" });
  } catch (err) {
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
async function getAircraftById(req, res) {
  const { id } = req.params;

  try {
    const aircraft = await findAircraftById(id);
    if (aircraft) {
      res.json({ data: aircraft });
    } else {
      res.status(404).json({ message: "Aircraft not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error fetching aircraft", error: err.message });
  }
}

/**
 * Update aircraft details
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function updateAircraftDetails(req, res) {
  const { id } = req.params;
  const { modelNo, capacity, airlineId } = req.body;

  try {
    const result = await updateAircraft(id, modelNo, capacity, airlineId);
    if (result > 0) {
      res.json({ message: "Aircraft updated successfully" });
    } else {
      res.status(404).json({ message: "Aircraft not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error updating aircraft", error: err.message });
  }
}

/**
 * Delete aircraft by ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function deleteAircraft(req, res) {
  const { id } = req.params;

  try {
    const result = await deleteAircraft(id);
    if (result > 0) {
      res.json({ message: "Aircraft deleted successfully" });
    } else {
      res.status(404).json({ message: "Aircraft not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error deleting aircraft", error: err.message });
  }
}

module.exports = {
  addAircraft,
  getAllAircrafts,
  getAircraftById,
  updateAircraftDetails,
  deleteAircraft
};
