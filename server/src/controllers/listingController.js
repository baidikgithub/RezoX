import { pool } from "../config/db.js";
import { parseStringArray, requireFields, toInt, toNumber } from "../utils/validators.js";

const toImageUrl = (req, filename) => `${req.protocol}://${req.get("host")}/uploads/${filename}`;

function mapListing(row) {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    title: row.title,
    description: row.description,
    location: row.location,
    address: row.address,
    city: row.city,
    state: row.state,
    property_type: row.property_type,
    status: row.status,
    price: row.price !== null ? Number(row.price) : null,
    total_sqft: row.total_sqft !== null ? Number(row.total_sqft) : null,
    bath: row.bath,
    bhk: row.bhk,
    latitude: row.latitude,
    longitude: row.longitude,
    images: row.images || [],
    amenities: row.amenities || [],
    agent_id: row.agent_id,
    agent: row.agent_name ? { id: row.agent_id, name: row.agent_name, email: row.agent_email, phone: row.agent_phone } : null,
    averageRating: row.average_rating !== null && row.average_rating !== undefined ? Number(row.average_rating) : 0,
    reviewsCount: Number(row.reviews_count || 0),
    createdAt: row.createdAt || row.createdat,
    updatedAt: row.updatedAt || row.updatedat
  };
}

function listingSelect(extra = "") {
  return `
    SELECT l.id, l.title, l.description, l.location, l.address, l.city, l.state, l.property_type,
      l.status, l.price, l.total_sqft, l.bath, l.bhk, l.latitude, l.longitude, l.images,
      l.amenities, l.agent_id, l."createdAt", l."updatedAt",
      u.name AS agent_name, u.email AS agent_email, u.phone AS agent_phone,
      COALESCE(AVG(r.rating), 0) AS average_rating,
      COUNT(r.id) AS reviews_count
      ${extra}
    FROM listings l
    LEFT JOIN users u ON u.id = l.agent_id
    LEFT JOIN reviews r ON r.listing_id = l.id
  `;
}

function normalizeListingPayload(body, req) {
  const uploadedImages = (req.files || []).map(file => toImageUrl(req, file.filename));
  const existingImages = parseStringArray(body.existingImages);
  const bodyImages = parseStringArray(body.images);

  return {
    title: body.title?.trim(),
    description: body.description?.trim() || null,
    location: body.location?.trim(),
    address: body.address?.trim() || null,
    city: body.city?.trim() || null,
    state: body.state?.trim() || null,
    property_type: body.property_type || body.propertyType || "Apartment",
    status: body.status || "available",
    price: toNumber(body.price),
    total_sqft: toNumber(body.total_sqft ?? body.sqft),
    bath: toInt(body.bath),
    bhk: toInt(body.bhk),
    latitude: toNumber(body.latitude),
    longitude: toNumber(body.longitude),
    amenities: parseStringArray(body.amenities),
    images: [...existingImages, ...bodyImages, ...uploadedImages],
    agent_id: toInt(body.agent_id)
  };
}

export async function getListings(req, res, next) {
  try {
    const {
      q,
      location,
      city,
      minPrice,
      maxPrice,
      bhk,
      bath,
      propertyType,
      status,
      minSqft,
      maxSqft,
      sort = "newest"
    } = req.query;

    const params = [];
    const conditions = [];

    const addParam = value => {
      params.push(value);
      return `$${params.length}`;
    };

    if (q) conditions.push(`(l.title ILIKE ${addParam(`%${q}%`)} OR l.description ILIKE ${addParam(`%${q}%`)} OR l.location ILIKE ${addParam(`%${q}%`)})`);
    if (location) conditions.push(`l.location ILIKE ${addParam(`%${location}%`)}`);
    if (city) conditions.push(`l.city ILIKE ${addParam(`%${city}%`)}`);
    if (minPrice) conditions.push(`l.price >= ${addParam(Number(minPrice))}`);
    if (maxPrice) conditions.push(`l.price <= ${addParam(Number(maxPrice))}`);
    if (minSqft) conditions.push(`l.total_sqft >= ${addParam(Number(minSqft))}`);
    if (maxSqft) conditions.push(`l.total_sqft <= ${addParam(Number(maxSqft))}`);
    if (bhk) conditions.push(`l.bhk = ${addParam(Number(bhk))}`);
    if (bath) conditions.push(`l.bath >= ${addParam(Number(bath))}`);
    if (propertyType) conditions.push(`l.property_type = ${addParam(propertyType)}`);
    if (status) conditions.push(`l.status = ${addParam(status)}`);

    const orderBy = {
      priceAsc: "l.price ASC NULLS LAST",
      priceDesc: "l.price DESC NULLS LAST",
      oldest: 'l."createdAt" ASC',
      newest: 'l."createdAt" DESC'
    }[sort] || 'l."createdAt" DESC';

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const result = await pool.query(
      `${listingSelect()} ${where}
       GROUP BY l.id, u.id
       ORDER BY ${orderBy}`,
      params
    );

    res.json(result.rows.map(mapListing));
  } catch (error) {
    next(error);
  }
}

