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
  const valueOr = (value?: string, fallback: string = "N/A") => {
    const normalized = value?.trim();
    return normalized ? normalized : fallback;
  };

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
            <Link
              href="/upload"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[color:var(--accent-strong)] hover:underline"
            >
              &larr; Vissza a feltöltéshez
            </Link>
            <div className="app-kicker mb-4 ms-2">Ellenőrzés</div>
            <h1 className="app-heading text-4xl font-semibold tracking-tight text-[color:var(--foreground)]">
              Kinyert adatok áttekintése
            </h1>
            <p className="mt-3 text-lg text-[color:var(--muted)]">
              Ellenőrizze az automatikusan felismert adatokat a dokumentumból.
              Összesen {dataList.length} fájl feldolgozva.
            </p>
          </div>
          <ResultsClient dataList={dataList} />
        </div>

        <div className="space-y-8">
          {dataList.map((data, fileIndex) => (
            <div key={fileIndex} className="app-card-strong p-6 sm:p-8">
              {data.fileName && (
                <div className="app-chip mb-4">Fájl: {data.fileName}</div>
              )}

              <div className="mb-6">
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">
                  Terméknév
                </h2>
                <p className="text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">
                  {data.productName}
                </p>
              </div>

              <div className="space-y-6">
                <section className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-5">
                  <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">
                    Kritikus kockázati profil
                  </h2>

                  <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[color:var(--muted)]">Mutagén (1A/1B)</p>
                      <p className="mt-1 font-medium text-[color:var(--foreground)]">{valueOr(data.mutagenic, "Nincs")}</p>
                    </div>
                    <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[color:var(--muted)]">Rákkeltő (1A/1B)</p>
                      <p className="mt-1 font-medium text-[color:var(--foreground)]">{valueOr(data.carcinogenic, "Nincs")}</p>
                    </div>
                    <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[color:var(--muted)]">Reprotox (1A/1B)</p>
                      <p className="mt-1 font-medium text-[color:var(--foreground)]">{valueOr(data.reprotox, "Nincs")}</p>
                    </div>
                    <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[color:var(--muted)]">Endokrin károsító</p>
                      <p className="mt-1 font-medium text-[color:var(--foreground)]">{valueOr(data.endocrineDisruptor, "Nincs")}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
                      <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--muted)]">CLP és veszélyességi osztály</h3>
                      <p className="mb-3 text-sm text-[color:var(--foreground)]">
                        <span className="font-semibold">CLP jelölés:</span> {valueOr(data.clpLabeling)}
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-[color:var(--foreground)]">
                        {data.hazardClasses.length > 0 ? (
                          data.hazardClasses.map((hc, idx) => <li key={idx}>{hc}</li>)
                        ) : (
                          <li className="list-none italic text-[color:var(--muted)]">N/A</li>
                        )}
                      </ul>
                    </div>

                    <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
                      <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--muted)]">H és P mondatok</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-[color:var(--danger)]">H mondatok</p>
                          <ul className="space-y-1.5">
                            {data.hStatements.length > 0 ? (
                              data.hStatements.map((h, idx) => {
                                const [code, ...rest] = h.split(":");
                                return (
                                  <li key={idx} className="flex gap-2 text-sm">
                                    <span className="shrink-0 font-bold text-[color:var(--danger)]">{code}:</span>
                                    <span className="text-[color:var(--foreground)]">{rest.join(":").trim()}</span>
                                  </li>
                                );
                              })
                            ) : (
                              <li className="italic text-sm text-[color:var(--muted)]">N/A</li>
                            )}
                          </ul>
                        </div>
                        <div>
                          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-[color:var(--accent-strong)]">P mondatok</p>
                          <ul className="space-y-1.5">
                            {data.pStatements.length > 0 ? (
                              data.pStatements.map((p, idx) => {
                                const [code, ...rest] = p.split(":");
                                return (
                                  <li key={idx} className="flex gap-2 text-sm">
                                    <span className="shrink-0 font-bold text-[color:var(--accent-strong)]">{code}:</span>
                                    <span className="text-[color:var(--foreground)]">{rest.join(":").trim()}</span>
                                  </li>
                                );
                              })
                            ) : (
                              <li className="italic text-sm text-[color:var(--muted)]">N/A</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-5">
                  <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">
                    Veszélyes összetevők
                  </h2>
                  <div className="overflow-x-auto rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)]">
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
                          <tr
                            key={idx}
                            className="border-b border-[color:var(--border)] last:border-0 hover:bg-[color:var(--surface-soft)]"
                          >
                            <td className="px-4 py-3">{ing.name}</td>
                            <td className="px-4 py-3 font-mono text-[color:var(--muted)]">{ing.casNumber}</td>
                            <td className="px-4 py-3">{ing.concentration}</td>
                          </tr>
                        ))}
                        {data.ingredients.length === 0 && (
                          <tr>
                            <td
                              colSpan={3}
                              className="px-4 py-3 italic text-[color:var(--muted)]"
                            >
                              Nem található összetevő adat.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-5">
                  <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">
                    Munkahelyi kitettség és védelem
                  </h2>
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
                      <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--muted)]">Határértékek (mg/m3)</h3>
                      <p className="text-sm text-[color:var(--foreground)]"><span className="font-semibold">ÁK:</span> {valueOr(data.limitAK)}</p>
                      <p className="mt-1 text-sm text-[color:var(--foreground)]"><span className="font-semibold">CK:</span> {valueOr(data.limitCK)}</p>
                    </div>

                    <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
                      <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--muted)]">Egyéni védőeszközök</h3>
                      <div className="space-y-1.5 text-sm text-[color:var(--foreground)]">
                        <p><span className="font-semibold">Egész test védelem:</span> {valueOr(data.ppeBodyProtection)}</p>
                        <p><span className="font-semibold">Légzésvédő:</span> {valueOr(data.ppeRespiratory)}</p>
                        <p><span className="font-semibold">Védőkesztyű:</span> {valueOr(data.ppeGloves)}</p>
                        <p><span className="font-semibold">Arcvédelem:</span> {valueOr(data.ppeFaceProtection)}</p>
                        <p><span className="font-semibold">Szemvédelem:</span> {valueOr(data.ppeEyeProtection)}</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-5">
                  <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">
                    Háttér információk
                  </h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--muted)]">Gyártó / forgalmazó</p>
                      <p className="mt-2 text-sm text-[color:var(--foreground)]">{valueOr(data.manufacturerDistributor)}</p>
                    </div>
                    <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--muted)]">Halmazállapot</p>
                      <p className="mt-2 text-sm text-[color:var(--foreground)]">{valueOr(data.physicalState)}</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}