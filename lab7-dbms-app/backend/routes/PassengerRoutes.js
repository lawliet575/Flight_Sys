const express = require("express");
const router = express.Router();
const PassengerController = require("../controllers/PassengerController");

// Route to get all passengers
// Endpoint: GET /api/passengers
router.get("/passengers", PassengerController.getAllPassengers);

// Route to add a new passenger
// Endpoint: POST /api/passengers
router.post("/passengers", PassengerController.addPassenger);

// Route to update a passenger by ID
// Endpoint: PUT /api/passengers
router.put("/passengers", PassengerController.updatePassenger);

module.exports = router;
