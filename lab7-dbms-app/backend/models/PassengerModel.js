const oracledb = require("oracledb");

async function listAllPassengers() {
  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(`SELECT * FROM passengers`);
    return result.rows;
  } catch (err) {
    throw err;
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

async function getPassengerByIdFromDB(id) {
  const query = `SELECT * FROM PASSENGERS WHERE PASSENGER_ID = :id`; // Query to select a specific passenger by ID
  let connection;

  try {
      connection = await oracledb.getConnection(); // Get a connection from the pool
      const result = await connection.execute(query, [id]); // Execute query with bind variable :id

      if (result.rows.length === 0) {
          return null; // No passenger found, return null
      }

      return result.rows[0]; // Return the first matching passenger
  } catch (err) {
      console.error('Error fetching passenger:', err);
      throw err; // Throw error to be caught in the controller
  } finally {
      if (connection) {
          await connection.close(); // Always close the connection
      }
  }
}

async function newPassenger(passengerData) {
  let conn;
  try {
    conn = await oracledb.getConnection();
    await conn.execute(
      `INSERT INTO PASSENGERS 
        (PASSPORT_ID, FIRSTNAME, LASTNAME, EMAIL, CONTACT_NO, ADDRESS, GENDER, DATE_OF_BIRTH, LOGIN_ID, LOGIN_PW)
        VALUES 
        (:PASSPORT_ID, :FIRSTNAME, :LASTNAME, :EMAIL, :CONTACT_NO, :ADDRESS, :GENDER, :DATE_OF_BIRTH, :LOGIN_ID, :LOGIN_PW)`,
      {
        PASSPORT_ID: passengerData.passportId,
        FIRSTNAME: passengerData.firstName,
        LASTNAME: passengerData.lastName,
        EMAIL: passengerData.email,
        CONTACT_NO: passengerData.contact,
        ADDRESS: passengerData.address,
        GENDER: passengerData.gender,
        DATE_OF_BIRTH: new Date(passengerData.dob),
        LOGIN_ID: passengerData.loginid,
        LOGIN_PW: passengerData.loginpw,
      },
      { autoCommit: true }
    );
  } catch (err) {
    console.error("Error inserting passenger:", err);
    throw err;
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}


async function updatePassengerByID(passengerid, updatedData) {
  let conn;
  try {
    conn = await oracledb.getConnection();

    // Prepare fields and values based on updatedData
    let fieldsToUpdate = [];
    let values = { PASSENGER_ID: passengerid }; // Assume `id` is always provided for identifying the row

    // Dynamically add fields based on provided data
    if (updatedData.passportId !== undefined) {
      fieldsToUpdate.push("PASSPORT_ID = :PASSPORT_ID");
      values.PASSPORT_ID = updatedData.passportId;  // Updated to match the database field name
    }
    if (updatedData.firstName !== undefined) {
      fieldsToUpdate.push("FIRSTNAME = :FIRSTNAME");
      values.FIRSTNAME = updatedData.firstName;  // Updated to match the database field name
    }
    if (updatedData.lastName !== undefined) {
      fieldsToUpdate.push("LASTNAME = :LASTNAME");
      values.LASTNAME = updatedData.lastName;  // Updated to match the database field name
    }
    if (updatedData.email !== undefined) {
      fieldsToUpdate.push("EMAIL = :EMAIL");
      values.EMAIL = updatedData.email;  // Updated to match the database field name
    }
    if (updatedData.contact !== undefined) {
      fieldsToUpdate.push("CONTACT_NO = :CONTACT_NO");
      values.CONTACT_NO = updatedData.contact;  // Updated to match the database field name
    }
    if (updatedData.address !== undefined) {
      fieldsToUpdate.push("ADDRESS = :ADDRESS");
      values.ADDRESS = updatedData.address;  // Updated to match the database field name
    }
    if (updatedData.gender !== undefined) {
      fieldsToUpdate.push("GENDER = :GENDER");
      values.GENDER = updatedData.gender;  // Updated to match the database field name
    }
    if (updatedData.dob !== undefined) {
      fieldsToUpdate.push("DATE_OF_BIRTH = :DATE_OF_BIRTH");
      values.DATE_OF_BIRTH = new Date(updatedData.dob); // Ensure it's a Date object
    }

    if (updatedData.loginid !== undefined) {
      fieldsToUpdate.push("LOGIN_ID = :LOGIN_ID");
      values.LOGIN_ID = updatedData.loginid;  // Updated to match the database field name
    }

    if (updatedData.loginpw !== undefined) {
      fieldsToUpdate.push("LOGIN_PW = :LOGIN_PW");
      values.LOGIN_PW = updatedData.loginpw;  // Updated to match the database field name
    }

    // Check if there are fields to update
    if (fieldsToUpdate.length === 0) {
      throw new Error("No fields provided to update");
    }

    // Construct the final SQL statement
    const sql = `UPDATE PASSENGERS SET ${fieldsToUpdate.join(", ")} WHERE PASSENGER_ID = :PASSENGER_ID`;

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

async function deletePassengerByIdFromDB(id) {
  const query = `DELETE FROM PASSENGERS WHERE PASSENGER_ID = :id`; // Query to delete a passenger by ID
  let connection;

  try {
      connection = await oracledb.getConnection(); // Get a connection from the pool
      const result = await connection.execute(query, [id], { autoCommit: true }); // Execute query with bind variable and commit

      return result.rowsAffected > 0; // Return true if at least one row was deleted
  } catch (err) {
      console.error('Error deleting passenger:', err);
      throw err; // Throw error to be caught in the controller
  } finally {
      if (connection) {
          await connection.close(); // Always close the connection
      }
  }
}

module.exports = {
  listAllPassengers,
  getPassengerByIdFromDB,
  newPassenger,
  updatePassengerByID,
  deletePassengerByIdFromDB,
};

