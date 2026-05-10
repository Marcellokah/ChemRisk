"use client";

import React from "react";
import Link from "next/link";
import Header from "../components/Header";

export default function DisclaimerPage() {
  return (
    <main className="app-shell text-[color:var(--foreground)]">
      <Header />

      <section className="app-container app-section">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[color:var(--accent-strong)] hover:underline"
          >
            &larr; Vissza
          </Link>

          <div className="app-kicker mb-4">Jogi információ</div>
          <h1 className="app-heading text-4xl font-semibold tracking-tight text-[color:var(--foreground)]">
            Felelősségkizárás és jogi nyilatkozat
          </h1>

          <div className="prose prose-invert mt-8 max-w-none text-[color:var(--foreground)]">
            <h2 className="mb-4 mt-8 text-2xl font-semibold">1. Általános felelősségkizárás</h2>
            <p className="mb-4 text-[color:var(--muted)]">
              A ChemRisk alkalmazás által biztosított információk és feldolgozási eredmények általános referencia céllal szolgálnak. A felhasználó a saját felelősségén és kockázatán használja az Alkalmazást. Az Alkalmazás működtetői nem vagyunk felelősek az Alkalmazás használatából eredő közvetlen vagy közvetett kárért.
            </p>

            <h2 className="mb-4 mt-8 text-2xl font-semibold">2. Pontosság és megbízhatóság</h2>
            <p className="mb-4 text-[color:var(--muted)]">
              Noha törekszünk az információk pontosságára, nem garantálható, hogy az Alkalmazás által feldolgozott adatok 100% pontosak. A biztonsági adatlapok (SDS/MSDS) feldolgozása automatikus és tartalmazhat hibákat. A felhasználónak saját felelőssége a feldolgozott információk ellenőrzése.
            </p>

            <h2 className="mb-4 mt-8 text-2xl font-semibold">3. Szakértői tanácsok nem helyettesítik</h2>
            <p className="mb-4 text-[color:var(--muted)]">
              Az Alkalmazás nem helyettesíti a szakterület szakértőinek tanácsát. Veszélyes anyagok kezelésével kapcsolatos kritikus döntések esetén kérje meg a megfelelő szakemberek véleményét.
            </p>

            <h2 className="mb-4 mt-8 text-2xl font-semibold">4. Jogszabályi megfelelőség</h2>
            <p className="mb-4 text-[color:var(--muted)]">
              Az Alkalmazás az EU 1907/2006/EK (REACH) és az EU 1272/2008/EK (CLP) rendelkezésekkel való egyezést célozza, azonban az Alkalmazás használatával kapcsolatos jogi felelősség az Ön felhasználóját terheli.
            </p>

            <h2 className="mb-4 mt-8 text-2xl font-semibold">5. Adatvesztés és biztonsági incidensek</h2>
            <p className="mb-4 text-[color:var(--muted)]">
              Az Alkalmazás biztonsági intézkedéseket alkalmaz, de nem garantálható a 100% védelem az adatvesztés vagy nem jogosult hozzáférés ellen. A felhasználó felelős az Alkalmazásban tárolt adatok biztonsági mentéséért.
            </p>

            <h2 className="mb-4 mt-8 text-2xl font-semibold">6. Rendelkezésre állás</h2>
            <p className="mb-4 text-[color:var(--muted)]">
              Az Alkalmazás fenntartási vagy frissítési munkák miatt időnként nem elérhető. Az Alkalmazás működtetői nem vagyunk felelősek a szolgáltatás szüneteltetéséből eredő kárért.
            </p>

            <h2 className="mb-4 mt-8 text-2xl font-semibold">7. Harmadik fél tartalom</h2>
            <p className="text-[color:var(--muted)]">
              Az Alkalmazás harmadik fél tartalmakra (linkek, hivatkozások) tartalmazhat. Az Alkalmazás működtetői nem vagyunk felelősek a harmadik fél tartalmi vagy működésével kapcsolatban.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
