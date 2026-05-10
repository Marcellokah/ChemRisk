import * as path from "path";

export const DATA_DIR = path.resolve(
  process.env.CHEMRISK_DATA_DIR ?? path.join(process.cwd(), "data")
);

export const USERS_FILE = path.join(DATA_DIR, "users.json");
export const UPLOADS_FILE = path.join(DATA_DIR, "uploads.json");
export const FILES_INDEX = path.join(DATA_DIR, "files.json");