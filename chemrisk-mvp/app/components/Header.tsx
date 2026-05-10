"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user, logout, uploadLimit } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/");
    setMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-blue-600 text-white font-bold p-2 rounded">
            CR
          </div>
          <span className="text-xl font-bold tracking-tight hidden sm:inline">
            ChemRisk
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium text-slate-600">
          <Link href="/files" className="hover:text-blue-600">
            Dokumentumok
          </Link>
          <Link href="/" className="text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
            Feltöltés
          </Link>
        </nav>

        {/* Auth Section */}
        <div className="relative">
          {user ? (
            <div className="flex items-center gap-4">
              {/* Upload limit indicator */}
              {uploadLimit.limit !== Infinity && (
                <div className="text-xs bg-yellow-50 text-yellow-800 px-3 py-1 rounded-full border border-yellow-200">
                  {uploadLimit.remaining}/{uploadLimit.limit} feltöltés
                </div>
              )}

              {/* User menu */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center space-x-2 text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  {user.email?.[0]?.toUpperCase() || "U"}
                </div>
              </button>

              {/* Dropdown menu */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg">
                  <div className="px-4 py-2 border-b text-sm text-slate-900">
                    {user.email}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Kijelentkezés
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                href="/login"
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                Bejelentkezés
              </Link>
              <Link
                href="/register"
                className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Regisztráció
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
