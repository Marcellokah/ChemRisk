"use client";

import React from "react";
import Link from "next/link";
import Header from "../components/Header";

export default function TermsPage() {
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
            Felhasználási feltételek
          </h1>

          <div className="prose prose-invert mt-8 max-w-none text-[color:var(--foreground)]">
            <h2 className="mb-4 mt-8 text-2xl font-semibold">
              1. Általános feltételek
            </h2>
            <p className="mb-4 text-[color:var(--muted)]">
              A ChemRisk alkalmazás használatával Ön egyetért ezen
              feltételekkel. Ha nem ért egyet velük, kérjük, ne használja az
              Alkalmazást.
            </p>

            <h2 className="mb-4 mt-8 text-2xl font-semibold">
              2. Felhasználói fiók
            </h2>
            <p className="mb-4 text-[color:var(--muted)]">
              Ön felelős a fiókja biztonságáért és az összes rá végzett
              tevékenységért. A jelszavát bizalmasnak kell tartania és azonnal
              tájékoztatnia kell bennünket a jogosulatlan hozzáférésről.
            </p>

            <h2 className="mb-4 mt-8 text-2xl font-semibold">
              3. Felhasználói tartalom
            </h2>
            <p className="mb-4 text-[color:var(--muted)]">
              Ön felelős a feltöltött PDF-ekért és azok tartalmáért. Nem tölthet
              fel jogellenes, zaklatásra utaló vagy szerzői jogokat sértő
              anyagot.
            </p>

            <h2 className="mb-4 mt-8 text-2xl font-semibold">
              4. Szellemi tulajdon
            </h2>
            <p className="mb-4 text-[color:var(--muted)]">
              Az Alkalmazás és annak tartalma (kód, szöveg, dizájn) szerzői
              joggal védett. Csak személyes, nem kereskedelmi célból
              használhatja az Alkalmazást.
            </p>

            <h2 className="mb-4 mt-8 text-2xl font-semibold">
              5. Korlátozások
            </h2>
            <p className="mb-4 text-[color:var(--muted)]">Tilos:</p>
            <ul className="mb-4 list-inside list-disc text-[color:var(--muted)]">
              <li>Az Alkalmazást feltörni vagy megkerülni</li>
              <li>Az Alkalmazást felhasználva mások adatait gyűjteni</li>
              <li>Az Alkalmazás működésére káros hatást gyakorolni</li>
              <li>Az Alkalmazást visszamérnölelésíteni (reverse engineer)</li>
            </ul>

            <h2 className="mb-4 mt-8 text-2xl font-semibold">
              6. Felelősségkizárás
            </h2>
            <p className="mb-4 text-[color:var(--muted)]">
              Az Alkalmazás &quot;ahogy van&quot; (as-is) alapon kerül
              biztosításra. Nem garantálunk hibamentes vagy éjszaka nélküli
              működést. A feldolgozott adatokért nem vállalunk felelősséget.
            </p>

            <h2 className="mb-4 mt-8 text-2xl font-semibold">
              7. Felelősség korlátozása
            </h2>
            <p className="mb-4 text-[color:var(--muted)]">
              Az Alkalmazás használatából eredő közvetlen vagy közvetett kárért
              nem vagyunk felelősek, kivéve ha a jogszabály másként rendelkezik.
            </p>

            <h2 className="mb-4 mt-8 text-2xl font-semibold">
              8. Szükség szerinti módosítások
            </h2>
            <p className="text-[color:var(--muted)]">
              Fenntartjuk a jogot ezen feltételek és az Alkalmazás bármikori
              módosítására. A módosításokat az Alkalmazásban vagy e-mail útján
              közöljük.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
