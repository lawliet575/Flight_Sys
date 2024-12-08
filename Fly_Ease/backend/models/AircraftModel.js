const oracledb = require("oracledb");

// Create a new aircraft
async function createAircraft(modelno, a_capacity, airlineID) {
  const query = `INSERT INTO AIRCRAFTS (MODELNO, A_CAPACITY, AIRLINE_ID) 
                 VALUES (:modelno, :a_capacity, :airlineID)`;

  const binds = {
    modelno,
    a_capacity,
    airlineID,
  };

  let connection;
  try {
    connection = await oracledb.getConnection();
    await connection.execute(query, binds, { autoCommit: true });
  } catch (error) {
    console.error("Error inserting aircraft:", error);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

// Get all aircrafts
async function listAllAircrafts() {
  const query = "SELECT * FROM AIRCRAFTS";

  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(query);
    return result.rows; // Returns array of rows (aircrafts)
  } catch (error) {
    console.error("Error fetching aircrafts:", error);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

// Update aircraft details dynamically
async function updateAircraft(updatedData) {
  let conn;
  try {
    conn = await oracledb.getConnection();

    // Prepare fields and values based on updatedData
    let fieldsToUpdate = [];
    let values = { AIRCRAFT_ID: updatedData.id }; // Assume `id` is always provided for identifying the row

    // Dynamically add fields based on provided data
    if (updatedData.modelNo !== undefined) {
      fieldsToUpdate.push("MODELNO = :MODELNO");
      values.MODELNO = updatedData.modelNo;
    }
    if (updatedData.capacity !== undefined) {
      fieldsToUpdate.push("A_CAPACITY = :A_CAPACITY");
      values.A_CAPACITY = updatedData.capacity;
    }
    if (updatedData.airlineId !== undefined) {
      fieldsToUpdate.push("AIRLINE_ID = :AIRLINE_ID");
      values.AIRLINE_ID = updatedData.airlineId;
    }

    // Check if there are fields to update
    if (fieldsToUpdate.length === 0) {
      throw new Error("No fields provided to update");
    }

    // Construct the final SQL statement
    const sql = `UPDATE AIRCRAFTS SET ${fieldsToUpdate.join(", ")} WHERE AIRCRAFT_ID = :AIRCRAFT_ID`;

    console.log("Executing SQL:", sql);
    console.log("Values:", values);

    // Execute the query
    const result = await conn.execute(sql, values, { autoCommit: true });
    console.log(`${result.rowsAffected} row(s) updated successfully`);
    return result;
  } catch (err) {
    console.error("Update Error:", err);
    throw err;
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}


module.exports = {
  createAircraft,
  listAllAircrafts,
  updateAircraft,
};
