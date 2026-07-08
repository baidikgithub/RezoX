import { pool } from "../config/db.js";

export async function getAnalytics(_req, res, next) {
  try {
    const [summary, byLocation, byStatus, recentBookings] = await Promise.all([
      pool.query(`
        SELECT
          (SELECT COUNT(*) FROM listings) AS listings,
          (SELECT COUNT(*) FROM users) AS users,
          (SELECT COUNT(*) FROM bookings) AS bookings,
          (SELECT COUNT(*) FROM reviews) AS reviews,
          COALESCE(AVG(price), 0) AS avg_price
        FROM listings
      `),
      pool.query(`
        SELECT COALESCE(city, location, 'Unknown') AS location, COUNT(*)::int AS count, COALESCE(AVG(price), 0)::float AS "avgPrice"
        FROM listings GROUP BY COALESCE(city, location, 'Unknown') ORDER BY count DESC LIMIT 10
      `),
      pool.query(`SELECT status, COUNT(*)::int AS count FROM listings GROUP BY status ORDER BY count DESC`),
      pool.query(`
        SELECT b.id, b.status, b.visit_at AS "visitAt", l.title, u.name AS "buyerName"
        FROM bookings b
        JOIN listings l ON l.id = b.listing_id
        JOIN users u ON u.id = b.user_id
        ORDER BY b.created_at DESC LIMIT 8
      `)
    ]);

    res.json({
      summary: {
        listings: Number(summary.rows[0].listings || 0),
        users: Number(summary.rows[0].users || 0),
        bookings: Number(summary.rows[0].bookings || 0),
        reviews: Number(summary.rows[0].reviews || 0),
        avgPrice: Number(summary.rows[0].avg_price || 0)
      },
      byLocation: byLocation.rows,
      byStatus: byStatus.rows,
      recentBookings: recentBookings.rows
    });
  } catch (error) {
    next(error);
  }
}
