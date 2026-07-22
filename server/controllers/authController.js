

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "60d"
  });
}


// Register user
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if ((!username || !email || !password))
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });

        // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    // Hash Password

    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });
    await newUser.save();
    const token = generateToken(newUser._id);
    return res.status(201).json({ success: true, message: "User registered successfully", token, user});

  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if ((!email || !password))
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    return res.status(200).json({ success: true, message: "User logged in successfully", token, user });

  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get Current User Profile
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }
      res.json({ success: true, user });
  } catch (error) {
    console.error("Get user profile error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
