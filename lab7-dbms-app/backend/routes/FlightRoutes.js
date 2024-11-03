const express = require("express");
const router = express.Router();
const FlightController = require("../controllers/FlightController");

//http://localhost:3001/api/employees
router.get("/flights", FlightController.getAllFlights);
// router.get("/employeeIDMax", employeeController.getIDMax);
router.post("/flights", FlightController.addFlight);
router.put("/flights/", FlightController.updateFlight);
// router.delete("/employees/:id", employeeController.deleteEmployee);

module.exports = router;
