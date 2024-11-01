const oracledb = require("oracledb");

async function listAllJobs() {
  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(`SELECT JOB_ID, JOB_TITLE FROM jobs`);
    return result.rows;
  } catch (err) {
    throw err;
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

module.exports = {
  listAllJobs,
};
