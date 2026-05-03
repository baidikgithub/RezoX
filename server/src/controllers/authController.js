import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

function buildAuthResponse(user) {
  const token = jwt.sign(
    { id: user._id.toString(), email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    message: "Authentication successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
}

export async function signup(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required." });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists with this email." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: role === "admin" ? "admin" : "user"
    });

    return res.status(201).json(buildAuthResponse(user));
  } catch (err) {
    return res.status(500).json({ error: "Failed to sign up user." });
  }
}

export async function signin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    return res.status(200).json(buildAuthResponse(user));
  } catch (err) {
    return res.status(500).json({ error: "Failed to sign in user." });
  }
}
