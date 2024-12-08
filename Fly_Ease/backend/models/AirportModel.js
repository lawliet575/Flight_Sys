const oracledb = require("oracledb");

// Create a new airport
async function createAirport(airportName, city) {
  const query = `INSERT INTO AIRPORTS (AIRPORT_NAME, CITY) VALUES (:airportName, :city)`;
  const binds = { airportName, city };
  let connection;
  try {
    connection = await oracledb.getConnection();
    await connection.execute(query, binds, { autoCommit: true });
  } finally {
    if (connection) await connection.close();
  }
}

// List all airports
async function listAllAirports() {
  const query = `SELECT * FROM AIRPORTS`;
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(query);
    return result.rows;
  } finally {
    if (connection) await connection.close();
  }
}

// Find an airport by ID
async function findAirportById(id) {
  const query = `SELECT * FROM AIRPORTS WHERE AIRPORT_ID = :id`;
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(query, [id]);
    return result.rows[0]; // Returns the first row, if found
  } finally {
    if (connection) await connection.close();
  }
}

// Update airport details dynamically
async function updateAirport(id, data) {
  let query = `UPDATE AIRPORTS SET `;
  const binds = { AIRPORT_ID: id };
  const updates = [];

  // Dynamically add fields to update
  if (data.AIRPORT_NAME !== undefined) {
    updates.push(`AIRPORT_NAME = :AIRPORT_NAME`);
    binds.AIRPORT_NAME = data.AIRPORT_NAME;
  }
  if (data.CITY !== undefined) {
    updates.push(`CITY = :CITY`);
    binds.CITY = data.CITY;
  }

  if (updates.length === 0) {
    throw new Error("No fields provided for update");
  }

  query += updates.join(", ") + ` WHERE AIRPORT_ID = :AIRPORT_ID`;

  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(query, binds, { autoCommit: true });
    return result.rowsAffected; // Returns the number of affected rows
  } finally {
    if (connection) await connection.close();
  }
}

module.exports = {
  createAirport,
  listAllAirports,
  findAirportById,
  updateAirport
};
