import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { pool } from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL || "15m";
const REFRESH_TOKEN_DAYS = Number(process.env.REFRESH_TOKEN_DAYS || 30);
const RESET_TOKEN_MINUTES = Number(process.env.RESET_TOKEN_MINUTES || 30);

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function publicUser(user) {
  return {
    id: user._id || user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || null,
    avatar: user.avatar || null,
    bio: user.bio || null
  };
}

function signAccessToken(user) {
  return jwt.sign(
    { id: String(user._id || user.id), email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_TTL }
  );
}

async function createRefreshToken(userId) {
  const refreshToken = crypto.randomBytes(48).toString("base64url");
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000);
  await pool.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, hashToken(refreshToken), expiresAt]
  );
  return refreshToken;
}

async function buildAuthResponse(user) {
  const normalizedUser = publicUser(user);
  const token = signAccessToken(normalizedUser);
  const refreshToken = await createRefreshToken(normalizedUser.id);

  return {
    message: "Authentication successful",
    token,
    accessToken: token,
    refreshToken,
    expiresIn: ACCESS_TOKEN_TTL,
    user: normalizedUser
  };
}

export async function signup(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required." });
    }

    if (String(password).length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters." });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists with this email." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const allowedRoles = ["admin", "agent", "buyer"];
    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: allowedRoles.includes(role) ? role : "buyer"
    });

    return res.status(201).json(await buildAuthResponse(user));
  } catch (err) {
    console.error(err);
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

    return res.status(200).json(await buildAuthResponse(user));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to sign in user." });
  }
}

export async function refresh(req, res) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: "Refresh token is required." });

    const tokenHash = hashToken(refreshToken);
    const tokenResult = await pool.query(
      `SELECT rt.id, rt.user_id, rt.expires_at, rt.revoked_at,
        u.id AS user_id, u.name, u.email, u.role, u.phone, u.avatar, u.bio
       FROM refresh_tokens rt
       JOIN users u ON u.id = rt.user_id
       WHERE rt.token_hash = $1`,
      [tokenHash]
    );

    const record = tokenResult.rows[0];
    if (!record || record.revoked_at || new Date(record.expires_at).getTime() <= Date.now()) {
      return res.status(401).json({ error: "Invalid or expired refresh token." });
    }

    await pool.query(`UPDATE refresh_tokens SET revoked_at = NOW() WHERE id = $1`, [record.id]);
    const user = {
      id: record.user_id,
      name: record.name,
      email: record.email,
      role: record.role,
      phone: record.phone,
      avatar: record.avatar,
      bio: record.bio
    };

    const accessToken = signAccessToken(user);
    const nextRefreshToken = await createRefreshToken(user.id);
    res.json({ token: accessToken, accessToken, refreshToken: nextRefreshToken, expiresIn: ACCESS_TOKEN_TTL, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to refresh session." });
  }
}

export async function logout(req, res) {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await pool.query(`UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = $1`, [hashToken(refreshToken)]);
    }
    res.json({ message: "Signed out successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to sign out." });
  }
}

export async function forgotPassword(req, res) {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    if (!email) return res.status(400).json({ error: "Email is required." });

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "If the account exists, a reset link has been generated." });
    }

    const resetToken = crypto.randomBytes(32).toString("base64url");
    const expiresAt = new Date(Date.now() + RESET_TOKEN_MINUTES * 60 * 1000);
    await pool.query(
      `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [user._id, hashToken(resetToken), expiresAt]
    );

    const resetUrl = `${process.env.CLIENT_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;
    const response = { message: "If the account exists, a reset link has been generated." };
    if (process.env.NODE_ENV !== "production") {
      response.resetToken = resetToken;
      response.resetUrl = resetUrl;
    }
    return res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create password reset token." });
  }
}

export async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ error: "Token and password are required." });
    if (String(password).length < 8) return res.status(400).json({ error: "Password must be at least 8 characters." });

    const result = await pool.query(
      `SELECT id, user_id, expires_at, used_at
       FROM password_reset_tokens
       WHERE token_hash = $1`,
      [hashToken(token)]
    );
    const reset = result.rows[0];
    if (!reset || reset.used_at || new Date(reset.expires_at).getTime() <= Date.now()) {
      return res.status(400).json({ error: "Invalid or expired reset token." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await pool.query(`UPDATE users SET password = $1, "updatedAt" = NOW() WHERE id = $2`, [hashedPassword, reset.user_id]);
    await pool.query(`UPDATE password_reset_tokens SET used_at = NOW() WHERE id = $1`, [reset.id]);
    await pool.query(`UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = $1 AND revoked_at IS NULL`, [reset.user_id]);

    res.json({ message: "Password reset successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to reset password." });
  }
}

export async function me(req, res) {
  return res.json({ user: req.user });
}
