const express = require("express");
const router = express.Router();
const flightClassController = require("../controllers/flightClassController");

// Route to get all flight classes
router.get("/flightclass", flightClassController.listAllFlightClasses);

// Route to add a new flight class
router.post("/flightclass", flightClassController.newFlightClass);

module.exports = router;