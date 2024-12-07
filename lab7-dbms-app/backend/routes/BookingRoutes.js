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
;

module.exports = router;
