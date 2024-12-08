const { createAirline, listAllAirlines, findAirlineById, updateAirline } = require("../models/AirlineModel");

/**
 * Add a new airline
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function addAirline(req, res) {
  const { airlineName, foundingDate, scope } = req.body;

  try {
    await createAirline(airlineName, foundingDate, scope);
    res.status(201).json({ message: "Airline added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error adding airline", error: err.message });
  }
}

/**
 * Get all airlines
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function getAllAirlines(req, res) {
  try {
    const airlines = await listAllAirlines();
    res.json({ data: airlines });
  } catch (err) {
    res.status(500).json({ message: "Error fetching airlines", error: err.message });
  }
}

/**
 * Get airline by ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function getAirlineById(req, res) {
  const { id } = req.params;

  try {
    const airline = await findAirlineById(id);
    if (airline) {
      res.json({ data: airline });
    } else {
      res.status(404).json({ message: "Airline not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error fetching airline", error: err.message });
  }
}

/**
 * Update airline details
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function updateAirlineDetails(req, res) {
  const { id } = req.params;
  const { airlineName, foundingDate, scope } = req.body;

  // Prepare the data object dynamically for update
  const updateData = {};
  if (airlineName !== undefined) updateData.AIRLINE_NAME = airlineName;
  if (foundingDate !== undefined) updateData.FOUNDING_DATE = foundingDate;
  if (scope !== undefined) updateData.A_SCOPE = scope;

  try {
    const result = await updateAirline(id, updateData); // Passing the update data object
    if (result > 0) {
      res.json({ message: "Airline updated successfully" });
    } else {
      res.status(404).json({ message: "Airline not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error updating airline", error: err.message });
  }
}


module.exports = {
  addAirline,
  getAllAirlines,
  getAirlineById,
  updateAirlineDetails

};
