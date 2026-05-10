"use client";

import React from "react";
import Link from "next/link";
import Header from "../components/Header";

export default function PrivacyPage() {
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

          <div className="app-kicker mb-4 ms-2">Jogi információ</div>
          <h1 className="app-heading text-4xl font-semibold tracking-tight text-[color:var(--foreground)]">
            Adatvédelmi szabályzat
          </h1>

          <div className="prose prose-invert mt-8 max-w-none text-[color:var(--foreground)]">
            <h2 className="mb-4 mt-8 text-2xl font-semibold">1. Bevezetés</h2>
            <p className="mb-4 text-[color:var(--muted)]">
              A ChemRisk alkalmazás (továbbiakban: &quot;Alkalmazás&quot;)
              komolyan veszi az adatvédelmet. Ez az Adatvédelmi Szabályzat
              (továbbiakban: &quot;Szabályzat&quot;) részletezi, hogyan
              gyűjtünk, használunk és védünk az Ön személyes adatait.
            </p>

            <h2 className="mb-4 mt-8 text-2xl font-semibold">
              2. Gyűjtött adatok
            </h2>
            <p className="mb-4 text-[color:var(--muted)]">
              Az Alkalmazás a következő adatokat gyűjtheti:
            </p>
            <ul className="mb-4 list-inside list-disc text-[color:var(--muted)]">
              <li>Regisztráció során: email cím, jelszó</li>
              <li>
                Feltöltés során: PDF fájlok és azokból kinyert információk
              </li>
              <li>Hozzáférés során: IP cím, böngésző típusa, látogatási idő</li>
            </ul>

            <h2 className="mb-4 mt-8 text-2xl font-semibold">
              3. Az adatok felhasználása
            </h2>
            <p className="mb-4 text-[color:var(--muted)]">
              Az Ön adatait a következő célokra használjuk:
            </p>
            <ul className="mb-4 list-inside list-disc text-[color:var(--muted)]">
              <li>Fiók kezelése és hitelesítés</li>
              <li>Az Alkalmazás funkcionalitásának biztosítása</li>
              <li>Az Alkalmazás fejlesztése és javítása</li>
              <li>Jogi kötelezettségek teljesítése</li>
            </ul>

            <h2 className="mb-4 mt-8 text-2xl font-semibold">
              4. Adatbiztonság
            </h2>
            <p className="mb-4 text-[color:var(--muted)]">
              Az Alkalmazás a szokásos biztonsági intézkedéseket alkalmazza az
              Ön adatainak védelme érdekében, azonban semmilyen online
              szolgáltatás nem garantálhat 100% biztonságot.
            </p>

            <h2 className="mb-4 mt-8 text-2xl font-semibold">5. Az Ön jogai</h2>
            <p className="mb-4 text-[color:var(--muted)]">
              Az GDPR és más adatvédelmi jogszabályok alapján jogosult:
            </p>
            <ul className="mb-4 list-inside list-disc text-[color:var(--muted)]">
              <li>Hozzáférni az Ön személyes adataihoz</li>
              <li>Helyesbítést kérni az adatokkal kapcsolatban</li>
              <li>Törlést kérni az adatokkal kapcsolatban</li>
              <li>Korlátozást kérni az adatfeldolgozásra</li>
            </ul>

            <h2 className="mb-4 mt-8 text-2xl font-semibold">
              6. Kapcsolatfelvétel
            </h2>
            <p className="text-[color:var(--muted)]">
              Ha kérdése van az adatvédelemmel kapcsolatban, kérjük, vegye fel a
              kapcsolatot velünk a support@chemrisk.local e-mail címen.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
