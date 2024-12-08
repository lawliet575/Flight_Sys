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
  let conn;
  try {
    conn = await oracledb.getConnection();
    console.log(data);

    await conn.execute(
      `INSERT INTO FLIGHT_CLASS (CLASS_DESCRIPTION, BAGGAGE_ALLOWED) 
      VALUES (:CLASS_DESCRIPTION, :BAGGAGE_ALLOWED)`,
      { 
        CLASS_DESCRIPTION: data.Class_Description,
        BAGGAGE_ALLOWED: data.BaggageAllowed
      },
      { autoCommit: true }
    );
    console.log('Flight class added successfully');
  } catch (err) {
    console.error('Error adding flight class:', err);
    throw err;
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}


module.exports = {
  getAllFlightClasses,
  addFlightClass
};
