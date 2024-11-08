const oracledb = require("oracledb");

async function listAllFlights() {
  let conn;
  try {
    conn = await oracledb.getConnection();
    console.log(conn.clientId);
    const result = await conn.execute(`SELECT * FROM flight`);
    console.log(result.rows);    
    return result.rows;
  } catch (err) {
    throw err;
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

async function newFlight(flightData) {
    // Convert ISO date string to JavaScript Date object
    // const hireDate = new Date(employeeData.hire_date);
    // const email = employeeData.email.substring(
    //   0,
    //   employeeData.email.indexOf("@")
    // );
  
    let conn;
    try {
      conn = await oracledb.getConnection();
      console.log(flightData);
      await conn.execute(
        `INSERT INTO FLIGHT(FlightID, Dep_airport_id, DepartureDate, DepartureTime, Arr_airport_id, ArrivalDate, ArrivalTime, Aircraft_ID) VALUES (:FlightID, :Dep_airport_id, :DepartureDate, :DepartureTime, :Arr_airport_id, :ArrivalDate, :ArrivalTime, :Aircraft_ID)`,
        { 
        FlightID : flightData.id,
        Dep_airport_id : flightData.dep_airport_id,
        DepartureDate : flightData.dep_date,
        DepartureTime : flightData.dep_time, 
        Arr_airport_id : flightData.arr_airport_id, 
        ArrivalDate : arr_date,
        ArrivalTime : arr_time, 
        Aircraft_ID : aircraft_id
        },
        { autoCommit: true }
      );
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      if (conn) {
        await conn.close();
      }
    }
  }


// updateFlight
async function updateFlightByID(updatedData) {
    console.log(updatedData);
    let conn;
    try {
      conn = await oracledb.getConnection();
  
      let fieldsToUpdate = [];
      let values = { FlightID: updatedData.flightID };
  
      if (updatedData.depAirportId) {
        fieldsToUpdate.push("Dep_airport_id = :dep_airport_id");
        values.dep_airport_id = updatedData.depAirportId;
      }
      if (updatedData.departureDate) {
        fieldsToUpdate.push("DepartureDate = :departureDate");
        values.departureDate = updatedData.departureDate;
      }
      if (updatedData.departureTime) {
        fieldsToUpdate.push("DepartureTime = :departureTime");
        values.departureTime = updatedData.departureTime;
      }
      if (updatedData.arrAirportId) {
        fieldsToUpdate.push("Arr_airport_id = :arr_airport_id");
        values.arr_airport_id = updatedData.arrAirportId;
      }
      if (updatedData.arrivalDate) {
        fieldsToUpdate.push("ArrivalDate = :arrivalDate");
        values.arrivalDate = updatedData.arrivalDate;
      }
      if (updatedData.arrivalTime) {
        fieldsToUpdate.push("ArrivalTime = :arrivalTime");
        values.arrivalTime = updatedData.arrivalTime;
      }
      if (updatedData.aircraftId) {
        fieldsToUpdate.push("Aircraft_ID = :aircraft_ID");
        values.aircraft_ID = updatedData.aircraftId;
      }
  
      // If no fields to update, return
      if (fieldsToUpdate.length === 0) {
        throw new Error("No fields provided to update");
      }
  
      const sql = 'UPDATE flight SET ${fieldsToUpdate.join(", ")} WHERE FlightID = :FlightID';
  
      const result = await conn.execute(sql, values, { autoCommit: true });
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
    listAllFlights,
    newFlight,
    updateFlightByID  
  };
  