"use client";

import React, { useState, useRef } from "react";
import { UploadState } from "../types";

export default function SDSUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State initialization
  const [state, setState] = useState<UploadState>({
    status: "IDLE",
    fileName: null,
    progress: 0,
  });

  // --- Logic Helpers ---

  const validateFile = (file: File): string | null => {
    // AC2: Formátum validáció
    if (file.type !== "application/pdf") {
      return "Csak PDF formátumú biztonsági adatlap tölthető fel.";
    }
    // AC3: Méret validáció (20MB)
    if (file.size > 20 * 1024 * 1024) {
      return "A fájl mérete nem haladhatja meg a 20MB-ot.";
    }
    return null;
  };

  const simulateUpload = (file: File) => {
    const error = validateFile(file);
    if (error) {
      setState({
        status: "ERROR",
        fileName: file.name,
        progress: 0,
        errorMessage: error,
      });
      return;
    }

    // Happy Path indítása (US-01 / AC1)
    setState({ status: "UPLOADING", fileName: file.name, progress: 0 });

    // Mock progress simulation (Backend hívás helyett)
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setState((prev) => ({ ...prev, progress }));

      if (progress >= 100) {
        clearInterval(interval);
        setState((prev) => ({ ...prev, status: "SUCCESS" }));
      }
    }, 300); // 300ms * 10 = 3 mp szimulált feldolgozás
  };

  // --- Event Handlers ---

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      simulateUpload(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      simulateUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Kötelező a drop engedélyezéséhez
  };

  const handleReset = () => {
    setState({ status: "IDLE", fileName: null, progress: 0 });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --- Render States (Wireframe-ek alapján) ---

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Rejtett input */}
      <input
        type="file"
        accept=".pdf"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* STATE: IDLE (Wireframe 01) */}
      {state.status === "IDLE" && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center bg-slate-50 hover:bg-slate-100 hover:border-blue-500 transition-colors cursor-pointer"
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
            Húzd ide a biztonsági adatlapot (PDF), vagy kattints a tallózáshoz.
          </p>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
            + Új elem hozzáadása
          </button>
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
              <p className="font-medium text-slate-900">{state.fileName}</p>
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
                onClick={() =>
                  alert("US-02: Tovább az adatok ellenőrzésére... (Sprint 3)")
                }
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