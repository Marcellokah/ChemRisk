import * as path from "path";

const defaultDataDir = process.env.VERCEL
  ? "/tmp/chemrisk-data"
  : path.join(process.cwd(), "data");

export const DATA_DIR = path.resolve(
  process.env.CHEMRISK_DATA_DIR ?? defaultDataDir
);

export const USERS_FILE = path.join(DATA_DIR, "users.json");
export const UPLOADS_FILE = path.join(DATA_DIR, "uploads.json");
export const FILES_INDEX = path.join(DATA_DIR, "files.json");

// Per-user file storage
export function getUserFilesDir(userId: string): string {
  return path.join(DATA_DIR, "users", userId);
}

export function getUserFilesIndex(userId: string): string {
  return path.join(getUserFilesDir(userId), "files.json");
}