const express = require("express");
const router = express.Router();
const aircraftController = require("../controllers/AircraftController");

// Routes for aircraft operations
router.post("/aircrafts", aircraftController.addAircraft); // Add new aircraft
router.get("/aircrafts", aircraftController.getAllAircrafts); // Get all aircrafts
router.put("/aircrafts", aircraftController.updateAircraftDetails); // Update aircraft

module.exports = router;
