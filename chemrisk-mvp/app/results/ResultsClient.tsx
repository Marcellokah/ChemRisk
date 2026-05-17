"use client";

import React from "react";
import * as XLSX from "xlsx-js-style";
import { ExtractedData } from "../types";

interface ResultsClientProps {
  dataList: ExtractedData[];
}

const GREEN_COLUMNS = [
  "Anyag / keverék neve",
  "Gyártó / forgalmazó",
  "Halmazállapot",
  "H mondat",
  "P mondat",
  "CLP jelölés",
  "Veszélyes összetevők - Megnevezés",
  "Veszélyes összetevők - CAS szám",
  "Veszélyes összetevők - Koncentrátum (%)",
  "Határértékkel szabályzott? - ÁK",
  "Határértékkel szabályzott? - CK",
  "Mutagén? (1A vagy 1B)",
  "Rákkeltő? (1A vagy 1B)",
  "Reprotox (1A vagy 1B)",
  "Endokrin károsító",
  "Egyéni védőeszközök - Egész test védelem",
  "Egyéni védőeszközök - Légzésvédő",
  "Egyéni védőeszközök - Védőkesztyű",
  "Egyéni védőeszközök - Arcvédelem",
  "Egyéni védőeszközök - Szemvédelem",
] as const;

const YELLOW_COLUMNS = [
  "Exponált munkavállalók száma",
  "Expozíciós idő (perc/nap)",
  "Felhasználás helye és módja",
  "Felhasznált mennyiség (év/hónap/nap) (l/kg)",
  "Tevékenység, mely során a dolgozó érintkezhet az anyaggal",
  "Biológiai monitor vizsgálatra kötelezett?",
  "Kockázati szint elfogadható?",
] as const;

