const { createUser, findUserByEmail, findUserById, updateUser, deleteUserById } = require("../models/UserModel");

/**
 * Create a new user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
async function addUser(req, res) {
  const { email, password, name, role } = req.body;

  try {
    // Hash the password before saving (you can implement password hashing logic as needed)
    // For example, using bcryptjs or bcrypt
    const hashedPassword = password; // Here you can hash the password

    // Call the createUser function from the model
    await createUser(email, hashedPassword, name, role);

    // Respond with success message
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error creating user", error: err.message });
  }
}

/**
 * Find user by email
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
async function getUserByEmail(req, res) {
  const { email } = req.params;

  try {
    const user = await findUserByEmail(email);
    
    if (user) {
      res.json({ data: user });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error fetching user", error: err.message });
  }
}

/**
 * Find user by ID
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
async function getUserById(req, res) {
  const { id } = req.params;

  try {
    const user = await findUserById(id);
    
    if (user) {
      res.json({ data: user });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error fetching user", error: err.message });
  }
}

/**
 * Update user details
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
async function updateUserDetails(req, res) {
  const { id } = req.params;
  const { name, email, role } = req.body;

  try {
    const result = await updateUser(id, name, role, email);
    
    if (result > 0) {
      res.json({ message: "User updated successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error updating user", error: err.message });
  }
}

/**
 * Delete a user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
async function deleteUser(req, res) {
  const { id } = req.params;

  try {
    const result = await deleteUserById(id);

    if (result > 0) {
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err.message });
  }
}

module.exports = {
  addUser,
  getUserByEmail,
  getUserById,
  updateUserDetails,
  deleteUser
};
