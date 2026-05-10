"use client";

import React, { useEffect, useId, useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

type ThemeMode = "light" | "dark";

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [themeReady, setThemeReady] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("chemrisk-theme");
    const nextTheme =
      storedTheme === "dark" || storedTheme === "light"
        ? storedTheme
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";

    setTheme(nextTheme);
    setThemeReady(true);
  }, []);

  useEffect(() => {
    if (!themeReady) {
      return;
    }

    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("chemrisk-theme", theme);
  }, [theme, themeReady]);

  const applyTheme = (nextTheme: ThemeMode) => {
    setTheme(nextTheme);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
    setMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const pillBase =
    "inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200";
  const pillDefault =
    "border-[color:var(--border)] bg-[color:var(--surface-strong)] text-[color:var(--foreground)] hover:bg-[color:var(--surface-soft)] hover:border-[color:var(--border-strong)]";
  const pillPrimary =
    "border-[color:var(--accent-soft)] bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)] hover:border-[color:var(--accent-strong)]";

  const iconButtonClass = `${pillDefault} h-10 w-10 inline-flex items-center justify-center gap-2 rounded-full border p-3 text-sm font-medium transition-colors duration-200`;

  function ThemeIcon({ mode }: { mode: ThemeMode }) {
    const clipPathId = useId();

    return mode === "dark" ? (
      <svg
        className="h-8 w-8"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <g fill="currentColor" clipPath={`url(#${clipPathId})`}>
          <path d="M12 0a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V1a1 1 0 0 1 1-1M4.929 3.515a1 1 0 0 0-1.414 1.414l2.828 2.828a1 1 0 0 0 1.414-1.414zM1 11a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2zm17 1a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2h-4a1 1 0 0 1-1-1m-.343 4.243a1 1 0 0 0-1.414 1.414l2.828 2.828a1 1 0 1 0 1.414-1.414zm-9.9 1.414a1 1 0 1 0-1.414-1.414L3.515 19.07a1 1 0 1 0 1.414 1.414zM20.485 4.929a1 1 0 0 0-1.414-1.414l-2.828 2.828a1 1 0 1 0 1.414 1.414zM13 19a1 1 0 1 0-2 0v4a1 1 0 1 0 2 0zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10" />
        </g>
        <defs>
          <clipPath id={clipPathId}>
            <path fill="#fff" d="M0 0h24v24H0z" />
          </clipPath>
        </defs>
      </svg>
    ) : (
      <svg
        className="h-8 w-8"
        viewBox="0 0 35 35"
        fill="none"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M18.44 34.68a18 18 0 0 1-2.94-.24 18.18 18.18 0 0 1-15-20.86A18.06 18.06 0 0 1 9.59.63a2.42 2.42 0 0 1 2.61.16 2.39 2.39 0 0 1 1 2.41l-1.3-.1 1.23.22A15.66 15.66 0 0 0 23.34 21a15.8 15.8 0 0 0 8.47.53A2.44 2.44 0 0 1 34.47 25a18.18 18.18 0 0 1-16.03 9.68M10.67 2.89a15.67 15.67 0 0 0-5 22.77A15.66 15.66 0 0 0 32.18 24a18.5 18.5 0 0 1-9.65-.64A18.18 18.18 0 0 1 10.67 2.89"
        />
      </svg>
    );
  }

  return (
    <header className="sticky top-0 z-20 border-b border-[color:var(--border)] bg-[color:var(--surface)] backdrop-blur-xl">
      <div className="app-container flex items-center justify-between gap-2 py-3 sm:gap-3 sm:py-4">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-600 font-black text-white shadow-lg shadow-sky-500/20 transition-transform group-hover:-translate-y-0.5">
            CR
          </div>
          <div className="hidden xl:block">
            <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">
              ChemRisk
            </span>
            <span className="text-lg font-semibold tracking-tight text-[color:var(--foreground)]">
              Biztonsági adatlap elemzés
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-2">
          <Link href="/upload" className={`${pillBase} ${pillDefault}`}>
            Feltöltés
          </Link>
          <Link href="/files" className={`${pillBase} ${pillDefault}`}>
            Dokumentumok
          </Link>
        </nav>

        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => applyTheme(theme === "dark" ? "light" : "dark")}
            className={iconButtonClass}
            aria-label="Theme toggle"
            title={theme === "dark" ? "Világos mód" : "Sötét mód"}
          >
            <ThemeIcon mode={theme} />
          </button>

          {user ? (
            <div className="relative flex items-center gap-3">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface-strong)] text-sm font-semibold text-[color:var(--foreground)] transition hover:border-[color:var(--border-strong)]"
              >
                {user.email?.[0]?.toUpperCase() || "U"}
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-12 w-56 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-strong)] shadow-xl shadow-slate-950/10">
                  <div className="border-b border-[color:var(--border)] px-4 py-3 text-sm font-medium text-[color:var(--foreground)]">
                    {user.email}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-sm font-medium text-[color:var(--danger)] transition hover:bg-[color:var(--danger-soft)]"
                  >
                    Kijelentkezés
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className={`${pillBase} ${pillDefault}`}>
                Bejelentkezés
              </Link>
              <Link href="/register" className={`${pillBase} ${pillPrimary}`}>
                Regisztráció
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => applyTheme(theme === "dark" ? "light" : "dark")}
            className={iconButtonClass}
            aria-label="Theme toggle"
            title={theme === "dark" ? "Világos mód" : "Sötét mód"}
          >
            <ThemeIcon mode={theme} />
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((value) => !value)}
            className={iconButtonClass}
            aria-label="Menu toggle"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              aria-hidden="true"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M6 6l12 12M18 6 6 18"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M4 7h16M4 12h16M4 17h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-[color:var(--border)] bg-[color:var(--surface-strong)] lg:hidden"
        >
          <div className="app-container py-3">
            <nav className="grid gap-2">
              <Link
                href="/upload"
                onClick={closeMobileMenu}
                className={`${pillBase} ${pillPrimary} w-full justify-start`}
              >
                Feltöltés
              </Link>
              <Link
                href="/files"
                onClick={closeMobileMenu}
                className={`${pillBase} ${pillDefault} w-full justify-start`}
              >
                Dokumentumok
              </Link>
            </nav>

            <div className="mt-3 border-t border-[color:var(--border)] pt-3">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface-strong)] text-sm font-semibold text-[color:var(--foreground)]">
                      {user.email?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[color:var(--foreground)]">
                        {user.email}
                      </p>
                      <p className="text-xs text-[color:var(--muted)]">
                        Bejelentkezve
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className={`${pillBase} ${pillDefault} w-full justify-start text-[color:var(--danger)]`}
                  >
                    Kijelentkezés
                  </button>
                </div>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2">
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className={`${pillBase} ${pillDefault} w-full`}
                  >
                    Bejelentkezés
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeMobileMenu}
                    className={`${pillBase} ${pillPrimary} w-full`}
                  >
                    Regisztráció
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
