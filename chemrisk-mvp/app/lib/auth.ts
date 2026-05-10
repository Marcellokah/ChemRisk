import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const UPLOADS_FILE = path.join(DATA_DIR, "uploads.json");

interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

interface UploadRecord {
  userId?: string;
  ipAddress: string;
  uploadDate: string; // ISO date (YYYY-MM-DD)
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Hash password
export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// Load users
export function loadUsers(): User[] {
  ensureDataDir();
  if (!fs.existsSync(USERS_FILE)) {
    return [];
  }
  try {
    const content = fs.readFileSync(USERS_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    return [];
  }
}

// Save users
function saveUsers(users: User[]) {
  ensureDataDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Find user by email
export function findUserByEmail(email: string): User | null {
  const users = loadUsers();
  return users.find((u) => u.email === email) || null;
}

// Create user
export function createUser(email: string, password: string): User | null {
  if (findUserByEmail(email)) {
    return null; // User already exists
  }

  const user: User = {
    id: crypto.randomUUID(),
    email,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  const users = loadUsers();
  users.push(user);
  saveUsers(users);
  return user;
}

// Verify password
export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// Load upload records
function loadUploadRecords(): UploadRecord[] {
  ensureDataDir();
  if (!fs.existsSync(UPLOADS_FILE)) {
    return [];
  }
  try {
    const content = fs.readFileSync(UPLOADS_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    return [];
  }
}

// Save upload records
function saveUploadRecords(records: UploadRecord[]) {
  ensureDataDir();
  fs.writeFileSync(UPLOADS_FILE, JSON.stringify(records, null, 2));
}

// Record upload
export function recordUpload(userId: string | undefined, ipAddress: string): void {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const records = loadUploadRecords();

  records.push({
    userId,
    ipAddress,
    uploadDate: today,
  });

  saveUploadRecords(records);
}

// Get today's upload count
export function getTodayUploadCount(userId?: string, ipAddress?: string): number {
  const today = new Date().toISOString().split("T")[0];
  const records = loadUploadRecords();

  if (userId) {
    return records.filter((r) => r.userId === userId && r.uploadDate === today).length;
  }

  if (ipAddress) {
    return records.filter((r) => !r.userId && r.ipAddress === ipAddress && r.uploadDate === today).length;
  }

  return 0;
}

// Get upload limit
export function getUploadLimit(userId?: string): number {
  return userId ? Infinity : 5; // Authenticated = unlimited, unauthenticated = 5
}

// Check if upload is allowed
export function canUpload(userId?: string, ipAddress?: string): { allowed: boolean; remaining: number } {
  const limit = getUploadLimit(userId);
  const count = getTodayUploadCount(userId, ipAddress);
  const remaining = limit === Infinity ? Infinity : Math.max(0, limit - count);

  return {
    allowed: count < limit,
    remaining,
  };
}

// Create JWT-like token (simple for MVP)
export function createToken(userId: string): string {
  const data = {
    userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
  };
  return Buffer.from(JSON.stringify(data)).toString("base64");
}

// Parse token
export function parseToken(token: string): { userId: string } | null {
  try {
    const data = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    if (data.exp && data.exp < Math.floor(Date.now() / 1000)) {
      return null; // Token expired
    }
    return { userId: data.userId };
  } catch {
    return null;
  }
}
