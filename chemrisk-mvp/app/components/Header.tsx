"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

type ThemeMode = "light" | "dark";

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    const storedTheme = window.localStorage.getItem("chemrisk-theme");
    if (storedTheme === "dark" || storedTheme === "light") {
      return storedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("chemrisk-theme", theme);
  }, [theme]);

  const applyTheme = (nextTheme: ThemeMode) => {
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    window.localStorage.setItem("chemrisk-theme", nextTheme);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
    setMenuOpen(false);
  };

  const pillBase =
    "inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200";
  const pillDefault =
    "border-[color:var(--border)] bg-[color:var(--surface-strong)] text-[color:var(--foreground)] hover:bg-[color:var(--surface-soft)] hover:border-[color:var(--border-strong)]";
  const pillPrimary =
    "border-[color:var(--accent-soft)] bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)] hover:border-[color:var(--accent-strong)]";

  return (
    <header className="sticky top-0 z-20 border-b border-[color:var(--border)] bg-[color:var(--surface)] backdrop-blur-xl">
      <div className="app-container flex items-center justify-between gap-3 py-3 sm:py-4">
        <Link href="/" className="group flex items-center gap-3 shrink-0">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-600 text-white font-black shadow-lg shadow-sky-500/20 transition-transform group-hover:-translate-y-0.5">
            CR
          </div>
          <div className="hidden lg:block">
            <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">
              ChemRisk
            </span>
            <span className="text-lg font-semibold tracking-tight text-[color:var(--foreground)]">
              Biztonsági adatlap elemzés
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          <Link href="/upload" className={`${pillBase} ${pillDefault}`}>
            Feltöltés
          </Link>
          <Link href="/files" className={`${pillBase} ${pillDefault}`}>
            Dokumentumok
          </Link>
        </nav>

        <div className="relative flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => applyTheme(theme === "dark" ? "light" : "dark")}
            className={`${pillBase} ${pillDefault} h-11 w-11 px-0`}
            aria-label="Theme toggle"
            title={theme === "dark" ? "Világos mód" : "Sötét mód"}
          >
            {theme === "dark" ? (
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M12 3v2m0 14v2m8.485-8.485-1.414 1.414M5.929 5.929 4.515 4.515m0 14.97 1.414-1.414M19.485 4.515l-1.414 1.414M21 12h-2M5 12H3m9 9a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z"
                />
              </svg>
            ) : (
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M21 12.8A8.5 8.5 0 0 1 11.2 3a8.5 8.5 0 1 0 9.8 9.8Z"
                />
              </svg>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
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
      </div>
    </header>
  );
}
