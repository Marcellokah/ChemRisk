"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ResultsClient from "./ResultsClient";
import Header from "../components/Header";
import { ExtractedData } from "../types";

export default function ResultsPage() {
  const router = useRouter();
  const [dataList, setDataList] = useState<ExtractedData[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResults = async () => {
      try {
        const stored = sessionStorage.getItem("extractedData");
        if (stored) {
          const parsed = JSON.parse(stored);
          setDataList(Array.isArray(parsed) ? parsed : [parsed]);
          return;
        }

        const response = await fetch("/api/files");
        if (response.status === 401) {
          // Redirect to login
          router.push("/login");
          return;
        }
        if (!response.ok) {
          throw new Error("Nem sikerült betölteni a mentett eredményeket.");
        }

        const payload = await response.json();
        const files = Array.isArray(payload.files) ? payload.files : [];
        const extracted = files
          .map((file: { data?: ExtractedData }) => file.data)
          .filter((fileData: ExtractedData | undefined): fileData is ExtractedData => Boolean(fileData));

        setDataList(extracted);
      } catch {
        setDataList([]);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, []);

  if (loading) {
    return (
      <main className="app-shell text-[color:var(--foreground)]">
        <Header />
        <section className="app-container app-section">
          <div className="app-card p-10 text-center">
            <p className="text-[color:var(--muted)]">Eredmények betöltése...</p>
          </div>
        </section>
      </main>
    );
  }

  if (!dataList || dataList.length === 0) {
    return (
      <main className="app-shell text-[color:var(--foreground)]">
        <Header />

        <section className="app-container app-section">
          <div className="mx-auto max-w-2xl text-center">
            <div className="app-kicker mb-4">Eredmények</div>
            <h1 className="app-heading text-4xl font-semibold tracking-tight text-[color:var(--foreground)]">
              Még nincs megjeleníthető feldolgozás
            </h1>
            <p className="mt-4 text-lg text-[color:var(--muted)]">
              Tölts fel egy PDF biztonsági adatlapot, vagy nyisd meg a mentett archívumot, hogy itt megjelenjenek a kinyert adatok.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/upload" className="app-button-primary">
                Feltöltés megnyitása
              </Link>
              <Link href="/files" className="app-button-secondary">
                Archívum megnyitása
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell text-[color:var(--foreground)]">
      <Header />

      <section className="app-container app-section">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <Link href="/upload" className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[color:var(--accent-strong)] hover:underline">
              &larr; Vissza a feltöltéshez
            </Link>
            <div className="app-kicker mb-4">Ellenőrzés</div>
            <h1 className="app-heading text-4xl font-semibold tracking-tight text-[color:var(--foreground)]">
              Kinyert adatok áttekintése
            </h1>
            <p className="mt-3 text-lg text-[color:var(--muted)]">
              Ellenőrizze az automatikusan felismert adatokat a dokumentumból. Összesen {dataList.length} fájl feldolgozva.
            </p>
          </div>
          <ResultsClient dataList={dataList} />
        </div>

        <div className="space-y-8">
          {dataList.map((data, fileIndex) => (
            <div key={fileIndex} className="app-card-strong p-6 sm:p-8">
              {data.fileName && (
                <div className="app-chip mb-4">
                  Fájl: {data.fileName}
                </div>
              )}
              
              {/* Terméknév */}
              <div className="mb-8">
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">Terméknév</h2>
                <p className="text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">{data.productName}</p>
              </div>

              {/* Összetevők */}
              <div className="mb-8">
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">Összetevők és CAS számok</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-[color:var(--border)] text-sm text-[color:var(--muted)]">
                        <th className="px-4 py-3 font-semibold">Anyagnév</th>
                        <th className="px-4 py-3 font-semibold">CAS szám</th>
                        <th className="px-4 py-3 font-semibold">Koncentráció</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.ingredients.map((ing, idx) => (
                        <tr key={idx} className="border-b border-[color:var(--border)] last:border-0 hover:bg-[color:var(--surface-soft)]">
                          <td className="px-4 py-3">{ing.name}</td>
                          <td className="px-4 py-3 font-mono text-[color:var(--muted)]">{ing.casNumber}</td>
                          <td className="px-4 py-3">{ing.concentration}</td>
                        </tr>
                      ))}
                      {data.ingredients.length === 0 && (
                        <tr>
                          <td colSpan={3} className="px-4 py-3 italic text-[color:var(--muted)]">Nem található összetevő adat.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Veszélyességi osztályok és H-mondatok */}
                <div>
                  <div className="mb-6">
                    <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">Veszélyességi osztályok</h2>
                    <ul className="list-disc list-inside space-y-1 text-[color:var(--foreground)]">
                      {data.hazardClasses.map((hc, idx) => (
                        <li key={idx}>{hc}</li>
                      ))}
                      {data.hazardClasses.length === 0 && <li className="list-none italic text-[color:var(--muted)]">N/A</li>}
                    </ul>
                  </div>
                  <div>
                    <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">H-mondatok (Veszély)</h2>
                    <ul className="space-y-2">
                      {data.hStatements.map((h, idx) => {
                        const [code, ...rest] = h.split(":");
                        return (
                          <li key={idx} className="flex gap-2">
                            <span className="shrink-0 font-bold text-[color:var(--danger)]">{code}:</span>
                            <span className="text-[color:var(--foreground)]">{rest.join(":").trim()}</span>
                          </li>
                        );
                      })}
                      {data.hStatements.length === 0 && <li className="italic text-[color:var(--muted)]">N/A</li>}
                    </ul>
                  </div>
                </div>

                {/* P-mondatok */}
                <div>
                  <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">P-mondatok (Óvintézkedés)</h2>
                  <ul className="space-y-2">
                    {data.pStatements.map((p, idx) => {
                      const [code, ...rest] = p.split(":");
                      return (
                        <li key={idx} className="flex gap-2">
                          <span className="shrink-0 font-bold text-[color:var(--accent-strong)]">{code}:</span>
                          <span className="text-[color:var(--foreground)]">{rest.join(":").trim()}</span>
                        </li>
                      );
                    })}
                    {data.pStatements.length === 0 && <li className="italic text-[color:var(--muted)]">N/A</li>}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}