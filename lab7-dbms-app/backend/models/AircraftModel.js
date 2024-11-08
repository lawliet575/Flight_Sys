const oracledb = require("oracledb");

// Create the Aircraft model
async function createAircraft(aircraftID, modelno, a_capacity, airlineID) {
  const query = `INSERT INTO aircraft (aircraftID, modelno, a_capacity, airlineID) 
                 VALUES (:aircraftID, :modelno, :a_capacity, :airlineID)`;

  const binds = {
    aircraftID,
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
  const query = "SELECT * FROM aircraft";

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
async function updateAircraft(id, data) {
  let query = `UPDATE AIRCRAFT SET `;
  const binds = { id };
  const updates = [];

  // Build query parts for provided fields only
  if (data.modelNo !== undefined) {
    updates.push(`modelno = :modelNo`);
    binds.modelNo = data.modelNo;
  }
  if (data.capacity !== undefined) {
    updates.push(`a_capacity = :capacity`);
    binds.capacity = data.capacity;
  }
  if (data.airlineId !== undefined) {
    updates.push(`airlineID = :airlineId`);
    binds.airlineId = data.airlineId;
  }

  // If no fields provided, return early
  if (updates.length === 0) {
    throw new Error("No fields provided for update");
  }

  // Join the update fields and finalize the query
  query += updates.join(", ") + ` WHERE AIRCRAFTID = :id`;

  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(query, binds, { autoCommit: true });
    return result.rowsAffected;
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
