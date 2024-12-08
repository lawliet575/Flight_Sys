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

async function getBookingByIdFromDB(id) {
  const query = `SELECT * FROM BOOKINGS WHERE BOOKING_ID = :id`; // Query to select a specific booking by ID
  let connection;

  try {
    connection = await oracledb.getConnection(); // Get a connection from the pool
    const result = await connection.execute(query, [id]); // Execute query with bind variable :id

    if (result.rows.length === 0) {
      return null; // No booking found, return null
    }

    return result.rows[0]; // Return the first matching booking
  } catch (err) {
    console.error('Error fetching booking:', err);
    throw err; // Throw error to be caught in the controller
  } finally {
    if (connection) {
      await connection.close(); // Always close the connection
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
      `INSERT INTO BOOKINGS (PASSENGER_ID, FLIGHT_ID, f_ClassID, BOOKING_DATE, SEAT_NO) 
      VALUES (:PASSENGER_ID, :FLIGHT_ID, :f_ClassID, :BOOKING_DATE, :SEAT_NO)`,
      { 
        PASSENGER_ID: data.PassengerID,
        FLIGHT_ID: data.FlightID,
        f_ClassID: data.ClassID,
        BOOKING_DATE: new Date(data.BookingDate), // Convert to Date if necessary
        SEAT_NO: data.SeatNo,
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
async function updateBookingByID(BookingID, updatedData) {
  let conn;
  try {
    // Log the updatedData to see if it's coming through correctly
    console.log("Updated Data:", updatedData);

    conn = await oracledb.getConnection(); // Get a connection from the pool

    // Prepare fields to be updated
    let fieldsToUpdate = [];
    let values = { BookingID }; // Use BookingID directly

    // Dynamically add fields based on provided data
    if (updatedData.PassengerID !== undefined) {
      fieldsToUpdate.push("PASSENGER_ID = :PassengerID");
      values.PassengerID = updatedData.PassengerID;
    }
    if (updatedData.FlightID !== undefined) {
      fieldsToUpdate.push("FLIGHT_ID = :FlightID");
      values.FlightID = updatedData.FlightID;
    }
    if (updatedData.ClassID !== undefined) {
      fieldsToUpdate.push("F_CLASSID = :F_ClassID");
      values.F_ClassID = updatedData.ClassID;  // Match the column name 'F_CLASSID'
    }
    if (updatedData.BookingDate !== undefined) {
      fieldsToUpdate.push("BOOKING_DATE = :BookingDate");
      values.BookingDate = new Date(updatedData.BookingDate); // Ensure it's a valid Date object
    }
    if (updatedData.SeatNo !== undefined) {
      fieldsToUpdate.push("SEAT_NO = :SeatNo");
      values.SeatNo = updatedData.SeatNo;
    }
    if (updatedData.TotalPrice !== undefined) {
      fieldsToUpdate.push("TOTAL_PRICE = :TotalPrice");
      values.TotalPrice = parseFloat(updatedData.TotalPrice); // Ensure it's a valid number
    }

    // Check if there are fields to update
    if (fieldsToUpdate.length === 0) {
      throw new Error("No fields provided for update");
    }

    // Construct the final SQL statement
    const sql = `UPDATE BOOKINGS SET ${fieldsToUpdate.join(", ")} WHERE BOOKING_ID = :BookingID`;

    console.log("Executing SQL:", sql);
    console.log("Values:", values);

    // Execute the query
    const result = await conn.execute(sql, values, { autoCommit: true });
    return result;  // Returns the result of the update operation
  } catch (err) {
    console.error("Update Error:", err);
    throw err;
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}



// Delete a booking by ID
async function deleteBookingByID(BookingID) {
  const query = `DELETE FROM BOOKINGS WHERE BOOKING_ID = :BookingID`; // Query to delete a booking by ID
  let connection;

  try {
    connection = await oracledb.getConnection(); // Get a connection from the pool
    const result = await connection.execute(query, [BookingID], { autoCommit: true }); // Execute query with bind variable and commit

    // Return true if at least one row was deleted
    return result.rowsAffected > 0; 
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw error; // Re-throw the error after logging
  } finally {
    if (connection) {
      await connection.close(); // Ensure connection is closed
    }
  }
}


async function calculateprice(flightId, classId) {
  const query = `SELECT CALCULATE_PRICE(:flightId, :classId) AS PRICE FROM dual`;
  let connection;

  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(query, { flightId, classId });
    return result; // Return the full result object directly
  } catch (error) {
    console.error("Error calculating price:", error);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}




module.exports = {
  listAllBookings,
  getBookingByIdFromDB,
  newBooking,
  updateBookingByID,
  deleteBookingByID,
  calculateprice
};
