/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import ResultsPage from "../app/results/page";
import { AuthProvider } from "../app/context/AuthContext";

// Mock next/link to avoid router errors
jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
    };
  },
}));

// Mock global fetch
jest.mock("node-fetch", () => ({
  __esModule: true,
  default: jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ user: null }),
    })
  ),
}));

describe("Results Page", () => {
  test("Rendereli a kinyert adatokat", () => {
    render(
      <AuthProvider>
        <ResultsPage />
      </AuthProvider>
    );

    // Terméknév
    expect(screen.getByText("Acetone Extra Pure (Fallback)")).toBeInTheDocument();
    
    // Összetevő (Acetone, CAS: 67-64-1)
    expect(screen.getByText("Acetone")).toBeInTheDocument();
    expect(screen.getByText("67-64-1")).toBeInTheDocument();

    // H-mondat (H225)
    expect(screen.getByText("H225:")).toBeInTheDocument();

    // P-mondat (P210)
    expect(screen.getByText("P210:")).toBeInTheDocument();
  });
});
