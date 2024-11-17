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

async function newPassenger(passengerData) {
  let conn;
  try {
    conn = await oracledb.getConnection();
    await conn.execute(
      `INSERT INTO PASSENGERS (PASSPORT_ID, FIRSTNAME, LASTNAME, EMAIL, CONTACT_NO, ADDRESS, GENDER, DATE_OF_BIRTH)
        VALUES (:PASSPORT_ID, :FIRSTNAME, :LASTNAME, :EMAIL, :CONTACT_NO, :ADDRESS, :GENDER, :DATE_OF_BIRTH)`,
      {
        PASSPORT_ID: passengerData.passportid,
        FIRSTNAME: passengerData.firstName,
        LASTNAME: passengerData.lastName,
        EMAIL: passengerData.email,
        CONTACT_NO: passengerData.contact,
        ADDRESS: passengerData.address,
        GENDER: passengerData.gender,
        DATE_OF_BIRTH: new Date(passengerData.dob),
      },
      { autoCommit: true }
    );
  } catch (err) {
    throw err;
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

async function updatePassengerByID(updatedData) {
  let conn;
  try {
    conn = await oracledb.getConnection();

    // Prepare fields and values based on updatedData
    let fieldsToUpdate = [];
    let values = { PASSENGER_ID: updatedData.id }; // Assume `id` is always provided for identifying the row

    // Dynamically add fields based on provided data
    if (updatedData.passportId !== undefined) {
      fieldsToUpdate.push("PASSPORT_ID = :PASSPORT_ID");
      values.PASSPORT_ID = updatedData.passportid;
    }
    if (updatedData.firstName !== undefined) {
      fieldsToUpdate.push("FIRSTNAME = :FIRSTNAME");
      values.FIRSTNAME = updatedData.firstName;
    }
    if (updatedData.lastName !== undefined) {
      fieldsToUpdate.push("LASTNAME = :LASTNAME");
      values.LASTNAME = updatedData.lastName;
    }
    if (updatedData.email !== undefined) {
      fieldsToUpdate.push("EMAIL = :EMAIL");
      values.EMAIL = updatedData.email;
    }
    if (updatedData.contact !== undefined) {
      fieldsToUpdate.push("CONTACT_NO = :CONTACT_NO");
      values.CONTACT_NO = updatedData.contact;
    }
    if (updatedData.address !== undefined) {
      fieldsToUpdate.push("ADDRESS = :ADDRESS");
      values.ADDRESS = updatedData.address;
    }
    if (updatedData.gender !== undefined) {
      fieldsToUpdate.push("GENDER = :GENDER");
      values.GENDER = updatedData.gender;
    }
    if (updatedData.dob !== undefined) {
      fieldsToUpdate.push("DATE_OF_BIRTH = :DATE_OF_BIRTH");
      values.DATE_OF_BIRTH = new Date(updatedData.dob); // Ensure it's a Date object
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

module.exports = {
  listAllPassengers,
  newPassenger,
  updatePassengerByID,
};

