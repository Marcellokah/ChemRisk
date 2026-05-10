"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ExtractedData } from "../types";

interface FileRecord {
  id: string;
  fileName: string;
  uploadDate: string;
  data: ExtractedData;
}

interface FilesClientProps {
  files: FileRecord[];
  onFilesChange: (files: FileRecord[]) => void;
}

export default function FilesClient({ files, onFilesChange }: FilesClientProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm("Biztosan törölni szeretné ezt a fájlt?")) {
      setDeleting(id);
      try {
        const response = await fetch(`/api/files?id=${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          onFilesChange(files.filter((f) => f.id !== id));
        } else {
          alert("Hiba a fájl törlése során");
        }
      } catch (error) {
        alert("Hiba a fájl törlése során");
      } finally {
        setDeleting(null);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("hu-HU", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (files.length === 0) {
    return (
      <div className="app-card-strong p-10 text-center">
        <p className="mb-4 text-[color:var(--muted)]">Még nincsenek feltöltött fájlok</p>
        <Link
          href="/"
          className="app-button-primary"
        >
          Első fájl feltöltése
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {files.map((file) => (
        <div
          key={file.id}
          className="app-card-strong overflow-hidden transition-transform duration-200 hover:-translate-y-0.5"
        >
          {/* File Header */}
          <div
            className="cursor-pointer px-6 py-4 transition-colors hover:bg-[color:var(--surface-soft)]"
            onClick={() =>
              setExpandedId(expandedId === file.id ? null : file.id)
            }
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <svg
                    className={`h-5 w-5 text-[color:var(--accent-strong)] transition-transform ${
                      expandedId === file.id ? "rotate-90" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-[color:var(--foreground)]">
                      {file.fileName}
                    </h3>
                    <p className="text-sm text-[color:var(--muted)]">
                      {file.data.productName}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-[color:var(--muted)]">
                  {formatDate(file.uploadDate)}
                </p>
              </div>
            </div>
          </div>

          {/* File Details (Expanded) */}
          {expandedId === file.id && (
            <div className="border-t border-[color:var(--border)] px-6 py-4 bg-[color:var(--surface-soft)]">
              {/* Product Name */}
              <div className="mb-6">
                <h4 className="mb-2 font-semibold text-[color:var(--foreground)]">
                  Terméknév
                </h4>
                <p className="text-[color:var(--foreground)]">{file.data.productName}</p>
              </div>

              {/* Ingredients */}
              {file.data.ingredients.length > 0 && (
                <div className="mb-6">
                  <h4 className="mb-2 font-semibold text-[color:var(--foreground)]">
                    Összetevők ({file.data.ingredients.length})
                  </h4>
                  <div className="space-y-2">
                    {file.data.ingredients.map((ingredient, idx) => (
                      <div key={idx} className="app-card-soft p-3 text-sm">
                        <div className="font-medium text-[color:var(--foreground)]">
                          {ingredient.name}
                        </div>
                        <div className="text-[color:var(--muted)]">
                          CAS: {ingredient.casNumber}
                        </div>
                        <div className="text-[color:var(--muted)]">
                          Koncentráció: {ingredient.concentration}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hazard Classes */}
              {file.data.hazardClasses.length > 0 && (
                <div className="mb-6">
                  <h4 className="mb-2 font-semibold text-[color:var(--foreground)]">
                    Veszélyességi osztályok
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {file.data.hazardClasses.map((hazard, idx) => (
                      <span
                        key={idx}
                        className="app-chip app-soft-warning"
                      >
                        {hazard}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* H-Statements */}
              {file.data.hStatements.length > 0 && (
                <div className="mb-6">
                  <h4 className="mb-2 font-semibold text-[color:var(--foreground)]">
                    H-mondatok
                  </h4>
                  <ul className="space-y-1 text-sm text-[color:var(--foreground)]">
                    {file.data.hStatements.map((statement, idx) => (
                      <li key={idx} className="ml-4">
                        • {statement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* P-Statements */}
              {file.data.pStatements.length > 0 && (
                <div className="mb-6">
                  <h4 className="mb-2 font-semibold text-[color:var(--foreground)]">
                    P-mondatok
                  </h4>
                  <ul className="space-y-1 text-sm text-[color:var(--foreground)]">
                    {file.data.pStatements.map((statement, idx) => (
                      <li key={idx} className="ml-4">
                        • {statement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-[color:var(--border)]">
                <button
                  onClick={() => handleDelete(file.id)}
                  disabled={deleting === file.id}
                  className="app-button-secondary flex-1 border-[color:var(--danger-soft)] text-[color:var(--danger)] hover:bg-[color:var(--danger-soft)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deleting === file.id ? "Törlés folyamatban..." : "Törlés"}
                </button>
                <button
                  onClick={() =>
                    sessionStorage.setItem(
                      "extractedData",
                      JSON.stringify([file.data])
                    )
                  }
                  className="app-button-secondary flex-1 border-[color:var(--accent-soft)] text-[color:var(--accent-strong)] hover:bg-[color:var(--accent-soft)]"
                >
                  <Link href="/results">Megtekintés</Link>
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
