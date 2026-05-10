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
          className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center bg-slate-50 hover:bg-slate-100 hover:border-blue-50 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex justify-center mb-4">
            {/* Cloud Icon SVG */}
            <svg
              className="w-16 h-16 text-slate-400"
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
          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            Nincs még feltöltött dokumentum
          </h3>
          <p className="text-slate-500 mb-6">
            Húzd ide a biztonsági adatlapokat (PDF), vagy kattints a tallózáshoz. Akár többet is kijelölhetsz.
          </p>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
            + Elemek hozzáadása
          </button>

          {/* Upload limit indicator */}
          {uploadLimit.limit !== Infinity && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-sm text-slate-600 mb-3">
                <span className="font-medium">{uploadLimit.remaining}/{uploadLimit.limit}</span> feltöltés marad ma
              </p>
              {!user && (
                <Link
                  href="/register"
                  className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition"
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
        <div className="border border-slate-200 rounded-xl p-8 shadow-sm bg-white">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600 font-bold">
              PDF
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-900">
                {state.fileNames.length === 1 ? state.fileNames[0] : `${state.fileNames.length} fájl kiválasztva`}
              </p>
              <p className="text-sm text-slate-500">
                {state.status === "UPLOADING"
                  ? "Feldolgozás alatt..."
                  : "Feldolgozás sikeres!"}
              </p>
            </div>
            {state.status === "SUCCESS" && (
              <div className="text-green-500 bg-green-50 p-2 rounded-full">
                {/* Check Icon */}
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
          <div className="w-full bg-slate-100 rounded-full h-2.5 mb-6 overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-300 ${
                state.status === "SUCCESS" ? "bg-green-500" : "bg-blue-600"
              }`}
              style={{ width: `${state.progress}%` }}
            ></div>
          </div>

          {state.status === "SUCCESS" && (
            <div className="flex justify-end">
              <button
                className="flex items-center px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
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
        <div className="border border-red-200 bg-red-50 rounded-xl p-8 text-center">
          <div className="flex justify-center mb-4">
            {/* X Icon */}
            <svg
              className="w-12 h-12 text-red-500"
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
          <h3 className="text-lg font-bold text-red-800 mb-2">
            Hiba történt a feldolgozás során
          </h3>
          <p className="text-red-600 mb-6">{state.errorMessage}</p>

          <button
            onClick={handleReset}
            className="px-6 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-100 transition"
          >
            Újra megpróbálom
          </button>
        </div>
      )}
    </div>
  );
}