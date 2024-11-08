const express = require("express");
const router = express.Router();
const BookingController = require("../controllers/BookingController");

// Route to create a new booking
router.post("/bookings", BookingController.addBooking);

// Route to get all bookings
router.get("/bookings", BookingController.getAllBookings);

// Route to update a booking by ID
router.put("/bookings/:id", BookingController.updateBooking);

// Route to delete a booking by ID
router.delete("/bookings/:id", BookingController.deleteBooking);

module.exports = router;
