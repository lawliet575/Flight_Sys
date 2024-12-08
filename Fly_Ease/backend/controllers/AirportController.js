const { createAirport, listAllAirports, findAirportById, updateAirport } = require("../models/AirportModel");

/**
 * Add a new airport
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function addAirport(req, res) {
  const { airportName, city } = req.body;

  try {
    await createAirport(airportName, city);
    res.status(201).json({ message: "Airport added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error adding airport", error: err.message });
  }
}

/**
 * Get all airports
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function getAllAirports(req, res) {
  try {
    const airports = await listAllAirports();
    res.json({ data: airports });
  } catch (err) {
    res.status(500).json({ message: "Error fetching airports", error: err.message });
  }
}

/**
 * Get airport by ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function getAirportById(req, res) {
  const { id } = req.params;

  try {
    const airport = await findAirportById(id);
    if (airport) {
      res.json({ data: airport });
    } else {
      res.status(404).json({ message: "Airport not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error fetching airport", error: err.message });
  }
}

/**
 * Update airport details
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function updateAirportDetails(req, res) {
  const { id } = req.params;
  const { airportName, city } = req.body;

  // Prepare the data object dynamically for update
  const updateData = {};
  if (airportName !== undefined) updateData.AIRPORT_NAME = airportName;
  if (city !== undefined) updateData.CITY = city;

  try {
    const result = await updateAirport(id, updateData); // Passing the update data object
    if (result > 0) {
      res.json({ message: "Airport updated successfully" });
    } else {
      res.status(404).json({ message: "Airport not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error updating airport", error: err.message });
  }
}

module.exports = {
  addAirport,
  getAllAirports,
  getAirportById,
  updateAirportDetails
};
