"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import FilesClient from "./FilesClient";
import { ExtractedData } from "../types";

interface FileRecord {
  id: string;
  fileName: string;
  uploadDate: string;
  data: ExtractedData;
}

export default function FilesPage() {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("/api/files");
        if (!response.ok) throw new Error("Hiba a fájlok lekérésekor");
        const { files } = await response.json();
        setFiles(files);
      } catch (err: any) {
        setError(err.message || "Ismeretlen hiba történt");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white font-bold p-2 rounded">
              CR
            </div>
            <span className="text-xl font-bold tracking-tight">ChemRisk</span>
          </div>
          <nav className="hidden md:flex space-x-6 text-sm font-medium text-slate-600">
            <Link
              href="/files"
              className="text-blue-600 bg-blue-50 px-3 py-1 rounded-md"
            >
              Dokumentumok kezelése
            </Link>
            <Link href="/" className="hover:text-blue-600 my-auto">
              Feltöltés
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Dokumentumok kezelése
          </h1>
          <p className="text-lg text-slate-500">
            Az összes feltöltött és feldolgozott fájl listája
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-slate-500">Fájlok betöltése...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
            <p className="font-medium">Hiba</p>
            <p>{error}</p>
          </div>
        ) : (
          <FilesClient
            files={files}
            onFilesChange={(updatedFiles) => setFiles(updatedFiles)}
          />
        )}
      </section>
    </main>
  );
}
