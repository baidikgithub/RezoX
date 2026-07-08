import bcrypt from "bcryptjs";
import { pool } from "../config/db.js";

function publicUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    phone: row.phone,
    avatar: row.avatar,
    bio: row.bio,
    createdAt: row.createdAt
  };
}

export async function getProfile(req, res) {
  res.json({ user: req.user });
}

export async function updateProfile(req, res, next) {
  try {
    const result = await pool.query(
      `UPDATE users SET
        name = COALESCE($1, name),
        phone = $2,
        avatar = $3,
        bio = $4,
        "updatedAt" = NOW()
       WHERE id = $5
       RETURNING id, name, email, role, phone, avatar, bio, "createdAt"`,
      [req.body.name || null, req.body.phone || null, req.body.avatar || null, req.body.bio || null, req.user.id]
    );
    res.json({ user: publicUser(result.rows[0]) });
  } catch (error) {
    next(error);
  }
}

export async function listUsers(_req, res, next) {
  try {
    const result = await pool.query(
      `SELECT id, name, email, role, phone, avatar, bio, "createdAt"
       FROM users ORDER BY "createdAt" DESC`
    );
    res.json(result.rows.map(publicUser));
  } catch (error) {
    next(error);
  }
}

export async function updateUserRole(req, res, next) {
  try {
    const allowed = ["admin", "agent", "buyer"];
    if (!allowed.includes(req.body.role)) return res.status(400).json({ error: "Invalid role." });
    const result = await pool.query(
      `UPDATE users SET role = $1, "updatedAt" = NOW()
       WHERE id = $2
       RETURNING id, name, email, role, phone, avatar, bio, "createdAt"`,
      [req.body.role, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "User not found." });
    res.json({ user: publicUser(result.rows[0]) });
  } catch (error) {
    next(error);
  }
}

export async function changePassword(req, res, next) {
  try {
    if (!req.body.password || String(req.body.password).length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }
    const hash = await bcrypt.hash(req.body.password, 10);
    await pool.query(`UPDATE users SET password = $1, "updatedAt" = NOW() WHERE id = $2`, [hash, req.user.id]);
    res.json({ message: "Password updated." });
  } catch (error) {
    next(error);
  }
}
