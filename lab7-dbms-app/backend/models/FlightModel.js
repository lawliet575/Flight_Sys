const oracledb = require("oracledb");

async function listAllFlights() {
  let conn;
  try {
    conn = await oracledb.getConnection();
    console.log(conn.clientId);
    const result = await conn.execute(`SELECT * FROM flights`);
    console.log(result.rows);    
    return result.rows;
  } catch (err) {
    throw err;
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

async function getFlightByIdFromDB(id) {
  const query = `SELECT * FROM FLIGHTS WHERE FLIGHT_ID = :id`; // Query to select a specific flight by ID
  let connection;

  try {
    connection = await oracledb.getConnection(); // Get a connection from the pool
    const result = await connection.execute(query, [id]); // Execute query with bind variable :id

    if (result.rows.length === 0) {
      return null; // No flight found, return null
    }

    return result.rows[0]; // Return the first matching flight
  } catch (err) {
    console.error('Error fetching flight:', err);
    throw err; // Throw error to be caught in the controller
  } finally {
    if (connection) {
      await connection.close(); // Always close the connection
    }
  }
}


async function deleteFlightByIdFromDB(id) {
  const query = `DELETE FROM FLIGHTS WHERE FLIGHT_ID = :id`; // Query to delete a flight by ID
  let connection;

  try {
    connection = await oracledb.getConnection(); // Get a connection from the pool
    const result = await connection.execute(query, [id], { autoCommit: true }); // Execute query with bind variable and commit

    return result.rowsAffected > 0; // Return true if at least one row was deleted
  } catch (err) {
    console.error('Error deleting flight:', err);
    throw err; // Throw error to be caught in the controller
  } finally {
    if (connection) {
      await connection.close(); // Always close the connection
    }
  }
}

async function newFlight(flightData) {
  let conn;
  try {
    conn = await oracledb.getConnection();
    console.log(flightData);

    await conn.execute(
      `INSERT INTO FLIGHTS (DEP_AIRPORT_ID, DEPARTURE_DATE, DEPARTURE_TIME, ARR_AIRPORT_ID, ARRIVAL_DATE, ARRIVAL_TIME, AIRCRAFT_ID) 
      VALUES (:DEP_AIRPORT_ID, :DEPARTURE_DATE, :DEPARTURE_TIME, :ARR_AIRPORT_ID, :ARRIVAL_DATE, :ARRIVAL_TIME, :AIRCRAFT_ID)`,
      { 
        DEP_AIRPORT_ID: flightData.dep_airport_id,
        DEPARTURE_DATE: new Date(flightData.dep_date), // Convert to Date if necessary
        DEPARTURE_TIME: flightData.dep_time, 
        ARR_AIRPORT_ID: flightData.arr_airport_id, 
        ARRIVAL_DATE: new Date(flightData.arr_date), // Convert to Date if necessary
        ARRIVAL_TIME: flightData.arr_time, 
        AIRCRAFT_ID: flightData.aircraft_id
      },
      { autoCommit: true }
    );
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}



async function updateFlightByID(flightId, updatedData) {
  let conn;
  try {
    conn = await oracledb.getConnection();

    // Prepare fields and values based on updatedData
    let fieldsToUpdate = [];
    let values = { FlightID: flightId };  // Use flightId directly

    // Dynamically add fields based on provided data
    if (updatedData.dep_airport_id !== undefined) {
      fieldsToUpdate.push("DEP_AIRPORT_ID = :dep_airport_id");
      values.dep_airport_id = updatedData.dep_airport_id;
    }
    if (updatedData.dep_date !== undefined) {
      fieldsToUpdate.push("DEPARTURE_DATE = :dep_date");
      values.dep_date = new Date(updatedData.dep_date); // Ensure it's a Date object
    }
    if (updatedData.dep_time !== undefined) {
      fieldsToUpdate.push("DEPARTURE_TIME = :dep_time");
      values.dep_time = updatedData.dep_time;
    }
    if (updatedData.arr_airport_id !== undefined) {
      fieldsToUpdate.push("ARR_AIRPORT_ID = :arr_airport_id");
      values.arr_airport_id = updatedData.arr_airport_id;
    }
    if (updatedData.arr_date !== undefined) {
      fieldsToUpdate.push("ARRIVAL_DATE = :arr_date");
      values.arr_date = new Date(updatedData.arr_date); // Ensure it's a Date object
    }
    if (updatedData.arr_time !== undefined) {
      fieldsToUpdate.push("ARRIVAL_TIME = :arr_time");
      values.arr_time = updatedData.arr_time;
    }
    if (updatedData.aircraft_id !== undefined) {
      fieldsToUpdate.push("AIRCRAFT_ID = :aircraft_id");
      values.aircraft_id = updatedData.aircraft_id;
    }

    // Check if there are fields to update
    if (fieldsToUpdate.length === 0) {
      throw new Error("No fields provided to update");
    }

    // Construct the final SQL statement
    const sql = `UPDATE FLIGHTS SET ${fieldsToUpdate.join(", ")} WHERE FLIGHT_ID = :FlightID`;

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

async function filterByDate(dep_date) {
  let conn;
  try {
    conn = await oracledb.getConnection();

    const query = `
      SELECT * FROM FLIGHTS
      WHERE DEPARTURE_DATE = TO_DATE(:dep_date, 'YYYY-MM-DD')
    `;

    const result = await conn.execute(query, { dep_date });
    return result.rows;
  } catch (error) {
    console.error("Error fetching flights by date:", error);
    throw error;
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}


async function filterByArrDep(depAirportId, arrAirportId) {
  let connection;
  try {
    connection = await oracledb.getConnection();

    const query = `
      SELECT * FROM FLIGHTS 
      WHERE DEP_AIRPORT_ID = :depAirportId AND ARR_AIRPORT_ID = :arrAirportId
    `;
    const result = await connection.execute(query, { depAirportId, arrAirportId });
    
    return result.rows;
  } catch (error) {
    console.error("Error fetching flights by airports:", error);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

async function filterByArrDep(depAirportName, arrAirportName) {
  let connection;
  try {
    connection = await oracledb.getConnection();

    const query = `
      SELECT f.* 
      FROM FLIGHTS f
      JOIN AIRPORTS dep ON f.DEP_AIRPORT_ID = dep.AIRPORT_ID
      JOIN AIRPORTS arr ON f.ARR_AIRPORT_ID = arr.AIRPORT_ID
      WHERE dep.AIRPORT_NAME = :depAirportName 
      AND arr.AIRPORT_NAME = :arrAirportName
    `;

    const result = await connection.execute(query, {
      depAirportName,
      arrAirportName
    });

    return result.rows;
  } catch (error) {
    console.error("Error fetching flights by airport names:", error);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

async function filterByDateArrDep(depDate, depAirportName, arrAirportName) {
  let connection;
  try {
    connection = await oracledb.getConnection();

    const query = `
      SELECT f.* 
      FROM FLIGHTS f
      JOIN AIRPORTS dep ON f.DEP_AIRPORT_ID = dep.AIRPORT_ID
      JOIN AIRPORTS arr ON f.ARR_AIRPORT_ID = arr.AIRPORT_ID
      WHERE f.DEPARTURE_DATE = TO_DATE(:depDate, 'YYYY-MM-DD')
      AND dep.AIRPORT_NAME = :depAirportName 
      AND arr.AIRPORT_NAME = :arrAirportName
    `;

    const result = await connection.execute(query, {
      depDate,
      depAirportName,
      arrAirportName
    });

    return result.rows;
  } catch (error) {
    console.error("Error fetching flights by date and airport names:", error);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}


module.exports = {
    listAllFlights,
    getFlightByIdFromDB,
    newFlight,
    updateFlightByID ,
    filterByDate,
    filterByArrDep,
    filterByDateArrDep,
    deleteFlightByIdFromDB
  };
  