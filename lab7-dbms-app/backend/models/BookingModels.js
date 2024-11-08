const oracledb = require("oracledb");

// Function to list all bookings
async function listAllBookings() {
  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(`SELECT * FROM booking`);
    return result.rows;
  } catch (err) {
    throw err;
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

// Function to create a new booking
async function newBooking(bookingData) {
  let conn;
  try {
    conn = await oracledb.getConnection();
    await conn.execute(
      `INSERT INTO booking (BookingID, PassengerID, FlightID, BookingDate, SeatNumber, Class, Status) 
       VALUES (:BookingID, :PassengerID, :FlightID, :BookingDate, :SeatNumber, :Class, :Status)`,
      {
        BookingID: bookingData.bookingID,
        PassengerID: bookingData.passengerID,
        FlightID: bookingData.flightID,
        BookingDate: bookingData.bookingDate,
        SeatNumber: bookingData.seatNumber,
        Class: bookingData.class,
        Status: bookingData.status
      },
      { autoCommit: true }
    );
  } catch (err) {
    throw err;
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

// Function to update an existing booking by ID
async function updateBookingByID(updatedData) {
  let conn;
  try {
    conn = await oracledb.getConnection();

    let fieldsToUpdate = [];
    let values = { BookingID: updatedData.bookingID };

    if (updatedData.passengerID) {
      fieldsToUpdate.push("PassengerID = :passengerID");
      values.passengerID = updatedData.passengerID;
    }
    if (updatedData.flightID) {
      fieldsToUpdate.push("FlightID = :flightID");
      values.flightID = updatedData.flightID;
    }
    if (updatedData.bookingDate) {
      fieldsToUpdate.push("BookingDate = :bookingDate");
      values.bookingDate = updatedData.bookingDate;
    }
    if (updatedData.seatNumber) {
      fieldsToUpdate.push("SeatNumber = :seatNumber");
      values.seatNumber = updatedData.seatNumber;
    }
    if (updatedData.class) {
      fieldsToUpdate.push("Class = :class");
      values.class = updatedData.class;
    }
    if (updatedData.status) {
      fieldsToUpdate.push("Status = :status");
      values.status = updatedData.status;
    }

    // If no fields to update, return
    if (fieldsToUpdate.length === 0) {
      throw new Error("No fields provided to update");
    }

    const sql = `UPDATE booking SET ${fieldsToUpdate.join(", ")} WHERE BookingID = :BookingID`;
    const result = await conn.execute(sql, values, { autoCommit: true });
    return result;
  } catch (err) {
    throw err;
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

// Function to delete a booking by its ID
async function deleteBookingByID(bookingID) {
  const query = `DELETE FROM bookings WHERE booking_id = :bookingID`;
  let connection;

  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(query, { bookingID }, { autoCommit: true });
    return result;
  } catch (err) {
    throw new Error(`Failed to delete booking with ID ${bookingID}: ${err.message}`);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}



module.exports = {
  listAllBookings,
  newBooking,
  updateBookingByID,
  deleteBookingByID

};
