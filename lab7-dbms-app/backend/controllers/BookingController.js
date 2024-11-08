const {
    listAllBookings,
    newBooking,
    updateBookingByID,
    deleteBookingByID  // Import the delete function from the model
  } = require("../models/BookingModel");
  
  /**
   * Get all bookings
   * @param req - Request object
   * @param res - Response object
   */
  async function getAllBookings(req, res) {
    try {
      const bookings = await listAllBookings();
      res.json({ data: bookings });
    } catch (err) {
      res.status(500).json({ message: "Error fetching bookings", error: err });
    }
  }
  
  /**
   * Add a new booking
   * @param req - Request object
   * @param res - Response object
   */
  async function addBooking(req, res) {
    try {
      await newBooking(req.body);
      res.status(201).json({ message: "Booking added successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error adding booking", error: err });
    }
  }
  
  /**
   * Update a booking by ID
   * @param req - Request object
   * @param res - Response object
   */
  async function updateBooking(req, res) {
    try {
      const updatedData = req.body;
      const result = await updateBookingByID(updatedData);
  
      if (result.rowsAffected > 0) {
        res.json({ message: "Booking updated successfully" });
      } else {
        res.status(404).json({ message: "Booking not found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Error updating booking", error: err });
    }
  }
  
  /**
   * Delete a booking by ID
   * @param req - Request object
   * @param res - Response object
   */
  async function deleteBooking(req, res) {
    try {
      const bookingID = req.params.id;
      const result = await deleteBookingByID(bookingID);
  
      if (result.rowsAffected > 0) {
        res.json({ message: "Booking deleted successfully" });
      } else {
        res.status(404).json({ message: "Booking not found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Error deleting booking", error: err });
    }
  }
  
  module.exports = {
    getAllBookings,
    addBooking,
    updateBooking,
    deleteBooking  // Export the delete functio
    
  };
  