export default function ResultsClient({ dataList }: ResultsClientProps) {
  const handleExportExcel = () => {
    const normalizeValue = (value?: string, emptyValue: string = "N/A") => {
      const trimmed = value?.trim();
      return trimmed ? trimmed : emptyValue;
    };

    const extractCodes = (statements: string[], codePrefix: "H" | "P") => {
      const pattern = codePrefix === "H"
        ? /H\s*(\d{3})/gi
        : /P\s*(\d{3}(?:\s*\+\s*(?:P\s*)?\d{3})*)/gi;

      const codes: string[] = [];

      statements.forEach((statement) => {
        const text = String(statement || "");
        pattern.lastIndex = 0;
        let match = pattern.exec(text);
        while (match) {
          const normalized = match[1]
            .replace(/\s+/g, "")
            .replace(/P/gi, "");
          if (normalized && !codes.includes(normalized)) {
            codes.push(normalized);
          }
          match = pattern.exec(text);
        }
      });

      return codes.join(", ") || "N/A";
    };

    const combinedData: Record<string, string>[] = [];

    dataList.forEach((data) => {
      const hCodes = extractCodes(data.hStatements || [], "H");
      const pCodes = extractCodes(data.pStatements || [], "P");
      const ingredients = data.ingredients?.length
        ? data.ingredients
        : [{ name: "N/A", casNumber: "N/A", concentration: "N/A" }];

      ingredients.forEach((ingredient) => {
        combinedData.push({
          "Anyag / keverék neve": normalizeValue(data.productName),
          "Gyártó / forgalmazó": normalizeValue(data.manufacturerDistributor),
          "Halmazállapot": normalizeValue(data.physicalState),
          "H mondat": hCodes,
          "P mondat": pCodes,
          "CLP jelölés": normalizeValue(data.clpLabeling),
          "Veszélyes összetevők - Megnevezés": normalizeValue(ingredient.name),
          "Veszélyes összetevők - CAS szám": normalizeValue(ingredient.casNumber),
          "Veszélyes összetevők - Koncentrátum (%)": normalizeValue(ingredient.concentration),
          "Határértékkel szabályzott? - ÁK": normalizeValue(data.limitAK),
          "Határértékkel szabályzott? - CK": normalizeValue(data.limitCK),
          "Mutagén? (1A vagy 1B)": normalizeValue(data.mutagenic, "Nincs"),
          "Rákkeltő? (1A vagy 1B)": normalizeValue(data.carcinogenic, "Nincs"),
          "Reprotox (1A vagy 1B)": normalizeValue(data.reprotox, "Nincs"),
          "Endokrin károsító": normalizeValue(data.endocrineDisruptor, "Nincs"),
          "Egyéni védőeszközök - Egész test védelem": normalizeValue(data.ppeBodyProtection),
          "Egyéni védőeszközök - Légzésvédő": normalizeValue(data.ppeRespiratory),
          "Egyéni védőeszközök - Védőkesztyű": normalizeValue(data.ppeGloves),
          "Egyéni védőeszközök - Arcvédelem": normalizeValue(data.ppeFaceProtection),
          "Egyéni védőeszközök - Szemvédelem": normalizeValue(data.ppeEyeProtection),
          "Exponált munkavállalók száma": "",
          "Expozíciós idő (perc/nap)": "",
          "Felhasználás helye és módja": "",
          "Felhasznált mennyiség (év/hónap/nap) (l/kg)": "",
          "Tevékenység, mely során a dolgozó érintkezhet az anyaggal": "",
          "Biológiai monitor vizsgálatra kötelezett?": "",
          "Kockázati szint elfogadható?": "",
        });
      });
    });

    const ws = XLSX.utils.json_to_sheet(combinedData);

    const greenFill = { patternType: "solid", fgColor: { rgb: "E2F6E9" } };
    const yellowFill = { patternType: "solid", fgColor: { rgb: "FFF9C4" } };
    const border = {
      top: { style: "thin", color: { rgb: "BFC6CF" } },
      bottom: { style: "thin", color: { rgb: "BFC6CF" } },
      left: { style: "thin", color: { rgb: "BFC6CF" } },
      right: { style: "thin", color: { rgb: "BFC6CF" } },
    };

    const cellStyleBase = {
      alignment: { vertical: "top", horizontal: "left", wrapText: true },
      border,
      font: { name: "Calibri", sz: 11, color: { rgb: "1B2631" } },
    };

    const headerStyleBase = {
      alignment: { vertical: "center", horizontal: "left", wrapText: true },
      border,
      font: { name: "Calibri", sz: 11, bold: true, color: { rgb: "102027" } },
    };

    if (ws["!ref"]) {
      const range = XLSX.utils.decode_range(ws["!ref"]);

      for (let c = range.s.c; c <= range.e.c; c += 1) {
        const headerAddress = XLSX.utils.encode_cell({ r: 0, c });
        const headerCell = ws[headerAddress];
        if (!headerCell) {
          continue;
        }

        const columnName = String(headerCell.v || "");
        const isYellow = YELLOW_COLUMNS.includes(columnName as (typeof YELLOW_COLUMNS)[number]);
        const isGreen = GREEN_COLUMNS.includes(columnName as (typeof GREEN_COLUMNS)[number]);
        const fill = isYellow ? yellowFill : isGreen ? greenFill : greenFill;

        headerCell.s = {
          ...headerStyleBase,
          fill,
        };

        for (let r = 1; r <= range.e.r; r += 1) {
          const cellAddress = XLSX.utils.encode_cell({ r, c });
          if (!ws[cellAddress]) {
            ws[cellAddress] = { t: "s", v: "" };
          }

          ws[cellAddress].s = {
            ...cellStyleBase,
            fill,
          };
        }
      }
    }
    
    // Tágasabb megjelenés és jobb olvashatóság
    ws["!cols"] = [
      { wch: 34 },
      { wch: 30 },
      { wch: 20 },
      { wch: 22 },
      { wch: 26 },
      { wch: 22 },
      { wch: 38 },
      { wch: 24 },
      { wch: 26 },
      { wch: 26 },
      { wch: 26 },
      { wch: 22 },
      { wch: 22 },
      { wch: 22 },
      { wch: 22 },
      { wch: 38 },
      { wch: 32 },
      { wch: 34 },
      { wch: 32 },
      { wch: 32 },
      { wch: 30 },
      { wch: 24 },
      { wch: 36 },
      { wch: 40 },
      { wch: 36 },
      { wch: 40 },
      { wch: 30 },
    ];

    if (ws["!ref"]) {
      const range = XLSX.utils.decode_range(ws["!ref"]);
      ws["!rows"] = Array.from({ length: range.e.r + 1 }, (_, rowIndex) =>
        rowIndex === 0 ? { hpt: 34 } : { hpt: 44 },
      );
      ws["!autofilter"] = { ref: ws["!ref"] };
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Kinyert Adatok");

    // Excel letöltése
    XLSX.writeFile(wb, `chemrisk_bulk_adatok_${new Date().getTime()}.xlsx`);
  };

  return (
    <button
      onClick={handleExportExcel}
      className="app-button-primary w-full bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/20 sm:w-auto"
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      <span>Exportálás Excel-be</span>
    </button>
  );
}