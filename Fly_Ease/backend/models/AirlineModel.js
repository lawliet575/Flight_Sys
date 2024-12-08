const oracledb = require("oracledb");

// Create a new airline
async function createAirline(airlineName, foundingDate, scope) {
  const query = `INSERT INTO AIRLINES (AIRLINE_NAME, FOUNDING_DATE, A_SCOPE) VALUES (:airlineName, :foundingDate, :scope)`;
  const binds = { airlineName, foundingDate, scope };
  let connection;
  try {
    connection = await oracledb.getConnection();
    await connection.execute(query, binds, { autoCommit: true });
  } finally {
    if (connection) await connection.close();
  }
}

// List all airlines
async function listAllAirlines() {
  const query = `SELECT * FROM AIRLINES`;
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(query);
    return result.rows;
  } finally {
    if (connection) await connection.close();
  }
}

// Find an airline by ID
async function findAirlineById(id) {
  const query = `SELECT * FROM AIRLINES WHERE AIRLINE_ID = :id`;
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(query, [id]);
    return result.rows[0]; // Returns the first row, if found
  } finally {
    if (connection) await connection.close();
  }
}

// Update airline details dynamically
async function updateAirline(id, data) {
  let query = `UPDATE AIRLINES SET `;
  const binds = { AIRLINE_ID: id };
  const updates = [];

  // Dynamically add fields to update
  if (data.AIRLINE_NAME !== undefined) {
    updates.push(`AIRLINE_NAME = :AIRLINE_NAME`);
    binds.AIRLINE_NAME = data.AIRLINE_NAME;
  }
  if (data.FOUNDING_DATE !== undefined) {
    updates.push(`FOUNDING_DATE = :FOUNDING_DATE`);
    binds.FOUNDING_DATE = data.FOUNDING_DATE;
  }
  if (data.A_SCOPE !== undefined) {
    updates.push(`A_SCOPE = :A_SCOPE`);
    binds.A_SCOPE = data.A_SCOPE;
  }

  if (updates.length === 0) {
    throw new Error("No fields provided for update");
  }

  query += updates.join(", ") + ` WHERE AIRLINE_ID = :AIRLINE_ID`;

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
  createAirline,
  listAllAirlines,
  findAirlineById,
  updateAirline
};
