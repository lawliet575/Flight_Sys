const oracledb = require("oracledb");

// Create the Aircraft model
async function createAircraft(modelNo, capacity, airlineId) {
  const query = `INSERT INTO aircraft (model_no, capacity, airline_id) 
                 VALUES (:modelNo, :capacity, :airlineId)`;

  const binds = {
    modelNo,
    capacity,
    airlineId
  };

  let connection;
  try {
    connection = await oracledb.getConnection();
    await connection.execute(query, binds, { autoCommit: true });
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

// Get aircraft by ID
async function findAircraftById(aircraftId) {
  const query = `SELECT * FROM aircraft WHERE aircraft_id = :aircraftId`;

  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(query, [aircraftId]);
    return result.rows[0]; // Returns the aircraft object
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

// Update aircraft details
async function updateAircraft(aircraftId, modelNo, capacity, airlineId) {
  const query = `UPDATE aircraft 
                 SET model_no = :modelNo, capacity = :capacity, airline_id = :airlineId
                 WHERE aircraft_id = :aircraftId`;

  const binds = {
    aircraftId,
    modelNo,
    capacity,
    airlineId
  };

  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(query, binds, { autoCommit: true });
    return result.rowsAffected; // Returns number of affected rows
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

// Delete aircraft by ID
async function deleteAircraft(aircraftId) {
  const query = `DELETE FROM aircraft WHERE aircraft_id = :aircraftId`;

  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(query, [aircraftId], { autoCommit: true });
    return result.rowsAffected; // Returns number of affected rows
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

module.exports = {
  createAircraft,
  listAllAircrafts,
  findAircraftById,
  updateAircraft,
  deleteAircraft
};
