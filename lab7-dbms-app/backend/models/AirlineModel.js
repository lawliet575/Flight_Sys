const oracledb = require("oracledb");

// Create the Airline model
async function createAirline(airlineName, foundingDate, scope) {
  const query = `INSERT INTO airline (airline_name, founding_date, scope) 
                 VALUES (:airlineName, :foundingDate, :scope)`;

  const binds = {
    airlineName,
    foundingDate,
    scope
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

// Get all airlines
async function listAllAirlines() {
  const query = "SELECT * FROM airline";

  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(query);
    return result.rows; // Returns array of rows (airlines)
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

// Get airline by ID
async function findAirlineById(airlineId) {
  const query = `SELECT * FROM airline WHERE airline_id = :airlineId`;

  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(query, [airlineId]);
    return result.rows[0]; // Returns the airline object
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

// Update airline details
async function updateAirline(airlineId, airlineName, foundingDate, scope) {
  const query = `UPDATE airline 
                 SET airline_name = :airlineName, founding_date = :foundingDate, scope = :scope
                 WHERE airline_id = :airlineId`;

  const binds = {
    airlineId,
    airlineName,
    foundingDate,
    scope
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

// Delete airline by ID
async function deleteAirline(airlineId) {
  const query = `DELETE FROM airline WHERE airline_id = :airlineId`;

  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(query, [airlineId], { autoCommit: true });
    return result.rowsAffected; // Returns number of affected rows
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

module.exports = {
  createAirline,
  listAllAirlines,
  findAirlineById,
  updateAirline,
  deleteAirline
};
