const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");

router.post("/users", userController.addUser);  // To add a new user
router.get("/users/email/:email", userController.getUserByEmail);  // To get a user by email
router.get("/users/:id", userController.getUserById);  // To get a user by ID
router.put("/users/:id", userController.updateUserDetails);  // To update user details
router.delete("/users/:id", userController.deleteUser);  // To delete a user

module.exports = router;
