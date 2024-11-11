const oracledb = require("oracledb");

async function getAllFlightClasses() {
  const query = `SELECT * FROM flight_class`;
  let connection;

  try {
    connection = await oracledb.getConnection();
    
    const result = await connection.execute(query, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    return result.rows;
  } catch (error) {
    console.error("Error fetching flight classes:", error);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

async function addFlightClass(data) {
  const { Class_Description, BaggageAllowed } = data;
  const query = `INSERT INTO flight_class (Class_Description, BaggageAllowed) VALUES (:ID, :Class_Description, :BaggageAllowed)`;

  const binds = {
    Class_Description,
    BaggageAllowed,
  };

  let connection;
  try {
    connection = await oracledb.getConnection();
    await connection.execute(query, binds, { autoCommit: true });
    return ID; // Return the ID as confirmation of the added flight class
  } catch (error) {
    console.error("Error adding flight class:", error);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

module.exports = {
  getAllFlightClasses,
  addFlightClass
};
