// bookingModel.js

const oracledb = require('oracledb');

// List all bookings
async function listAllBookings() {
  let query = `SELECT * FROM BOOKINGS`;
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
  let conn;
  try {
    conn = await oracledb.getConnection();
    console.log(data);

    await conn.execute(
      `INSERT INTO BOOKINGS (PASSENGER_ID, FLIGHT_ID, f_ClassID, BOOKING_DATE, SEAT_NO, TOTAL_PRICE) 
      VALUES (:PASSENGER_ID, :FLIGHT_ID, :f_ClassID, :BOOKING_DATE, :SEAT_NO, :TOTAL_PRICE)`,
      { 
        PASSENGER_ID: data.PassengerID,
        FLIGHT_ID: data.FlightID,
        f_ClassID: data.ClassID,
        BOOKING_DATE: new Date(data.BookingDate), // Convert to Date if necessary
        SEAT_NO: data.SeatNo,
        TOTAL_PRICE: data.TotalPrice
      },
      { autoCommit: true }
    );
    console.log('Booking added successfully');
  } catch (err) {
    console.error('Error adding booking:', err);
    throw err;
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

// Update an existing booking by ID
async function updateBookingByID(BookingID, data) {
  let query = `UPDATE BOOKINGS SET `;
  const binds = { BookingID };
  const updates = [];

  // Dynamically add fields to update based on provided data
  if (data.PassengerID !== undefined) {
    updates.push(`PASSENGER_ID = :PassengerID`);
    binds.PassengerID = data.PassengerID;
  }
  if (data.FlightID !== undefined) {
    updates.push(`FLIGHT_ID = :FlightID`);
    binds.FlightID = data.FlightID;
  }
  if (data.ClassID !== undefined) {
    updates.push(`F_CLASSID = :ClassID`);
    binds.ClassID = data.ClassID;
  }
  if (data.BookingDate !== undefined) {
    updates.push(`BOOKING_DATE = :BookingDate`);
    binds.BookingDate = new Date(data.BookingDate); // Ensure it's a valid Date object
  }
  if (data.SeatNo !== undefined) {
    updates.push(`SEAT_NO = :SeatNo`);
    binds.SeatNo = data.SeatNo;
  }
  if (data.TotalPrice !== undefined) {
    updates.push(`TOTAL_PRICE = :TotalPrice`);
    binds.TotalPrice = parseFloat(data.TotalPrice); // Ensure it's a valid number
  }

  if (updates.length === 0) {
    throw new Error("No fields provided for update");
  }

  query += updates.join(", ") + ` WHERE BOOKING_ID = :BookingID`;

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
  const query = `DELETE FROM BOOKINGS WHERE BOOKING_ID = :BookingID`;
  const binds = { BookingID };

  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(query, binds, { autoCommit: true });

    // Return the number of rows affected (should be 1 if successfully deleted)
    return result.rowsAffected; 
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw error; // Re-throw error after logging
  } finally {
    if (connection) {
      await connection.close(); // Ensure connection is closed
    }
  }
}


module.exports = {
  listAllBookings,
  newBooking,
  updateBookingByID,
  deleteBookingByID
};
