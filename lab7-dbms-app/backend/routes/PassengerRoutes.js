const express = require("express");
const router = express.Router();
const PassengerController = require("../controllers/PassengerController");

// Route to get all passengers
// Endpoint: GET /api/passengers
router.get("/passengers", PassengerController.getAllPassengers);

router.get('/passengers/:id', PassengerController.getPassengerById);


//get id vali

// Route to add a new passenger
// Endpoint: POST /api/passengers
router.post("/passengers", PassengerController.addPassenger);
//post ko ese he rehne do

// Route to update a passenger by ID
// Endpoint: PUT /api/passengers
router.put("/passengers/:id", PassengerController.updatePassenger);

router.delete("/passengers/:id", PassengerController.deletePassengerById);


module.exports = router;
