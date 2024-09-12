const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { Op } = require("sequelize");
const { sendResetPasswordEmail } = require("../utils/emailService");
const crypto = require("crypto");

// User registration
exports.register = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const userExists = await User.findOne({ where: { email } });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
    });

    return res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    return res.status(500).json({ message: "Error registering user", error });
  }
};

// User login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.status(200).json({ token, user });
  } catch (error) {
    return res.status(500).json({ message: "Error logging in", error });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordToken = await bcrypt.hash(resetToken, 10);

    // Store resetPasswordToken in the user model
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry
    await user.save();

    await sendResetPasswordEmail(user.email, resetToken); // Implement email sending logic
    return res.status(200).json({ message: "Password reset link sent" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error sending password reset link", error });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    const user = await User.findOne({
      where: {
        resetPasswordExpires: { [Op.gt]: Date.now() },
      },
    });
    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    const isMatch = await bcrypt.compare(token, user.resetPasswordToken);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid or expired token" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error resetting password", error });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect" });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error changing password", error });
  }
};

// Update user profile (name, email)
exports.updateProfile = async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(400).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();

    return res
      .status(200)
      .json({ message: "Profile updated successfully", user });
  } catch (error) {
    return res.status(500).json({ message: "Error updating profile", error });
  }
};
