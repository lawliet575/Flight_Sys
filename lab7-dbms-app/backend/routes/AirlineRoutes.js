const express = require("express");
const router = express.Router();
const airlineController = require("../controllers/AirlineController");

// Routes for airline operations
router.post("/airlines", airlineController.addAirline); // Add new airline
router.get("/airlines", airlineController.getAllAirlines); // Get all airlines
router.get("/airlines/:id", airlineController.getAirlineById); // Get airline by ID
router.put("/airlines/:id", airlineController.updateAirlineDetails); // Update airline
//router.delete("/airlines/:id", airlineController.deleteAirline); // Delete airline

module.exports = router;
