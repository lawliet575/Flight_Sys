const oracledb = require("oracledb");

// Create the Aircraft model
async function createAircraft(modelno, a_capacity, airlineID) {
  const query = `INSERT INTO AIRCRAFTS (MODELNO, A_CAPACITY, AIRLINE_ID) 
                 VALUES (:modelno, :a_capacity, :airlineID)`;

  const binds = {
    modelno,
    a_capacity,
    airlineID
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
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}



// Update aircraft details
async function updateAircraft(aircraftID, data) {
  let query = `UPDATE AIRCRAFTS SET `;
  const binds = { aircraftID };
  const updates = [];

  // Build query parts for provided fields only
  if (data.modelno !== undefined) {
    updates.push(`MODELNO = :modelno`);
    binds.modelno = data.modelno;
  }
  if (data.a_capacity !== undefined) {
    updates.push(`A_CAPACITY = :a_capacity`);
    binds.a_capacity = data.a_capacity;
  }
  if (data.airlineID !== undefined) {
    updates.push(`AIRLINE_ID = :airlineID`);
    binds.airlineID = data.airlineID;
  }

  // If no fields provided, return early
  if (updates.length === 0) {
    throw new Error("No fields provided for update");
  }

  // Join the update fields and finalize the query
  query += updates.join(", ") + ` WHERE AIRCRAFT_ID = :aircraftID`;

  console.log("Query:", query);  // Optional: Log the query to check for correctness
  console.log("Binds:", binds);  // Optional: Log the bind parameters

  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(query, binds, { autoCommit: true });
    return result.rowsAffected; // Returns the number of affected rows
  } catch (error) {
    console.error("Error updating aircraft:", error);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}




module.exports = {
  createAircraft,
  listAllAircrafts,
  updateAircraft
};
