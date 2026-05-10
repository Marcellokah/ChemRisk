"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UploadState } from "../types";
import { useAuth } from "../context/AuthContext";

export default function SDSUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { user, uploadLimit, checkUpload } = useAuth();

  // State initialization
  const [state, setState] = useState<UploadState>({
    status: "IDLE",
    fileNames: [],
    progress: 0,
  });

  // Check upload limit on mount
  useEffect(() => {
    checkUpload();
  }, [checkUpload]);

  // --- Logic Helpers ---

  const validateFile = (file: File): string | null => {
    // AC2: Formátum validáció
    if (file.type !== "application/pdf") {
      return "Csak PDF formátumú biztonsági adatlap tölthető fel.";
    }
    // AC3: Méret validáció (20MB)
    if (file.size > 20 * 1024 * 1024) {
      return "Egy fájl mérete sem haladhatja meg a 20MB-ot.";
    }
    return null;
  };

  const simulateUpload = async (files: File[]) => {
    if (files.length === 0) return;

    // Check upload limit
    if (!uploadLimit.allowed) {
      setState({
        status: "ERROR",
        fileNames: files.map(f => f.name),
        progress: 0,
        errorMessage: user 
          ? "Szerverhiba történt. Próbálkozz később."
          : "Elérted a napi 5 feltöltési limitet. Holnap újrapróbálhatsz vagy regisztrálj az unlimited feltöltéshez.",
      });
      return;
    }

    for (const file of files) {
      const error = validateFile(file);
      if (error) {
        setState({
          status: "ERROR",
          fileNames: files.map(f => f.name),
          progress: 0,
          errorMessage: `${file.name}: ${error}`,
        });
        return;
      }
    }

    // Happy Path indítása (US-01 / AC1 + Bulk)
    setState({ status: "UPLOADING", fileNames: files.map(f => f.name), progress: 0 });

    // Progress simulation while waiting for backend
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress > 90) progress = 90; // Capped at 90% until response
      setState((prev) => ({ ...prev, progress }));
    }, 300);

    try {
      const results = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);

          const response = await fetch("/api/extract", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || `Hiba a szerver oldalon ennél a fájlnál: ${file.name}`);
          }

          const result = await response.json();
          // Add fileName to the result data
          return { ...result.data, fileName: file.name };
        })
      );

      clearInterval(interval);
      
      // Save data for the results page (Array of ExtractedData)
      sessionStorage.setItem("extractedData", JSON.stringify(results));

      // Save each file to the persistent file database
      try {
        for (const result of results) {
          await fetch("/api/files", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fileName: result.fileName,
              data: result,
            }),
          });
        }
      } catch (err) {
        console.warn("Fájlok mentése sikertelen:", err);
        // Continue anyway - files were processed successfully
      }

      setState((prev) => ({ ...prev, progress: 100, status: "SUCCESS" }));
    } catch (err: any) {
      clearInterval(interval);
      setState({
        status: "ERROR",
        fileNames: files.map(f => f.name),
        progress: 0,
        errorMessage: err.message || "Hiba történt a fájlok feldolgozása során.",
      });
    }
  };

  // --- Event Handlers ---

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      simulateUpload(Array.from(e.target.files));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      simulateUpload(Array.from(e.dataTransfer.files));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Kötelező a drop engedélyezéséhez
  };

  const handleReset = () => {
    setState({ status: "IDLE", fileNames: [], progress: 0 });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --- Render States (Wireframe-ek alapján) ---

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Rejtett input */}
      <input
        type="file"
        accept=".pdf"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* STATE: IDLE (Wireframe 01) */}
      {state.status === "IDLE" && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="app-dropzone cursor-pointer p-8 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl sm:p-12"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)] shadow-inner shadow-sky-500/10">
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <h3 className="mt-5 text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">
            Nincs még feltöltött dokumentum
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-[color:var(--muted)]">
            Húzd ide a biztonsági adatlapokat (PDF), vagy kattints a tallózáshoz. Akár többet is kijelölhetsz.
          </p>
          <button className="app-button-primary mt-6">
            + Elemek hozzáadása
          </button>

          {/* Upload limit indicator */}
          {uploadLimit.limit !== Infinity && (
            <div className="mt-8 border-t border-[color:var(--border)] pt-6">
              <p className="mb-3 text-sm text-[color:var(--muted)]">
                <span className="font-semibold text-[color:var(--foreground)]">{uploadLimit.remaining}/{uploadLimit.limit}</span> feltöltés marad ma
              </p>
              {!user && (
                <Link
                  href="/register"
                  className="app-button-secondary"
                >
                  Regisztrálj az unlimited feltöltéshez →
                </Link>
              )}
            </div>
          )}
        </div>
      )}

      {/* STATE: UPLOADING / SUCCESS (Wireframe 02) */}
      {(state.status === "UPLOADING" || state.status === "SUCCESS") && (
        <div className="app-card-strong p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-4">
            <div className="rounded-2xl bg-[color:var(--accent-soft)] px-3 py-3 font-bold text-[color:var(--accent-strong)]">
              PDF
            </div>
            <div className="flex-1">
              <p className="font-medium text-[color:var(--foreground)]">
                {state.fileNames.length === 1 ? state.fileNames[0] : `${state.fileNames.length} fájl kiválasztva`}
              </p>
              <p className="text-sm text-[color:var(--muted)]">
                {state.status === "UPLOADING"
                  ? "Feldolgozás alatt..."
                  : "Feldolgozás sikeres!"}
              </p>
            </div>
            {state.status === "SUCCESS" && (
              <div className="rounded-full bg-[color:var(--success-soft)] p-2 text-[color:var(--success)]">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-6 h-2.5 w-full overflow-hidden rounded-full bg-[color:var(--surface-soft)]">
            <div
              className={`h-2.5 rounded-full transition-all duration-300 ${
                state.status === "SUCCESS" ? "bg-[color:var(--success)]" : "bg-[color:var(--accent)]"
              }`}
              style={{ width: `${state.progress}%` }}
            ></div>
          </div>

          {state.status === "SUCCESS" && (
            <div className="flex justify-end">
              <button
                className="app-button-primary"
                onClick={() => router.push("/results")}
              >
                Eredmények megtekintése →
              </button>
            </div>
          )}
        </div>
      )}

      {/* STATE: ERROR (Wireframe 03) */}
      {state.status === "ERROR" && (
        <div className="app-card-strong border-[color:var(--danger-soft)] bg-[color:var(--danger-soft)] p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--danger-soft)] text-[color:var(--danger)]">
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-bold text-[color:var(--danger)]">
            Hiba történt a feldolgozás során
          </h3>
          <p className="mb-6 text-[color:var(--danger)]">{state.errorMessage}</p>

          <button
            onClick={handleReset}
            className="app-button-secondary border-[color:var(--danger-soft)] text-[color:var(--danger)] hover:bg-[color:var(--danger-soft)]"
          >
            Újra megpróbálom
          </button>
        </div>
      )}
    </div>
  );
}