"use client";

import React from "react";
import Link from "next/link";
import Header from "../components/Header";

export default function CookiesPage() {
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
            Cookie-k és követés
          </h1>

          <div className="prose prose-invert mt-8 max-w-none text-[color:var(--foreground)]">
            <h2 className="mb-4 mt-8 text-2xl font-semibold">1. Mi az a cookie?</h2>
            <p className="mb-4 text-[color:var(--muted)]">
              A cookie-k kis szöveges fájlok, amelyeket a böngésző tárol az Ön számítógépén vagy mobileszközén. Az Alkalmazás cookie-kat használ a felhasználói élmény javítása érdekében.
            </p>

            <h2 className="mb-4 mt-8 text-2xl font-semibold">2. Az általunk használt cookie-k típusai</h2>
            <p className="mb-4 text-[color:var(--muted)]">
              <strong>Szükséges cookie-k:</strong> Az Alkalmazás működéséhez szükségesek (pl. hitelesítési token)
            </p>
            <p className="mb-4 text-[color:var(--muted)]">
              <strong>Funkcionális cookie-k:</strong> Az Ön beállításainak megjegyzésére (pl. sötét mód)
            </p>
            <p className="mb-4 text-[color:var(--muted)]">
              <strong>Analitikai cookie-k:</strong> Az Alkalmazás használatának megértésére (ha engedélyezte)
            </p>

            <h2 className="mb-4 mt-8 text-2xl font-semibold">3. Cookie-k kezelése</h2>
            <p className="mb-4 text-[color:var(--muted)]">
              A legtöbb böngésző lehetővé teszi a cookie-k blokkolását vagy törlését. Azonban az szükséges cookie-kat az Alkalmazás működéséhez. A beállításokhoz kérjük, tekintse meg a böngészője dokumentációját.
            </p>

            <h2 className="mb-4 mt-8 text-2xl font-semibold">4. Harmadik fél cookie-k</h2>
            <p className="text-[color:var(--muted)]">
              Az Alkalmazás harmadik fél szolgáltatások (pl. Google Analytics) cookie-jait nem használja az Ön hozzájárulása nélkül.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
