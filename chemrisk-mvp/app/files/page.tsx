"use client";

import React, { useEffect, useState } from "react";
import FilesClient from "./FilesClient";
import Header from "../components/Header";
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
      <Header />

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
