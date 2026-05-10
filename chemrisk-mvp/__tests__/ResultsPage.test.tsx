/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
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

beforeEach(() => {
  sessionStorage.clear();
  window.matchMedia = window.matchMedia || (() => ({
    matches: false,
    media: "",
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })) as any;
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ files: [] }),
  }) as jest.Mock;
});

describe("Results Page", () => {
  test("üres állapotot mutat, ha nincs mentett eredmény", async () => {
    render(
      <AuthProvider>
        <ResultsPage />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Még nincs megjeleníthető feldolgozás/i)
      ).toBeInTheDocument();
    });
  });
});
