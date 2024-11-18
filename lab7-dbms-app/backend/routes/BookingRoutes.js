const express = require("express");
const router = express.Router();
const BookingController = require("../controllers/BookingController");

// Route to create a new booking
router.get("/bookings", BookingController.getAllBookings);
router.get('/bookings/:id', BookingController.getBookingById);

// Route to add a new booking
router.post("/bookings", BookingController.addBooking);

// Route to update a booking
router.put('/bookings/:id', BookingController.updateBooking);


// Route to delete a booking (ID in body)
router.delete('/bookings/:id', BookingController.deleteBooking);

module.exports = router;
