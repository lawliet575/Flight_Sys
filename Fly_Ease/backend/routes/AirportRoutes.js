const express = require("express");
const router = express.Router();
const airportController = require("../controllers/AirportController");

router.post("/airports", airportController.addAirport);
router.get("/airports", airportController.getAllAirports);
router.get("/airports/:id", airportController.getAirportById);
router.put("/airports/:id", airportController.updateAirportDetails);

module.exports = router;
