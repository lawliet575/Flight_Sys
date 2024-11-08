// const oracledb = require("oracledb");

// async function createUser(email, hashedPassword) {
//   const query = `INSERT INTO users (email, password) VALUES (:email, :password)`;
//   const binds = { email, password: hashedPassword };

//   let connection;
//   try {
//     connection = await oracledb.getConnection();
//     await connection.execute(query, binds, { autoCommit: true });
//   } finally {
//     if (connection) {
//       await connection.close();
//     }
//   }
// }

// async function findUserByEmail(email) {
//   const query = `SELECT * FROM users WHERE email = :email`;
//   let connection;
//   try {
//     connection = await oracledb.getConnection();
//     const result = await connection.execute(query, [email]);
//     return result.rows[0];
//   } finally {
//     if (connection) {
//       await connection.close();
//     }
//   }
// }

// module.exports = { createUser, findUserByEmail };

const oracledb = require("oracledb");

/**
 * Create a new user in the users table.
 * @param {string} email - The email of the user.
 * @param {string} hashedPassword - The hashed password of the user.
 * @param {string} name - The name of the user.
 * @param {string} role - The role of the user (admin, passenger).
 */
async function createUser(email, hashedPassword, name, role) {
  const query = `
    INSERT INTO users (email, password, name, role)
    VALUES (:email, :password, :name, :role)
  `;
  const binds = { email, password: hashedPassword, name, role };

  let connection;
  try {
    connection = await oracledb.getConnection();
    await connection.execute(query, binds, { autoCommit: true });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

/**
 * Find a user by their email address.
 * @param {string} email - The email of the user to search for.
 * @returns {object|null} The user object if found, null otherwise.
 */
async function findUserByEmail(email) {
  const query = `SELECT * FROM users WHERE email = :email`;
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(query, [email]);
    return result.rows[0] || null;  // Return the first row or null if not found
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

/**
 * Find a user by their ID.
 * @param {number} id - The user ID to search for.
 * @returns {object|null} The user object if found, null otherwise.
 */
async function findUserById(id) {
  const query = `SELECT * FROM users WHERE id = :id`;
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(query, [id]);
    return result.rows[0] || null; // Return the first row or null if not found
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

/**
 * Update a user's details.
 * @param {number} id - The ID of the user.
 * @param {string} name - The updated name of the user.
 * @param {string} role - The updated role of the user (admin, passenger).
 * @param {string} email - The updated email of the user.
 */
async function updateUser(id, name, role, email) {
  const query = `
    UPDATE users 
    SET name = :name, role = :role, email = :email
    WHERE id = :id
  `;
  const binds = { id, name, role, email };

  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(query, binds, { autoCommit: true });
    return result.rowsAffected;  // Returns the number of rows affected
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

/**
 * Delete a user by their ID.
 * @param {number} id - The ID of the user to delete.
 */
async function deleteUserById(id) {
  const query = `DELETE FROM users WHERE id = :id`;
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(query, [id], { autoCommit: true });
    return result.rowsAffected;  // Returns the number of rows affected
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

module.exports = { 
  createUser, 
  findUserByEmail, 
  findUserById, 
  updateUser, 
  deleteUserById 
};
