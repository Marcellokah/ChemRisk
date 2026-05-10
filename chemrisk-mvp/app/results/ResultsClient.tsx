"use client";

import React from "react";
import * as XLSX from "xlsx";
import { ExtractedData } from "../types";

interface ResultsClientProps {
  data: ExtractedData;
}

export default function ResultsClient({ data }: ResultsClientProps) {
  const handleExportExcel = () => {
    const combinedData: any[] = [];

    // 1. Általános adatok
    combinedData.push({ "Kategória": "Általános", "Részlet": "Terméknév", "Érték": data.productName });

    // 2. Összetevők
    data.ingredients.forEach(i => {
      combinedData.push({ 
        "Kategória": "Összetevő", 
        "Részlet": `${i.name} (CAS: ${i.casNumber})`, 
        "Érték": i.concentration || "N/A"
      });
    });

    // 3. Veszélyességi osztályok
    data.hazardClasses.forEach(hc => {
      combinedData.push({ "Kategória": "Veszélyességi osztály", "Részlet": hc, "Érték": "" });
    });

    // 4. H-mondatok
    data.hStatements.forEach(h => {
      const parts = h.split(":");
      const code = parts[0];
      const text = parts.slice(1).join(":").trim();
      combinedData.push({ "Kategória": "H-mondat", "Részlet": code, "Érték": text });
    });

    // 5. P-mondatok
    data.pStatements.forEach(p => {
      const parts = p.split(":");
      const code = parts[0];
      const text = parts.slice(1).join(":").trim();
      combinedData.push({ "Kategória": "P-mondat", "Részlet": code, "Érték": text });
    });

    // Munkalap létrehozása (minden egyben, hogy ne lehessen eltéveszteni)
    const ws = XLSX.utils.json_to_sheet(combinedData);
    
    // Oszlopszélességek beállítása az olvashatóságért
    ws["!cols"] = [
      { wch: 25 }, // Kategória
      { wch: 40 }, // Részlet (Név/Kód)
      { wch: 60 }  // Érték (Szöveg)
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Kinyert Adatok");

    // Excel letöltése
    XLSX.writeFile(wb, `chemrisk_adatok_${new Date().getTime()}.xlsx`);
  };

  return (
    <button
      onClick={handleExportExcel}
      className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition flex items-center space-x-2 shadow-sm"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      <span>Exportálás Excel-be</span>
    </button>
  );
}
