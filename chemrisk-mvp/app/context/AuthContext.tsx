"use client";

import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

interface User {
  id: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  uploadLimit: { allowed: boolean; remaining: number; limit: number; isAuthenticated: boolean };
  checkUpload: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadLimit, setUploadLimit] = useState({
    allowed: true,
    remaining: 5,
    limit: 5,
    isAuthenticated: false,
  });

  // Check session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const checkUpload = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/check-upload");
      const data = await res.json();
      setUploadLimit(data);
    } catch {
      // Keep the default limit state if the check is temporarily unavailable.
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Bejelentkezési hiba");
    }

    const data = await res.json();
    setUser(data.user);
    await checkUpload();
  }, [checkUpload]);

  const register = useCallback(async (email: string, password: string) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Regisztrációs hiba");
    }

    const data = await res.json();
    setUser(data.user);
    await checkUpload();
  }, [checkUpload]);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setUploadLimit({
      allowed: true,
      remaining: 5,
      limit: 5,
      isAuthenticated: false,
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      uploadLimit,
      checkUpload,
    }),
    [user, loading, login, register, logout, uploadLimit, checkUpload]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
