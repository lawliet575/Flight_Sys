const express = require("express");
const router = express.Router();
const FlightController = require("../controllers/FlightController");

//http://localhost:3001/api/flights
router.get("/flights", FlightController.getAllFlights);
router.post("/flights", FlightController.addFlight);
router.put("/flights", FlightController.updateFlight);
router.get("/flights/:dep_date", FlightController.filterByDateController);
router.get("/flights/:dep_airport_name/:arr_airport_name", FlightController.filterByArrDepController);
router.get("/flights/:dep_date/:dep_airport_name/:arr_airport_name", FlightController.filterByDateArrDepController);


module.exports = router; 
