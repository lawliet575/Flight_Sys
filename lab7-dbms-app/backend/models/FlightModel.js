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
    let conn;
    try {
      conn = await oracledb.getConnection();
       // Convert ID fields to numbers (if required)
      console.log(flightData);

 
      await conn.execute(
        `INSERT INTO FLIGHT(FlightID, Dep_airport_id, DepartureDate, DepartureTime, Arr_airport_id, ArrivalDate, ArrivalTime, Aircraft_ID) 
        VALUES (:FlightID, :Dep_airport_id, :DepartureDate, :DepartureTime, :Arr_airport_id, :ArrivalDate, :ArrivalTime, :Aircraft_ID)`,
        { 
         // Convert string to Date
        FlightID : flightData.id,
        Dep_airport_id : flightData.dep_airport_id,
        DepartureDate : flightData.dep_date,
        DepartureTime : flightData.dep_time, 
        Arr_airport_id : flightData.arr_airport_id, 
        ArrivalDate : flightData.arr_date,
        ArrivalTime : flightData.arr_time, 
        Aircraft_ID : flightData.aircraft_id
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


  async function updateFlightByID(updatedData) {
    let conn;
    try {
      conn = await oracledb.getConnection();
  
      // Prepare fields and values based on updatedData
      let fieldsToUpdate = [];
      let values = { FlightID: updatedData.id };  // Assume `id` is always provided for identifying the row
  
      // Dynamically add fields based on provided data
      if (updatedData.dep_airport_id !== undefined) {
        fieldsToUpdate.push("Dep_airport_id = :dep_airport_id");
        values.dep_airport_id = updatedData.dep_airport_id;
      }
      if (updatedData.dep_date !== undefined) {
        fieldsToUpdate.push("DepartureDate = :dep_date");
        values.dep_date = updatedData.dep_date;
      }
      if (updatedData.dep_time !== undefined) {
        fieldsToUpdate.push("DepartureTime = :dep_time");
        values.dep_time = updatedData.dep_time;
      }
      if (updatedData.arr_airport_id !== undefined) {
        fieldsToUpdate.push("Arr_airport_id = :arr_airport_id");
        values.arr_airport_id = updatedData.arr_airport_id;
      }
      if (updatedData.arr_date !== undefined) {
        fieldsToUpdate.push("ArrivalDate = :arr_date");
        values.arr_date = updatedData.arr_date;
      }
      if (updatedData.arr_time !== undefined) {
        fieldsToUpdate.push("ArrivalTime = :arr_time");
        values.arr_time = updatedData.arr_time;
      }
      if (updatedData.aircraft_id !== undefined) {
        fieldsToUpdate.push("Aircraft_ID = :aircraft_id");
        values.aircraft_id = updatedData.aircraft_id;
      }
  
      // Check if there are fields to update
      if (fieldsToUpdate.length === 0) {
        throw new Error("No fields provided to update");
      }
  
      // Construct the final SQL statement
      const sql = `UPDATE flight SET ${fieldsToUpdate.join(", ")} WHERE FlightID = :FlightID`;
  
      console.log("Executing SQL:", sql);
      console.log("Values:", values);
  
      // Execute the query
      const result = await conn.execute(sql, values, { autoCommit: true });
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
    listAllFlights,
    newFlight,
    updateFlightByID  
  };
  