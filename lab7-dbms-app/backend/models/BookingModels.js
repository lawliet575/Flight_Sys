// bookingModel.js

const oracledb = require('oracledb');

// List all bookings
async function listAllBookings() {
  let query = `SELECT * FROM Bookings`;
  let connection;

  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(query);
    return result.rows;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

// Add a new booking
async function newBooking(data) {
  const { BookingID, PassengerID, FlightID, ClassID, BookingDate, SeatNo, TotalPrice } = data;

  let query = `INSERT INTO Bookings (BookingID, PassengerID, FlightID, f_ClassID, BookingDate, SeatNo, TotalPrice) 
               VALUES (:BookingID, :PassengerID, :FlightID, :ClassID, :BookingDate, :SeatNo, :TotalPrice)`;
  
  const binds = {
    BookingID,
    PassengerID,
    FlightID,
    ClassID,
    BookingDate,
    SeatNo,
    TotalPrice
  };

  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(query, binds, { autoCommit: true });
    return result.rowsAffected ? BookingID : null; // Return the new BookingID if the insert was successful
  } catch (error) {
    console.error("Error adding booking:", error);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

// Update an existing booking by ID
async function updateBookingByID(BookingID, data) {
  let query = `UPDATE Bookings SET `;
  const binds = { BookingID };
  const updates = [];

  // Build query parts for provided fields only
  if (data.PassengerID !== undefined) {
    updates.push(`PassengerID = :PassengerID`);
    binds.PassengerID = data.PassengerID;
  }
  if (data.FlightID !== undefined) {
    updates.push(`FlightID = :FlightID`);
    binds.FlightID = data.FlightID;
  }
  if (data.ClassID !== undefined) {
    updates.push(`f_ClassID = :ClassID`);
    binds.ClassID = data.ClassID;
  }
  if (data.BookingDate !== undefined) {
    updates.push(`BookingDate = :BookingDate`);
    binds.BookingDate = data.BookingDate;
  }
  if (data.SeatNo !== undefined) {
    updates.push(`SeatNo = :SeatNo`);
    binds.SeatNo = data.SeatNo;
  }
  if (data.TotalPrice !== undefined) {
    updates.push(`TotalPrice = :TotalPrice`);
    binds.TotalPrice = data.TotalPrice;
  }

  if (updates.length === 0) {
    throw new Error("No fields provided for update");
  }

  query += updates.join(", ") + ` WHERE BookingID = :BookingID`;

  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(query, binds, { autoCommit: true });
    return result.rowsAffected; // Returns the number of affected rows
  } catch (error) {
    console.error("Error updating booking:", error);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

// Delete a booking by ID
async function deleteBookingByID(BookingID) {
  const query = `DELETE FROM Bookings WHERE BookingID = :BookingID`;
  const binds = { BookingID };

  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(query, binds, { autoCommit: true });
    return result.rowsAffected; // Returns the number of affected rows
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw error;
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
