import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: "Authentication token is required." });
    }

    const payload = jwt.verify(token, JWT_SECRET);
    const result = await pool.query(
      `SELECT id, name, email, role, phone, avatar, bio, "createdAt", "updatedAt"
       FROM users WHERE id = $1`,
      [payload.id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid authentication token." });
    }

    req.user = result.rows[0];
    next();
  } catch (_error) {
    return res.status(401).json({ error: "Invalid or expired authentication token." });
  }
}

export function optionalAuth(req, _res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return next();

  try {
    req.auth = jwt.verify(token, JWT_SECRET);
  } catch (_error) {
    req.auth = null;
  }
  next();
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication is required." });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "You do not have permission to perform this action." });
    }

    next();
  };
}
