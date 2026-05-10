"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("/api/files");
        if (response.status === 401) {
          router.push("/login");
          return;
        }
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
    <main className="app-shell text-[color:var(--foreground)]">
      <Header />

      <section className="app-container app-section">
        <div className="mb-8 max-w-3xl">
          <div className="app-kicker mb-4">Archívum</div>
          <h1 className="app-heading text-4xl font-semibold tracking-tight text-[color:var(--foreground)]">
            Dokumentumok kezelése
          </h1>
          <p className="mt-3 text-lg text-[color:var(--muted)]">
            Az összes feltöltött és feldolgozott fájl listája
          </p>
        </div>

        {loading ? (
          <div className="app-card p-10 text-center">
            <p className="text-[color:var(--muted)]">Fájlok betöltése...</p>
          </div>
        ) : error ? (
          <div className="app-card-soft border-[color:var(--danger-soft)] p-4 text-[color:var(--danger)]">
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
