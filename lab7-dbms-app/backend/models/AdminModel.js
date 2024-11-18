// models/AdminModel.js
const oracledb = require("oracledb");

/**
 * Fetch all admin login details from Admin_Login table
 * @returns {Promise<Array>} - List of admin IDs and passwords
 */
async function listAdminLogins() {
    let conn;
    try {
        conn = await oracledb.getConnection();
        console.log(conn.clientId); // Log the client ID if needed
        const query = `SELECT * FROM Admin_Login`;
        const result = await conn.execute(query);
        console.log(result.rows); // Log the fetched rows
        return result.rows;
    } catch (error) {
        console.error("Error fetching admin login data:", error);
        throw error;
    } finally {
        if (conn) {
            await conn.close();
        }
    }
}

module.exports = { listAdminLogins };
