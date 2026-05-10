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
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Regisztrációs hiba");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="bg-blue-600 text-white font-bold p-2 rounded">
              CR
            </div>
            <span className="text-xl font-bold text-slate-900">ChemRisk</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Regisztráció</h1>
          <p className="text-slate-500 mt-2">
            Hozz létre egy fiókot a korlátlan feltöltéshez
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Email cím
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@example.com"
                required
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Jelszó
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Jelszó megerősítése
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Regisztráció..." : "Regisztráció"}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-sm text-slate-600">
            Van már fiókod?{" "}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              Jelentkezz be
            </Link>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-slate-600 hover:text-slate-900 text-sm">
            ← Vissza a főoldalra
          </Link>
        </div>
      </div>
    </main>
  );
}
