const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

// User registration
router.post("/register", userController.register);

// User login
router.post("/login", userController.login);

// Forgot password
router.post("/forgot-password", userController.forgotPassword);

// Reset password (based on a token from forgot password)
router.post("/reset-password", userController.resetPassword);

// Change password (authenticated users)
router.post("/change-password", authMiddleware, userController.changePassword);

// Update user profile (authenticated users)
router.put("/update", authMiddleware, userController.updateProfile);

module.exports = router;
