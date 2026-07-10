import { google } from "googleapis";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let authClient = null;

/**
 * Loads the Google service account credentials and returns an authenticated JWT client.
 * Credentials are loaded from server/config/credentials.json by default,
 * or from the path specified in GOOGLE_APPLICATION_CREDENTIALS env var.
 */
function getAuthClient() {
  if (authClient) return authClient;

  const credPath =
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    resolve(__dirname, "..", "..", "config", "credentials.json");

  let credentials;
  try {
    const raw = readFileSync(credPath, "utf-8");
    credentials = JSON.parse(raw);
  } catch (err) {
    throw new Error(
      `Failed to load Google credentials from ${credPath}: ${err.message}`
    );
  }

  authClient = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });

  return authClient;
}

/**
 * Downloads a file from Google Drive using the Drive API v3.
 *
 * @param {string} fileId - The Google Drive file ID to download.
 * @returns {Promise<string>} The raw text content of the file.
 */
export async function downloadDriveFile(fileId) {
  if (!fileId || typeof fileId !== "string") {
    throw new Error("A valid Google Drive file ID is required.");
  }

  const auth = getAuthClient();
  const drive = google.drive({ version: "v3", auth });

  const response = await drive.files.get(
    { fileId, alt: "media" },
    { responseType: "stream", timeout: 120000 }
  );

  const chunks = [];
  for await (const chunk of response.data) {
    chunks.push(chunk);
  }

  const buffer = Buffer.concat(chunks);
  const text = buffer.toString("utf-8");

  if (!text.trim()) {
    throw new Error(`Downloaded file (ID: ${fileId}) is empty.`);
  }

  return text;
}

/**
 * Verifies that the service account can authenticate and has access to the given file.
 * Useful for health checks and debugging.
 *
 * @param {string} fileId - The Google Drive file ID to verify access to.
 * @returns {Promise<{ok: boolean, name?: string, mimeType?: string, error?: string}>}
 */
export async function verifyDriveAccess(fileId) {
  try {
    const auth = getAuthClient();
    const drive = google.drive({ version: "v3", auth });

    const meta = await drive.files.get({
      fileId,
      fields: "name, mimeType, size",
    });

    return {
      ok: true,
      name: meta.data.name,
      mimeType: meta.data.mimeType,
      size: meta.data.size,
    };
  } catch (err) {
    return {
      ok: false,
      error: err.message,
    };
  }
}