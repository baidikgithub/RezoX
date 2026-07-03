import { pool } from "../config/db.js";

function formatListingRow(row) {
  if (!row) return null;
  return {
    ...row,
    price: row.price !== null ? Number(row.price) : null,
    total_sqft: row.total_sqft !== null ? Number(row.total_sqft) : null,
    bath: row.bath !== null ? Number(row.bath) : null,
    bhk: row.bhk !== null ? Number(row.bhk) : null,
  };
}

function castListingData(data) {
  const casted = { ...data };

  if (casted.price !== undefined && casted.price !== null && casted.price !== "") {
    casted.price = Number(casted.price);
    if (Number.isNaN(casted.price)) casted.price = null;
  } else {
    casted.price = null;
  }

  if (casted.total_sqft !== undefined && casted.total_sqft !== null && casted.total_sqft !== "") {
    casted.total_sqft = Number(casted.total_sqft);
    if (Number.isNaN(casted.total_sqft)) casted.total_sqft = null;
  } else {
    casted.total_sqft = null;
  }

  if (casted.bath !== undefined && casted.bath !== null && casted.bath !== "") {
    casted.bath = parseInt(casted.bath, 10);
    if (Number.isNaN(casted.bath)) casted.bath = null;
  } else {
    casted.bath = null;
  }

  if (casted.bhk !== undefined && casted.bhk !== null && casted.bhk !== "") {
    casted.bhk = parseInt(casted.bhk, 10);
    if (Number.isNaN(casted.bhk)) casted.bhk = null;
  } else {
    casted.bhk = null;
  }

  if (typeof casted.amenities === "string") {
    try {
      const parsed = JSON.parse(casted.amenities);
      casted.amenities = Array.isArray(parsed)
        ? parsed
        : casted.amenities.split(",").map(item => item.trim()).filter(Boolean);
    } catch (_error) {
      casted.amenities = casted.amenities.split(",").map(item => item.trim()).filter(Boolean);
    }
  }

  if (!Array.isArray(casted.amenities)) {
    casted.amenities = [];
  }

  if (!Array.isArray(casted.images)) {
    casted.images = [];
  }

  return casted;
}

class Listing {
  static async find(query = {}) {
    let sql = 'SELECT id as "_id", title, location, price, total_sqft, bath, bhk, images, amenities, "createdAt" FROM listings';
    const params = [];
    const conditions = [];

    if (query.location) {
      const regexVal = query.location.$regex || query.location;
      params.push(`%${regexVal}%`);
      conditions.push(`location ILIKE $${params.length}`);
    }

    if (query.price) {
      if (query.price.$gte !== undefined) {
        params.push(query.price.$gte);
        conditions.push(`price >= $${params.length}`);
      }
      if (query.price.$lte !== undefined) {
        params.push(query.price.$lte);
        conditions.push(`price <= $${params.length}`);
      }
    }

    if (query.bhk !== undefined) {
      params.push(query.bhk);
      conditions.push(`bhk = $${params.length}`);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY "createdAt" DESC';

    const res = await pool.query(sql, params);
    return res.rows.map(formatListingRow);
  }

  static async findById(id) {
    const intId = parseInt(id, 10);
    if (Number.isNaN(intId)) return null;

    const res = await pool.query(
      'SELECT id as "_id", title, location, price, total_sqft, bath, bhk, images, amenities, "createdAt" FROM listings WHERE id = $1',
      [intId]
    );
    return formatListingRow(res.rows[0]);
  }

  static async create(data) {
    const casted = castListingData(data);
    const { title, location, price, total_sqft, bath, bhk, images, amenities } = casted;

    const res = await pool.query(
      `INSERT INTO listings (title, location, price, total_sqft, bath, bhk, images, amenities, "createdAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       RETURNING id as "_id", title, location, price, total_sqft, bath, bhk, images, amenities, "createdAt"`,
      [title, location, price, total_sqft, bath, bhk, images, amenities]
    );
    return formatListingRow(res.rows[0]);
  }

  static async findByIdAndUpdate(id, data, options = {}) {
    const intId = parseInt(id, 10);
    if (Number.isNaN(intId)) return null;

    const casted = castListingData(data);
    const { title, location, price, total_sqft, bath, bhk, images, amenities } = casted;

    const fields = [];
    const params = [];

    const fieldsToUpdate = { title, location, price, total_sqft, bath, bhk, images, amenities };
    for (const [key, value] of Object.entries(fieldsToUpdate)) {
      if (value !== undefined) {
        params.push(value);
        fields.push(`"${key}" = $${params.length}`);
      }
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    params.push(intId);
    const sql = `UPDATE listings SET ${fields.join(', ')} WHERE id = $${params.length} RETURNING id as "_id", title, location, price, total_sqft, bath, bhk, images, amenities, "createdAt"`;

    const res = await pool.query(sql, params);
    return formatListingRow(res.rows[0]);
  }
}

export default Listing;
