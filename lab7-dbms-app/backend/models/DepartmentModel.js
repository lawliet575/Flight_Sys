const oracledb = require("oracledb");

async function listAllDepartments() {
  //LAB TASK: Finish Implementation
  
  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(`SELECT * FROM departments`);
    return result.rows;
  } catch (err) {
    throw err;
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

async function departmentByID(departmentID) {
  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(`SELECT * FROM departments WHERE DEPARTMENT_ID = :departmentID`, [departmentID]);
    return result.rows;
  } catch (err) {
    throw err;
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

async function newDepartment(departmentData) {
  let conn;
  try {
    conn = await oracledb.getConnection();
    await conn.execute(
      `INSERT INTO DEPARTMENTS (DEPARTMENT_ID, DEPARTMENT_NAME, MANAGER_ID, LOCATION_ID) VALUES (:department_id, :department_name, :manager_id, :location_id)`,
      {
        department_id: departmentData.id,
        department_name: departmentData.name,
        manager_id: 100,
        location_id: departmentData.location,
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

async function getMaxID() {
  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(`SELECT MAX(DEPARTMENT_ID) FROM DEPARTMENTS`);
    return result.rows;
  } catch (err) {
    throw err;
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

// Modify an existing department
async function modifyDepartment(departmentData) {
  console.log(departmentData);
  let conn;
  try {
    conn = await oracledb.getConnection();
    await conn.execute(
      `UPDATE DEPARTMENTS SET DEPARTMENT_NAME = :department_name, MANAGER_ID = :manager_id, LOCATION_ID = :location_id WHERE DEPARTMENT_ID = :department_id`,
      {
        department_id:departmentData.id,
        department_name: departmentData.name,
        manager_id:100,
        location_id: departmentData.location,
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

module.exports = {
  listAllDepartments,
  getMaxID,
  departmentByID,
  newDepartment,
  modifyDepartment,
};
