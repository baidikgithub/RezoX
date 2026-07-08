import { pool } from "../config/db.js";

class User {
  static async findOne({ email }) {
    const res = await pool.query(
      'SELECT id as "_id", name, email, password, role, phone, avatar, bio, "createdAt", "updatedAt" FROM users WHERE email = $1',
      [email]
    );
    return res.rows[0] || null;
  }

  static async create({ name, email, password, role }) {
    const res = await pool.query(
      `INSERT INTO users (name, email, password, role, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING id as "_id", name, email, password, role, phone, avatar, bio, "createdAt", "updatedAt"`,
      [name, email, password, role]
    );
    return res.rows[0];
  }
}

export default User;
