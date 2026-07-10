import axios from "axios";
import csvParser from "csv-parser";
import { Readable } from "stream";
import { once } from "events";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { downloadDriveFile } from "./googleDriveService.js";

const prisma = new PrismaClient();

const normalizeHeader = (header) =>
  String(header || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const normalizeText = (value) => {
  if (value === null || value === undefined) return "";
  return String(value).toString().trim();
};

const normalizeNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(String(value).replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
};

const normalizeList = (value) => {
  if (!value) return [];
  const text = normalizeText(value);
  if (!text) return [];
  return text
    .split(/[|,;]/)
    .map((item) => item.trim())
    .filter(Boolean);
};

/**
 * Determines the download method and returns the CSV text content.
 *
 * Priority:
 * 1. If sourceUrl is a raw file ID (alphanumeric, 20+ chars) → Google Drive API
 * 2. If sourceUrl is a Google Drive URL → Google Drive API
 * 3. Otherwise → download via public HTTP GET
 */
async function downloadCsvText(sourceUrl) {
  if (!sourceUrl) {
    throw new Error("CSV source URL is not configured. Set CSV_URL or GOOGLE_DRIVE_FILE_ID.");
  }

  const trimmed = sourceUrl.trim();

  // --- Detect if this is a raw Google Drive file ID ---
  const isRawFileId = /^[a-zA-Z0-9_-]{20,}$/.test(trimmed);
  if (isRawFileId) {
    console.log(`Using Google Drive API to download file ID: ${trimmed}`);
    return await downloadDriveFile(trimmed);
  }

  // --- Detect if this is a Google Drive share URL ---
  const driveIdMatch = trimmed.match(/\/file\/d\/([^/]+)/i);
  if (driveIdMatch) {
    console.log(`Extracted Drive file ID from URL: ${driveIdMatch[1]}, using Google Drive API`);
    return await downloadDriveFile(driveIdMatch[1]);
  }

  if (trimmed.includes("drive.google.com") && trimmed.includes("id=")) {
    const id = new URL(trimmed).searchParams.get("id");
    if (id) {
      console.log(`Extracted Drive file ID from URL: ${id}, using Google Drive API`);
      return await downloadDriveFile(id);
    }
  }

  // --- Fallback: download via public HTTP ---
  console.log(`Downloading CSV from public URL: ${trimmed}`);
  const response = await axios.get(trimmed, {
    responseType: "arraybuffer",
    timeout: 120000,
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });

  const csvText = Buffer.from(response.data, "binary").toString("utf8");
  if (!csvText.trim()) {
    throw new Error("Downloaded CSV is empty.");
  }
  return csvText;
}

const parseCsvText = async (csvText) => {
  const rows = [];
  const parser = csvParser({ trim: true, skipEmptyLines: true });

  parser.on("data", (row) => rows.push(row));

  const parserPromise = once(parser, "end");
  Readable.from([csvText]).pipe(parser);
  await parserPromise;

  return rows;
};

const mapCsvRow = (row) => {
  const normalized = {};
  Object.entries(row || {}).forEach(([key, value]) => {
    const normalizedKey = normalizeHeader(key);
    if (normalizedKey) normalized[normalizedKey] = value;
  });

  const title = normalizeText(
    normalized.title ||
      normalized.property_name ||
      normalized.name ||
      normalized.listing_title ||
      normalized.property_title ||
      normalized.address
  );
  const location = normalizeText(
    normalized.location || normalized.area || normalized.locality || normalized.address || normalized.name
  );
  const address = normalizeText(normalized.address || normalized.full_address || normalized.house_address);
  const city = normalizeText(normalized.city || normalized.city_name);
  const state = normalizeText(normalized.state || normalized.state_name);
  const propertyType = normalizeText(
    normalized.property_type || normalized.type || normalized.category || normalized.property_category || "Apartment"
  );
  const status = normalizeText(normalized.status || "available");
  const price = normalizeNumber(normalized.price || normalized.sale_price || normalized.asking_price || normalized.price_in_lakhs);
  const totalSqft = normalizeNumber(normalized.total_sqft || normalized.sqft || normalized.area_sqft || normalized.build_up_area);
  const bath = normalizeNumber(normalized.bath || normalized.bathrooms || normalized.bath_room);
  const bhk = normalizeNumber(normalized.bhk || normalized.bedrooms || normalized.bed_room);
  const latitude = normalizeNumber(normalized.latitude);
  const longitude = normalizeNumber(normalized.longitude);
  const description = normalizeText(normalized.description || normalized.about || normalized.summary);
  const amenities = normalizeList(normalized.amenities || normalized.amenity);
  const images = normalizeList(normalized.images || normalized.image_url || normalized.image_urls);

  const sourceKey = crypto
    .createHash("sha256")
    .update(
      JSON.stringify([
        title || "",
        location || "",
        address || "",
        city || "",
        state || "",
        propertyType || "",
        price ?? "",
        totalSqft ?? "",
        bath ?? "",
        bhk ?? ""
      ])
    )
    .digest("hex");

  return {
    title: title || location || "Imported Listing",
    description: description || null,
    location: location || null,
    address: address || null,
    city: city || null,
    state: state || null,
    property_type: propertyType || "Apartment",
    status,
    price,
    total_sqft: totalSqft,
    bath: bath ? Math.round(bath) : null,
    bhk: bhk ? Math.round(bhk) : null,
    latitude,
    longitude,
    images,
    amenities,
    source_key: sourceKey
  };
};

export async function importListingsFromCsv(options = {}) {
  const sourceUrl = options.sourceUrl || process.env.CSV_URL || process.env.GOOGLE_DRIVE_FILE_ID;

  // Use Google Drive API for Drive file IDs, otherwise public download
  const csvText = await downloadCsvText(sourceUrl);

  const rows = await parseCsvText(csvText);
  const normalizedRows = rows.map(mapCsvRow).filter((row) => row.title && row.location);

  if (normalizedRows.length === 0) {
    return { imported: 0, updated: 0, skipped: rows.length, sourceUrl };
  }

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const row of normalizedRows) {
    try {
      const existing = await prisma.listing.findUnique({
        where: { source_key: row.source_key }
      });

      if (existing) {
        await prisma.listing.update({
          where: { id: existing.id },
          data: {
            title: row.title,
            description: row.description,
            location: row.location,
            address: row.address,
            city: row.city,
            state: row.state,
            property_type: row.property_type,
            status: row.status,
            price: row.price,
            total_sqft: row.total_sqft,
            bath: row.bath,
            bhk: row.bhk,
            latitude: row.latitude,
            longitude: row.longitude,
            images: row.images,
            amenities: row.amenities,
            source_key: row.source_key
          }
        });
        updated += 1;
      } else {
        await prisma.listing.create({
          data: {
            title: row.title,
            description: row.description,
            location: row.location,
            address: row.address,
            city: row.city,
            state: row.state,
            property_type: row.property_type,
            status: row.status,
            price: row.price,
            total_sqft: row.total_sqft,
            bath: row.bath,
            bhk: row.bhk,
            latitude: row.latitude,
            longitude: row.longitude,
            images: row.images,
            amenities: row.amenities,
            source_key: row.source_key
          }
        });
        created += 1;
      }
    } catch (error) {
      console.error("CSV import row failed:", error.message || error);
      skipped += 1;
    }
  }

  return {
    imported: created,
    updated,
    skipped,
    totalRows: normalizedRows.length,
    sourceUrl
  };
}

export async function ensureImportSchema() {
  await prisma.$executeRawUnsafe(`ALTER TABLE "listings" ADD COLUMN IF NOT EXISTS source_key TEXT;`);
  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS idx_listings_source_key ON "listings" (source_key);`);
}