export async function getListingById(req, res, next) {
  try {
    const result = await pool.query(
      `${listingSelect()} WHERE l.id = $1 GROUP BY l.id, u.id`,
      [toInt(req.params.id)]
    );
    const listing = mapListing(result.rows[0]);
    if (!listing) return res.status(404).json({ error: "Listing not found." });
    res.json(listing);
  } catch (error) {
    next(error);
  }
}

export async function createListing(req, res, next) {
  try {
    const validationError = requireFields(req.body, ["title", "location", "price"]);
    if (validationError) return res.status(400).json({ error: validationError });

    const data = normalizeListingPayload(req.body, req);
    const agentId = data.agent_id || req.user?.id || null;
    const result = await pool.query(
      `INSERT INTO listings
       (title, description, location, address, city, state, property_type, status, price, total_sqft,
        bath, bhk, latitude, longitude, images, amenities, agent_id, "createdAt", "updatedAt")
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,NOW(),NOW())
       RETURNING *`,
      [data.title, data.description, data.location, data.address, data.city, data.state, data.property_type,
        data.status, data.price, data.total_sqft, data.bath, data.bhk, data.latitude, data.longitude,
        data.images, data.amenities, agentId]
    );

    res.status(201).json(mapListing(result.rows[0]));
  } catch (error) {
    next(error);
  }
}

export async function updateListing(req, res, next) {
  try {
    const existing = await pool.query(`SELECT * FROM listings WHERE id = $1`, [toInt(req.params.id)]);
    if (existing.rows.length === 0) return res.status(404).json({ error: "Listing not found." });

    if (req.user.role === "agent" && existing.rows[0].agent_id && existing.rows[0].agent_id !== req.user.id) {
      return res.status(403).json({ error: "Agents can only update their own listings." });
    }

    const data = normalizeListingPayload(req.body, req);
    const current = existing.rows[0];
    const images = data.images.length > 0 ? data.images : current.images;

    const result = await pool.query(
      `UPDATE listings SET
        title = COALESCE($1, title),
        description = $2,
        location = COALESCE($3, location),
        address = $4,
        city = $5,
        state = $6,
        property_type = COALESCE($7, property_type),
        status = COALESCE($8, status),
        price = COALESCE($9, price),
        total_sqft = COALESCE($10, total_sqft),
        bath = COALESCE($11, bath),
        bhk = COALESCE($12, bhk),
        latitude = $13,
        longitude = $14,
        images = $15,
        amenities = $16,
        agent_id = COALESCE($17, agent_id),
        "updatedAt" = NOW()
       WHERE id = $18
       RETURNING *`,
      [data.title, data.description, data.location, data.address, data.city, data.state, data.property_type,
        data.status, data.price, data.total_sqft, data.bath, data.bhk, data.latitude, data.longitude,
        images, data.amenities.length ? data.amenities : current.amenities, data.agent_id, toInt(req.params.id)]
    );

    res.json(mapListing(result.rows[0]));
  } catch (error) {
    next(error);
  }
}

