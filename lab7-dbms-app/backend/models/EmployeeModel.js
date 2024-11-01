const oracledb = require("oracledb");

async function listAllEmployees() {
  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(`SELECT * FROM employees`);
    return result.rows;
  } catch (err) {
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
    const result = await conn.execute(`SELECT MAX(EMPLOYEE_ID) FROM EMPLOYEES`);
    return result.rows;
  } catch (err) {
    throw err;
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

async function newEmployee(employeeData) {
  // Convert ISO date string to JavaScript Date object
  const hireDate = new Date(employeeData.hire_date);
  const email = employeeData.email.substring(
    0,
    employeeData.email.indexOf("@")
  );

  let conn;
  try {
    conn = await oracledb.getConnection();
    console.log(employeeData);
    await conn.execute(
      `INSERT INTO EMPLOYEES (employee_id, first_Name, last_name, email, phone_number, HIRE_DATE, JOB_ID, salary, manager_id, department_id) VALUES (:employee_id, :first_name, :last_name, :email, :phone_number, :hire_date , :job_id, :salary, 100, 90)`,
      { 
        employee_id: employeeData.id,
        first_name: employeeData.firstName,
        last_name: employeeData.lastName,
        email: email,
        phone_number: employeeData.phone,
        hire_date: hireDate,
        job_id: employeeData.jobID,
        salary: employeeData.salary,
        // commission_pct: 0,
        // manager_id: 100,
        // department_id: 90,
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

// updateEmployee
async function updateEmployeeByID(updatedData) {
  console.log(updatedData);
  let conn;
  try {
    conn = await oracledb.getConnection();

    let fieldsToUpdate = [];
    let values = { employee_id: updatedData.id };

    if (updatedData.firstName) {
      fieldsToUpdate.push("first_name = :first_name");
      values.first_name = updatedData.firstName;
    }
    if (updatedData.lastName) {
      fieldsToUpdate.push("last_name = :last_name");
      values.last_name = updatedData.lastName;
    }
    if (updatedData.email) {
      fieldsToUpdate.push("email = :email");
      values.email = updatedData.email;
    }
    if (updatedData.salary) {
      fieldsToUpdate.push("salary = :salary");
      values.salary = updatedData.salary;
    }

    // If no fields to update, return
    if (fieldsToUpdate.length === 0) {
      throw new Error("No fields provided to update");
    }

    const sql = `UPDATE employees SET ${fieldsToUpdate.join(
      ", "
    )} WHERE employee_id = :employee_id`;

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

// deleteEmployee
async function deleteEmployeeByID(id) {
  let conn;
  try {
    conn = await oracledb.getConnection();

    // Get the manager_id of the employee being deleted
    const getManagerResult = await conn.execute(
      `SELECT manager_id FROM employees WHERE employee_id = :employee_id`,
      { employee_id: id }
    );

    const managerId = getManagerResult.rows[0][0];

    if (managerId !== undefined) {
      // Update the manager_id of employees reporting to the employee being deleted
      await conn.execute(
        `UPDATE employees 
         SET manager_id = :new_manager_id 
         WHERE manager_id = :old_manager_id`,
        {
          new_manager_id: managerId,
          old_manager_id: id,
        },
        { autoCommit: true }
      );

      // Update the manager_id in the departments where the employee is a manager
      await conn.execute(
        `UPDATE departments
         SET manager_id = :new_manager_id
         WHERE manager_id = :old_manager_id`,
        {
          new_manager_id: managerId,
          old_manager_id: id,
        },
        { autoCommit: true }
      );
    }
    //deleting employee from job history
    await conn.execute(
      "DELETE FROM JOB_HISTORY WHERE EMPLOYEE_ID= :employee_id",
      { employee_id: id },
      { autoCommit: true }
    );

    // Delete the employee
    const deleteResult = await conn.execute(
      "DELETE FROM employees WHERE employee_id = :employee_id",
      { employee_id: id },
      { autoCommit: true }
    );

    return deleteResult;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}
module.exports = {
  listAllEmployees,
  getMaxID,
  newEmployee,
  updateEmployeeByID,
  deleteEmployeeByID,
};
