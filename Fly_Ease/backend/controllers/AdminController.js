// controllers/AdminController.js
const { listAdminLogins } = require("../models/AdminModel");
const db = require("../config/db");


/**
 * Fetch all admin login details
 * @param req - Request object
 * @param res - Response object
 */
async function getAdminLogins(req, res) {
    try {
        const adminLogins = await listAdminLogins();
        res.status(200).json({ data: adminLogins });
    } catch (error) {
        console.error("Error fetching admin logins:", error);
        res.status(500).json({ message: "Error fetching admin logins", error });
    }
}

module.exports = { getAdminLogins };