export async function deleteListing(req, res, next) {
  try {
    const result = await pool.query(`DELETE FROM listings WHERE id = $1 RETURNING id`, [toInt(req.params.id)]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Listing not found." });
    res.json({ message: "Listing deleted successfully." });
  } catch (error) {
    next(error);
  }
}

export async function toggleFavorite(req, res, next) {
  try {
    const listingId = toInt(req.params.id);
    const existing = await pool.query(
      `SELECT id FROM favorites WHERE user_id = $1 AND listing_id = $2`,
      [req.user.id, listingId]
    );

    if (existing.rows.length > 0) {
      await pool.query(`DELETE FROM favorites WHERE id = $1`, [existing.rows[0].id]);
      return res.json({ favorited: false });
    }

    await pool.query(`INSERT INTO favorites (user_id, listing_id) VALUES ($1, $2)`, [req.user.id, listingId]);
    res.status(201).json({ favorited: true });
  } catch (error) {
    next(error);
  }
}

export async function getFavorites(req, res, next) {
  try {
    const result = await pool.query(
      `${listingSelect()} INNER JOIN favorites f ON f.listing_id = l.id
       WHERE f.user_id = $1
       GROUP BY l.id, u.id, f.created_at
       ORDER BY f.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows.map(mapListing));
  } catch (error) {
    next(error);
  }
}

export async function createBooking(req, res, next) {
  try {
    const validationError = requireFields(req.body, ["visit_at"]);
    if (validationError) return res.status(400).json({ error: validationError });

    const result = await pool.query(
      `INSERT INTO bookings (user_id, listing_id, visit_at, message)
       VALUES ($1, $2, $3, $4)
       RETURNING id, listing_id AS "listingId", visit_at AS "visitAt", message, status, created_at AS "createdAt"`,
      [req.user.id, toInt(req.params.id), req.body.visit_at, req.body.message || null]
    );

    await pool.query(
      `INSERT INTO notifications (user_id, title, body, type)
       VALUES ($1, 'Visit requested', 'Your property visit request was created.', 'booking')`,
      [req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
}

export async function getBookings(req, res, next) {
  try {
    const isStaff = ["admin", "agent"].includes(req.user.role);
    const result = await pool.query(
      `SELECT b.id, b.visit_at AS "visitAt", b.message, b.status, b.created_at AS "createdAt",
        l.id AS "listingId", l.title, l.location, l.price, u.name AS "buyerName", u.email AS "buyerEmail"
       FROM bookings b
       JOIN listings l ON l.id = b.listing_id
       JOIN users u ON u.id = b.user_id
       WHERE ${isStaff ? "(l.agent_id = $1 OR $2 = 'admin')" : "b.user_id = $1"}
       ORDER BY b.created_at DESC`,
      isStaff ? [req.user.id, req.user.role] : [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
}

export async function updateBookingStatus(req, res, next) {
  try {
    const allowed = ["pending", "confirmed", "completed", "cancelled"];
    if (!allowed.includes(req.body.status)) return res.status(400).json({ error: "Invalid booking status." });

    const result = await pool.query(
      `UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [req.body.status, toInt(req.params.id)]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Booking not found." });
    res.json({ message: "Booking updated.", booking: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

export async function createReview(req, res, next) {
  try {
    const rating = toInt(req.body.rating);
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: "Rating must be between 1 and 5." });

    const result = await pool.query(
      `INSERT INTO reviews (user_id, listing_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, listing_id)
       DO UPDATE SET rating = EXCLUDED.rating, comment = EXCLUDED.comment, updated_at = NOW()
       RETURNING id, rating, comment, created_at AS "createdAt", updated_at AS "updatedAt"`,
      [req.user.id, toInt(req.params.id), rating, req.body.comment || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
}

export async function getReviews(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT r.id, r.rating, r.comment, r.created_at AS "createdAt", u.name AS "userName"
       FROM reviews r JOIN users u ON u.id = r.user_id
       WHERE r.listing_id = $1
       ORDER BY r.created_at DESC`,
      [toInt(req.params.id)]
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
}
