const express = require("express");
const router = express.Router();
const BookingController = require("../controllers/BookingController");

// Route to create a new booking
router.get("/bookings", BookingController.getAllBookings);
router.get('/bookings/:id', BookingController.getBookingById);

// Route to add a new booking
router.post("/bookings", BookingController.addBooking); //this is for user only now
//admin cannot

router.get("/bookingprice/:flightId/:classId", BookingController.getprice);

// Route to update a booking
router.put('/bookings/:id', BookingController.updateBooking);

//get se dalna 2 param pr phir hamne call krna ise and dal dena add booking price wale page pr easy
// Route to delete a booking (ID in body)
router.delete('/bookings/:id', BookingController.deleteBooking)

//externel functions for stats to be used by the admin
router.get("/popularflight", BookingController.mostpopularflight); //most popular flight name and its number of bookings showed
router.get("/flightclassbookings", BookingController.bookedflightclass); //number of bookings for each flight classes 
router.get("/expflight", BookingController.expensiveflight); //most expensive flight booked along with flight id
router.get("/cheapflight", BookingController.cheapestflight);// most cheapest flight booked along with flight id
router.get("/avgflightcost", BookingController.averageflightcost);// avg flight cost
router.get("/profitairline", BookingController.profitableairline);// avg flight cost



;

module.exports = router;
