const express = require("express");
const router = express.Router();
const FlightController = require("../controllers/FlightController");

//http://localhost:3001/api/flights
router.get("/flights", FlightController.getAllFlights);
router.get('/flights/:id', FlightController.getFlightById);
router.post("/flights", FlightController.addFlight);
router.put("/flights/:id", FlightController.updateFlight);
router.get("/flights/:dep_date", FlightController.filterByDateController);
router.get("/flights/:dep_airport_name/:arr_airport_name", FlightController.filterByArrDepController);
router.get("/flights/:dep_date/:dep_airport_name/:arr_airport_name", FlightController.filterByDateArrDepController);
router.delete("/flights/:id", FlightController.deleteFlightById);
 

module.exports = router; 
