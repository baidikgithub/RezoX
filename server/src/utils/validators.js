export function requireFields(body, fields) {
  const missing = fields.filter(field => body[field] === undefined || body[field] === null || body[field] === "");
  if (missing.length > 0) {
    return `${missing.join(", ")} ${missing.length === 1 ? "is" : "are"} required.`;
  }
  return null;
}

export function toNumber(value, fallback = null) {
  if (value === undefined || value === null || value === "") return fallback;
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function toInt(value, fallback = null) {
  if (value === undefined || value === null || value === "") return fallback;
  const number = parseInt(value, 10);
  return Number.isFinite(number) ? number : fallback;
}

export function parseStringArray(value) {
  if (Array.isArray(value)) return value.map(String).map(item => item.trim()).filter(Boolean);
  if (typeof value !== "string") return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map(String).map(item => item.trim()).filter(Boolean);
  } catch (_error) {
    return value.split(",").map(item => item.trim()).filter(Boolean);
  }
  return [];
}
