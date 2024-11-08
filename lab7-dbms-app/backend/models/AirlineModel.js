const oracledb = require("oracledb");

async function createAirline(airlineName, foundingDate, scope) {
  const query = `INSERT INTO Airline (AirlineName, FoundingDate, Scope) VALUES (:airlineName, :foundingDate, :scope)`;
  const binds = { airlineName, foundingDate, scope };
  let connection;
  try {
    connection = await oracledb.getConnection();
    await connection.execute(query, binds, { autoCommit: true });
  } finally {
    if (connection) await connection.close();
  }
}

async function listAllAirlines() {
  const query = `SELECT * FROM Airline`;
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(query);
    return result.rows;
  } finally {
    if (connection) await connection.close();
  }
}

async function findAirlineById(id) {
  const query = `SELECT * FROM Airline WHERE AirlineID = :id`;
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(query, [id]);
    return result.rows[0];
  } finally {
    if (connection) await connection.close();
  }
}

async function updateAirline(id, airlineName, foundingDate, scope) {
  const query = `
    UPDATE Airline
    SET AirlineName = :airlineName, FoundingDate = :foundingDate, Scope = :scope
    WHERE AirlineID = :id
  `;
  const binds = { id, airlineName, foundingDate, scope };
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(query, binds, { autoCommit: true });
    return result.rowsAffected;
  } finally {
    if (connection) await connection.close();
  }
}

async function deleteAirline(id) {
  const query = `DELETE FROM Airline WHERE AirlineID = :id`;
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(query, [id], { autoCommit: true });
    return result.rowsAffected;
  } finally {
    if (connection) await connection.close();
  }
}

module.exports = {
  createAirline,
  listAllAirlines,
  findAirlineById,
  updateAirline,
  deleteAirline
};
