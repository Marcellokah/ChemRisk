"use client";

import React from "react";
import { ExtractedData } from "../types";

interface ResultsClientProps {
  data: ExtractedData;
}

export default function ResultsClient({ data }: ResultsClientProps) {
  const handleExportCSV = () => {
    // AC3: Terméknév;CAS;H-mondatok
    // Construct CSV content with BOM for UTF-8 Excel compatibility
    const BOM = "\uFEFF";
    const header = "Terméknév;CAS;H-mondatok\n";
    
    // For simplicity, taking the first ingredient's CAS and joining H-statements
    const casNumbers = data.ingredients.map(ing => ing.casNumber).join(", ");
    const hStatements = data.hStatements.map(h => h.split(":")[0]).join(", ");
    
    // Use quotes if the fields contain semicolon or newline
    const escapeCsv = (val: string) => `"${val.replace(/"/g, '""')}"`;
    
    const row = `${escapeCsv(data.productName)};${escapeCsv(casNumbers)};${escapeCsv(hStatements)}\n`;
    const csvContent = BOM + header + row;
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `chemrisk_export_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExportCSV}
      className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition flex items-center space-x-2 shadow-sm"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      <span>Exportálás CSV-be</span>
    </button>
  );
}
