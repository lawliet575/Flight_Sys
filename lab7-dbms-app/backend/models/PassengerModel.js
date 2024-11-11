const oracledb = require("oracledb");

async function listAllPassengers() {
  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(`SELECT * FROM passenger`);
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
      `INSERT INTO passenger ( passportID, Firstname, Lastname, Email, ContactNo, Address, Gender, DateofBirth)
       VALUES ( :passportID, :Firstname, :Lastname, :Email, :ContactNo, :Address, :Gender, :DateofBirth)`,
      {
        passportID: passengerData.passportId,
        Firstname: passengerData.firstName,
        Lastname: passengerData.lastName,
        Email: passengerData.email,
        ContactNo: passengerData.contact,
        Address: passengerData.address,
        Gender: passengerData.gender,
        DateofBirth: passengerData.dob,
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
    const result = await conn.execute(
      `UPDATE passenger SET Firstname = :Firstname, Lastname = :Lastname, Email = :Email, ContactNo = :ContactNo, Address = :Address, Gender = :Gender, DateofBirth = :DateofBirth WHERE PassengerID = :PassengerID`,
      {
        PassengerID: updatedData.id,
        Firstname: updatedData.firstName,
        Lastname: updatedData.lastName,
        Email: updatedData.email,
        ContactNo: updatedData.contact,
        Address: updatedData.address,
        Gender: updatedData.gender,
        DateofBirth: updatedData.dob,
      },
      { autoCommit: true }
    );
    return result;
  } catch (err) {
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

