import React from "react";
import Link from "next/link";
import ResultsClient from "./ResultsClient";
import { ExtractedData } from "../types";

// Mock data to simulate the extracted content
const mockData: ExtractedData = {
  productName: "Acetone Extra Pure",
  ingredients: [
    { name: "Acetone", casNumber: "67-64-1", concentration: "99-100%" },
  ],
  hazardClasses: [
    "Flam. Liq. 2",
    "Eye Irrit. 2",
    "STOT SE 3",
  ],
  hStatements: [
    "H225: Highly flammable liquid and vapour.",
    "H319: Causes serious eye irritation.",
    "H336: May cause drowsiness or dizziness.",
    "EUH066: Repeated exposure may cause skin dryness or cracking.",
  ],
  pStatements: [
    "P210: Keep away from heat, hot surfaces, sparks, open flames and other ignition sources. No smoking.",
    "P233: Keep container tightly closed.",
    "P305+P351+P338: IF IN EYES: Rinse cautiously with water for several minutes. Remove contact lenses, if present and easy to do. Continue rinsing.",
  ],
};

export default function ResultsPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white font-bold p-2 rounded">
              CR
            </div>
            <span className="text-xl font-bold tracking-tight">ChemRisk</span>
          </div>
          <nav className="hidden md:flex space-x-6 text-sm font-medium text-slate-600">
            <Link href="/" className="hover:text-blue-600 my-auto">
              Dokumentumok kezelése
            </Link>
            <Link href="/" className="text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
              Feltöltés
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10 flex justify-between items-end">
          <div>
            <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block text-sm">
              &larr; Vissza a feltöltéshez
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Kinyert adatok áttekintése
            </h1>
            <p className="text-lg text-slate-500">
              Ellenőrizze az automatikusan felismert adatokat a dokumentumból.
            </p>
          </div>
          <ResultsClient data={mockData} />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          {/* Terméknév */}
          <div className="mb-8">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Terméknév</h2>
            <p className="text-xl font-semibold">{mockData.productName}</p>
          </div>

          {/* Összetevők */}
          <div className="mb-8">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Összetevők és CAS számok</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-sm">
                    <th className="py-3 px-4 font-semibold text-slate-700">Anyagnév</th>
                    <th className="py-3 px-4 font-semibold text-slate-700">CAS szám</th>
                    <th className="py-3 px-4 font-semibold text-slate-700">Koncentráció</th>
                  </tr>
                </thead>
                <tbody>
                  {mockData.ingredients.map((ing, idx) => (
                    <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                      <td className="py-3 px-4">{ing.name}</td>
                      <td className="py-3 px-4 font-mono">{ing.casNumber}</td>
                      <td className="py-3 px-4">{ing.concentration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Veszélyességi osztályok és H-mondatok */}
            <div>
              <div className="mb-6">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Veszélyességi osztályok</h2>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  {mockData.hazardClasses.map((hc, idx) => (
                    <li key={idx}>{hc}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">H-mondatok (Veszély)</h2>
                <ul className="space-y-2">
                  {mockData.hStatements.map((h, idx) => {
                    const [code, ...rest] = h.split(":");
                    return (
                      <li key={idx} className="flex gap-2">
                        <span className="font-bold text-red-600 shrink-0">{code}:</span>
                        <span className="text-slate-700">{rest.join(":").trim()}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* P-mondatok */}
            <div>
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">P-mondatok (Óvintézkedés)</h2>
              <ul className="space-y-2">
                {mockData.pStatements.map((p, idx) => {
                  const [code, ...rest] = p.split(":");
                  return (
                    <li key={idx} className="flex gap-2">
                      <span className="font-bold text-blue-600 shrink-0">{code}:</span>
                      <span className="text-slate-700">{rest.join(":").trim()}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
