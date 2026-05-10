"use client";

import React from "react";
import * as XLSX from "xlsx";
import { ExtractedData } from "../types";

interface ResultsClientProps {
  dataList: ExtractedData[];
}

export default function ResultsClient({ dataList }: ResultsClientProps) {
  const handleExportExcel = () => {
    const combinedData: any[] = [];

    dataList.forEach((data, index) => {
      const fileLabel = data.fileName || `Fájl ${index + 1}`;

      // 1. Általános adatok
      combinedData.push({ 
        "Fájl": fileLabel,
        "Kategória": "Általános", 
        "Részlet": "Terméknév", 
        "Érték": data.productName 
      });

      // 2. Összetevők
      data.ingredients.forEach(i => {
        combinedData.push({ 
          "Fájl": fileLabel,
          "Kategória": "Összetevő", 
          "Részlet": `${i.name} (CAS: ${i.casNumber})`, 
          "Érték": i.concentration || "N/A"
        });
      });

      // 3. Veszélyességi osztályok
      data.hazardClasses.forEach(hc => {
        combinedData.push({ 
          "Fájl": fileLabel,
          "Kategória": "Veszélyességi osztály", 
          "Részlet": hc, 
          "Érték": "" 
        });
      });

      // 4. H-mondatok
      data.hStatements.forEach(h => {
        const parts = h.split(":");
        const code = parts[0];
        const text = parts.slice(1).join(":").trim();
        combinedData.push({ 
          "Fájl": fileLabel,
          "Kategória": "H-mondat", 
          "Részlet": code, 
          "Érték": text 
        });
      });

      // 5. P-mondatok
      data.pStatements.forEach(p => {
        const parts = p.split(":");
        const code = parts[0];
        const text = parts.slice(1).join(":").trim();
        combinedData.push({ 
          "Fájl": fileLabel,
          "Kategória": "P-mondat", 
          "Részlet": code, 
          "Érték": text 
        });
      });
      
      // Üres sor hozzáadása, ha nem ez az utolsó elem (vizuális elválasztó)
      if (index < dataList.length - 1) {
        combinedData.push({ "Fájl": "", "Kategória": "", "Részlet": "", "Érték": "" });
      }
    });

    // Munkalap létrehozása (minden egyben, hogy ne lehessen eltéveszteni)
    const ws = XLSX.utils.json_to_sheet(combinedData);
    
    // Oszlopszélességek beállítása az olvashatóságért
    ws["!cols"] = [
      { wch: 30 }, // Fájl
      { wch: 20 }, // Kategória
      { wch: 40 }, // Részlet (Név/Kód)
      { wch: 60 }  // Érték (Szöveg)
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Kinyert Adatok");

    // Excel letöltése
    XLSX.writeFile(wb, `chemrisk_bulk_adatok_${new Date().getTime()}.xlsx`);
  };

  return (
    <button
      onClick={handleExportExcel}
      className="app-button-primary bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/20"
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      <span>Exportálás Excel-be</span>
    </button>
  );
}