import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";
import { ExtractedData } from "../../types";

export const dynamic = "force-dynamic";

const DATA_DIR = path.join(process.cwd(), "data");
const FILES_INDEX = path.join(DATA_DIR, "files.json");

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Load all files metadata
function loadFilesIndex(): Array<{ id: string; fileName: string; uploadDate: string; data: ExtractedData }> {
  ensureDataDir();
  if (!fs.existsSync(FILES_INDEX)) {
    return [];
  }
  try {
    const content = fs.readFileSync(FILES_INDEX, "utf-8");
    return JSON.parse(content);
  } catch {
    return [];
  }
}

// Save files metadata
function saveFilesIndex(files: Array<{ id: string; fileName: string; uploadDate: string; data: ExtractedData }>) {
  ensureDataDir();
  fs.writeFileSync(FILES_INDEX, JSON.stringify(files, null, 2));
}

// GET: Retrieve all files
export async function GET() {
  try {
    const files = loadFilesIndex();
    return NextResponse.json({ files }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Hiba a fájlok lekérésekor" }, { status: 500 });
  }
}

// POST: Save a new file
export async function POST(request: NextRequest) {
  try {
    const { fileName, data } = await request.json();

    if (!fileName || !data) {
      return NextResponse.json(
        { error: "Hiányzó fileName vagy data" },
        { status: 400 }
      );
    }

    const files = loadFilesIndex();
    const id = Date.now().toString();
    const newFile = {
      id,
      fileName,
      uploadDate: new Date().toISOString(),
      data,
    };

    files.push(newFile);
    saveFilesIndex(files);

    return NextResponse.json({ file: newFile }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Hiba a fájl mentésekor" }, { status: 500 });
  }
}

// DELETE: Delete a file by ID
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Hiányzó id" }, { status: 400 });
    }

    const files = loadFilesIndex();
    const filteredFiles = files.filter((f) => f.id !== id);

    if (filteredFiles.length === files.length) {
      return NextResponse.json({ error: "Fájl nem található" }, { status: 404 });
    }

    saveFilesIndex(filteredFiles);
    return NextResponse.json({ message: "Fájl törölve" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Hiba a fájl törlésekor" }, { status: 500 });
  }
}
