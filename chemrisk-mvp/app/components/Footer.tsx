import React from "react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[color:var(--border)] bg-[color:var(--surface-soft)] py-12 text-[color:var(--foreground)]">
      <div className="app-container">
        <div className="mb-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* About Section */}
          <div>
            <h3 className="mb-4 font-semibold text-[color:var(--foreground)]">
              ChemRisk
            </h3>
            <p className="text-sm text-[color:var(--muted)]">
              Automatikus biztonsági adatlap elemzés és feldolgozás. CAS számok, veszélyességi osztályok és összetevők kinyerése PDF-ből.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="mb-4 font-semibold text-[color:var(--foreground)]">
              Szolgáltatás
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/upload"
                  className="text-[color:var(--muted)] hover:text-[color:var(--accent-strong)]"
                >
                  Feltöltés
                </Link>
              </li>
              <li>
                <Link
                  href="/files"
                  className="text-[color:var(--muted)] hover:text-[color:var(--accent-strong)]"
                >
                  Archívum
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-[color:var(--muted)] hover:text-[color:var(--accent-strong)]"
                >
                  Regisztráció
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="mb-4 font-semibold text-[color:var(--foreground)]">
              Jogi
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-[color:var(--muted)] hover:text-[color:var(--accent-strong)]"
                >
                  Adatvédelmi szabályzat
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-[color:var(--muted)] hover:text-[color:var(--accent-strong)]"
                >
                  Felhasználási feltételek
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-[color:var(--muted)] hover:text-[color:var(--accent-strong)]"
                >
                  Cookie-k
                </Link>
              </li>
              <li>
                <Link
                  href="/disclaimer"
                  className="text-[color:var(--muted)] hover:text-[color:var(--accent-strong)]"
                >
                  Felelősségkizárás
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-semibold text-[color:var(--foreground)]">
              Kapcsolat
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="mailto:support@chemrisk.local"
                  className="text-[color:var(--muted)] hover:text-[color:var(--accent-strong)]"
                >
                  support@chemrisk.local
                </a>
              </li>
              <li className="text-[color:var(--muted)]">
                +36 1 234 5678
              </li>
              <li className="text-[color:var(--muted)]">
                Budapest, Magyarország
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-8 border-t border-[color:var(--border)]" />

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-[color:var(--muted)] sm:flex-row">
          <div>
            <p>
              &copy; {currentYear} ChemRisk. Minden jog fenntartva.
            </p>
          </div>
          <div className="flex gap-4">
            <a
              href="#"
              aria-label="LinkedIn"
              className="hover:text-[color:var(--accent-strong)]"
            >
              LinkedIn
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="hover:text-[color:var(--accent-strong)]"
            >
              Twitter
            </a>
            <a
              href="#"
              aria-label="GitHub"
              className="hover:text-[color:var(--accent-strong)]"
            >
              GitHub
            </a>
          </div>
        </div>

        {/* Compliance Notice */}
        <div className="mt-8 border-t border-[color:var(--border)] pt-6 text-xs text-[color:var(--muted)]">
          <p className="mb-2">
            <strong>Megfelelőség:</strong> Ez az alkalmazás összhangban van az EU 1907/2006/EK (REACH) és az EU 1272/2008/EK (CLP) rendelkezésekkel. A feldolgozott információk általános referencia célú és nem helyettesítik a szakterület szakértőinek tanácsait.
          </p>
          <p>
            <strong>Felelősségkizárás:</strong> Az alkalmazás által szolgáltatott adatok pontossága nem garantált. Felhasználók a saját felelősségük alatt használják az alkalmazást. Szerveink nem vagyunk felelősek az adatokból eredő bármilyen veszteségért vagy kárért.
          </p>
        </div>
      </div>
    </footer>
  );
}
