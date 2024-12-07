// bookingController.js

const {
  listAllBookings,
  newBooking,
  updateBookingByID,
  deleteBookingByID,
  getBookingByIdFromDB,
  calculateprice
} = require('../models/BookingModels');


async function getprice(req, res) {
  try {
    const { flightId, classId } = req.params; // If using route parameters
    // const { flightId, classId } = req.query; // Use this if using query parameters
    // Pass the flightId and classId to the calculateprice function
    const price = await calculateprice(flightId, classId);

    res.json({ flightId, classId, price });
  } catch (err) {
    console.error("Error calculating price:", err);
    res.status(500).json({ message: "Error calculating price", error: err.message });
  }
}

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

async function getBookingById(req, res) {
  const { id } = req.params; // Get the booking ID from the URL parameters

  try {
    const booking = await getBookingByIdFromDB(id); // Fetch the booking by ID from the model

    if (booking) {
      res.json({ data: booking });
    } else {
      res.status(404).json({ message: "Booking not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error fetching booking details", error: err.message });
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
    const BookingID = req.params.id;  // Get the booking ID from the URL
    const updatedData = req.body;     // Get the updated data from the request body

    console.log("Booking ID:", BookingID);
    console.log("Updated Data:", updatedData);

    // Pass BookingID and updated data to the model
    const result = await updateBookingByID(BookingID, updatedData);

    if (result.rowsAffected > 0) {
      res.json({ message: "Booking updated successfully" });
    } else {
      res.status(404).json({ message: "Booking not found" });
    }
  } catch (err) {
    console.error("Error updating booking:", err);
    res.status(500).json({ message: "Error updating booking", error: err.message });
  }
}




// Delete a booking by ID
async function deleteBooking(req, res) {
  const { id } = req.params; // Get the booking ID from the URL parameters

  try {
    const result = await deleteBookingByID(id); // Call the model function to delete the booking by ID

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
  getprice,
  getAllBookings,
  getBookingById,
  addBooking,
  updateBooking,
  deleteBooking
};
