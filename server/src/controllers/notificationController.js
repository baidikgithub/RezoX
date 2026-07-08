import { pool } from "../config/db.js";

export async function getNotifications(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT id, title, body, type, read_at AS "readAt", created_at AS "createdAt"
       FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
}

export async function markNotificationRead(req, res, next) {
  try {
    await pool.query(
      `UPDATE notifications SET read_at = NOW() WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );
    res.json({ message: "Notification marked as read." });
  } catch (error) {
    next(error);
  }
}
