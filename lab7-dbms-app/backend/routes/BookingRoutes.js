const express = require("express");
const router = express.Router();
const BookingController = require("../controllers/BookingController");

// Route to get all bookings
router.get("/bookings", BookingController.getAllBookings);

// Route to add a new booking
router.post("/bookings", BookingController.addBooking);

// Route to update a booking by ID
router.put("/bookings", BookingController.updateBooking);

// Route to delete a booking by ID
router.delete("/bookings/:id", BookingController.deleteBooking);  // Delete route

module.exports = router;
