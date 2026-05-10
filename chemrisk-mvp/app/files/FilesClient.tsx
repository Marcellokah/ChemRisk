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
      <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
        <p className="text-slate-500 mb-4">Még nincsenek feltöltött fájlok</p>
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
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
          className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-300 transition-colors"
        >
          {/* File Header */}
          <div
            className="px-6 py-4 cursor-pointer hover:bg-slate-50 transition-colors"
            onClick={() =>
              setExpandedId(expandedId === file.id ? null : file.id)
            }
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <svg
                    className={`w-5 h-5 text-blue-600 transition-transform ${
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
                    <h3 className="font-semibold text-slate-900">
                      {file.fileName}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {file.data.productName}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">
                  {formatDate(file.uploadDate)}
                </p>
              </div>
            </div>
          </div>

          {/* File Details (Expanded) */}
          {expandedId === file.id && (
            <div className="border-t border-slate-200 px-6 py-4 bg-slate-50">
              {/* Product Name */}
              <div className="mb-6">
                <h4 className="font-semibold text-slate-900 mb-2">
                  Terméknév
                </h4>
                <p className="text-slate-700">{file.data.productName}</p>
              </div>

              {/* Ingredients */}
              {file.data.ingredients.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-slate-900 mb-2">
                    Összetevők ({file.data.ingredients.length})
                  </h4>
                  <div className="space-y-2">
                    {file.data.ingredients.map((ingredient, idx) => (
                      <div key={idx} className="text-sm bg-white p-3 rounded border border-slate-200">
                        <div className="font-medium text-slate-900">
                          {ingredient.name}
                        </div>
                        <div className="text-slate-600">
                          CAS: {ingredient.casNumber}
                        </div>
                        <div className="text-slate-600">
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
                  <h4 className="font-semibold text-slate-900 mb-2">
                    Veszélyességi osztályok
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {file.data.hazardClasses.map((hazard, idx) => (
                      <span
                        key={idx}
                        className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
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
                  <h4 className="font-semibold text-slate-900 mb-2">
                    H-mondatok
                  </h4>
                  <ul className="space-y-1 text-sm text-slate-700">
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
                  <h4 className="font-semibold text-slate-900 mb-2">
                    P-mondatok
                  </h4>
                  <ul className="space-y-1 text-sm text-slate-700">
                    {file.data.pStatements.map((statement, idx) => (
                      <li key={idx} className="ml-4">
                        • {statement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => handleDelete(file.id)}
                  disabled={deleting === file.id}
                  className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 px-4 py-2 rounded-md transition-colors font-medium text-sm"
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
                  className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-md transition-colors font-medium text-sm"
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
