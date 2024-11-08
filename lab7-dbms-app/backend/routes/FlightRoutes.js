const express = require("express");
const router = express.Router();
const FlightController = require("../controllers/FlightController");

//http://localhost:3001/api/employees
router.post("/flights", FlightController.addFlight);
router.get("/flights", FlightController.getAllFlights);
router.put("/flights/", FlightController.updateFlight);

module.exports = router; 
