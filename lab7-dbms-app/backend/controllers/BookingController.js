// bookingController.js

const {
  listAllBookings,
  newBooking,
  updateBookingByID,
  deleteBookingByID
} = require('../models/BookingModels');

// Get all bookings
async function getAllBookings(req, res) {
  try {
    const bookings = await listAllBookings();
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ message: "Error fetching bookings", error: err.message });
  }
}

// Add a new booking
async function addBooking(req, res) {
  try {
    await newBooking(req.body); // Pass the entire request body to the newBooking function
    res.status(201).json({ message: "Booking added successfully" });
  } catch (err) {
    console.error("Error adding booking:", err);
    res.status(500).json({ message: "Error adding booking", error: err });
  }
}

// Update an existing booking by ID
async function updateBooking(req, res) {
  try {
    const updatedData = req.body;
    console.log(updatedData);

    const result = await updateBookingByID(updatedData);

    if (result.rowsAffected > 0) {
      res.json({ message: "Booking updated successfully" });
    } else {
      res.status(404).json({ message: "Booking not found" });
    }
  } catch (err) {
    console.error("Error updating booking:", err);
    res.status(500).json({ message: "Error updating booking", error: err });
  }
}


// Delete a booking by ID
async function deleteBooking(req, res) {
  const { BookingID } = req.body;

  if (!BookingID) {
    return res.status(400).json({ message: "Booking ID is required" });
  }

  try {
    const result = await deleteBookingByID(BookingID);
    if (result > 0) {
      res.json({ message: "Booking deleted successfully" });
    } else {
      res.status(404).json({ message: "Booking not found" });
    }
  } catch (err) {
    console.error("Error deleting booking:", err);
    res.status(500).json({ message: "Error deleting booking", error: err.message });
  }
}

module.exports = {
  getAllBookings,
  addBooking,
  updateBooking,
  deleteBooking
};
