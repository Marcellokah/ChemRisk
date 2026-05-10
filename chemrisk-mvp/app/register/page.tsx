"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("A jelszavak nem egyeznek");
      return;
    }

    if (password.length < 6) {
      setError("A jelszó legalább 6 karakter hosszú kell, hogy legyen");
      return;
    }

    setLoading(true);

    try {
      await register(email, password);
      router.push("/upload");
    } catch (err: any) {
      setError(err.message || "Regisztrációs hiba");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-shell flex items-center justify-center px-4 py-10 text-[color:var(--foreground)]">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-600 text-white font-black shadow-lg shadow-sky-500/20">
              CR
            </div>
            <span className="text-xl font-semibold tracking-tight text-[color:var(--foreground)]">
              ChemRisk
            </span>
          </Link>
          <div className="app-kicker mx-auto mb-4 ms-2">Fiók létrehozás</div>
          <h1 className="text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">
            Regisztráció
          </h1>
          <p className="mt-2 text-[color:var(--muted)]">
            Hozz létre egy fiókot a korlátlan feltöltéshez
          </p>
        </div>

        {/* Form */}
        <div className="app-card-strong p-6 sm:p-7">
          {error && (
            <div className="mb-4 rounded-xl border border-[color:var(--danger-soft)] bg-[color:var(--danger-soft)] px-4 py-3 text-sm text-[color:var(--danger)]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[color:var(--foreground)]">
                Email cím
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@example.com"
                required
                className="app-input"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[color:var(--foreground)]">
                Jelszó
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="app-input"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[color:var(--foreground)]">
                Jelszó megerősítése
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="app-input"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="app-button-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Regisztráció..." : "Regisztráció"}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-sm text-[color:var(--muted)]">
            Van már fiókod?{" "}
            <Link
              href="/login"
              className="font-medium text-[color:var(--accent-strong)] hover:underline"
            >
              Jelentkezz be
            </Link>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
          >
            ← Vissza a főoldalra
          </Link>
        </div>
      </div>
    </main>
  );
}
