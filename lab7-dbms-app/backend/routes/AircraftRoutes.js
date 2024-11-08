const express = require("express");
const router = express.Router();
const aircraftController = require("../controllers/AircraftController");

// Routes for aircraft operations
router.post("/aircrafts", aircraftController.addAircraft); // Add new aircraft
router.get("/aircrafts", aircraftController.getAllAircrafts); // Get all aircrafts
router.get("/aircrafts/:id", aircraftController.getAircraftById); // Get aircraft by ID
router.put("/aircrafts/:id", aircraftController.updateAircraftDetails); // Update aircraft
router.delete("/aircrafts/:id", aircraftController.deleteAircraft); // Delete aircraft

module.exports = router;
