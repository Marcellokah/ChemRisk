import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";
import { ExtractedData } from "../../types";
import { getUserFilesIndex } from "../../lib/dataPaths";
import { parseToken } from "../../lib/auth";

export const dynamic = "force-dynamic";

// Get user ID from request
function getUserId(request: NextRequest): string | null {
  const token = request.cookies.get("auth_token")?.value;
  if (!token) return null;
  const parsed = parseToken(token);
  return parsed?.userId || null;
}

// Ensure user data directory exists
function ensureUserDataDir(userId: string) {
  const userDir = path.dirname(getUserFilesIndex(userId));
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }
}

// Load user files metadata
function loadFilesIndex(userId: string): Array<{ id: string; fileName: string; uploadDate: string; data: ExtractedData }> {
  ensureUserDataDir(userId);
  const filesIndex = getUserFilesIndex(userId);
  if (!fs.existsSync(filesIndex)) {
    return [];
  }
  try {
    const content = fs.readFileSync(filesIndex, "utf-8");
    return JSON.parse(content);
  } catch {
    return [];
  }
}

// Save user files metadata
function saveFilesIndex(userId: string, files: Array<{ id: string; fileName: string; uploadDate: string; data: ExtractedData }>) {
  ensureUserDataDir(userId);
  const filesIndex = getUserFilesIndex(userId);
  fs.writeFileSync(filesIndex, JSON.stringify(files, null, 2));
}

// GET: Retrieve user's files
export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Bejelentkezés szükséges" }, { status: 401 });
    }
    const files = loadFilesIndex(userId);
    return NextResponse.json({ files }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Hiba a fájlok lekérésekor" }, { status: 500 });
  }
}

// POST: Save a new file
export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Bejelentkezés szükséges" }, { status: 401 });
    }

    const { fileName, data } = await request.json();

    if (!fileName || !data) {
      return NextResponse.json(
        { error: "Hiányzó fileName vagy data" },
        { status: 400 }
      );
    }

    const files = loadFilesIndex(userId);
    const id = Date.now().toString();
    const newFile = {
      id,
      fileName,
      uploadDate: new Date().toISOString(),
      data,
    };

    files.push(newFile);
    saveFilesIndex(userId, files);

    return NextResponse.json({ file: newFile }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Hiba a fájl mentésekor" }, { status: 500 });
  }
}

// DELETE: Delete a file by ID
export async function DELETE(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Bejelentkezés szükséges" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Hiányzó id" }, { status: 400 });
    }

    const files = loadFilesIndex(userId);
    const filteredFiles = files.filter((f) => f.id !== id);

    if (filteredFiles.length === files.length) {
      return NextResponse.json({ error: "Fájl nem található" }, { status: 404 });
    }

    saveFilesIndex(userId, filteredFiles);
    return NextResponse.json({ message: "Fájl törölve" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Hiba a fájl törlésekor" }, { status: 500 });
  }
}
