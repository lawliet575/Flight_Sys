// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/AdminController");

// Endpoint to fetch all admin IDs and passwords
// Example: http://localhost:3001/api/admins
router.get("/admin", AdminController.getAdminLogins);

module.exports = router;