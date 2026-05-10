/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import SDSUploader from "../app/components/SDSUploader";
import { AuthProvider } from "../app/context/AuthContext";

// Időzítők mockolása a setInterval miatt (gyors, determinisztikus teszt)
jest.useFakeTimers();

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
    };
  },
}));

// Mock global fetch with better handling
const mockFetch = jest.fn();
global.fetch = mockFetch as jest.Mock;

// Default mock response for auth endpoints
mockFetch.mockImplementation((url: string) => {
  if (url.includes("/api/auth")) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ user: null }),
    });
  }
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  });
}) as jest.Mock;

describe("SDSUploader Component", () => {
  // 1. Üres állapot teszt (US-01/AC1)
  test("Rendereli az üres állapotot és a CTA gombot", () => {
    render(
      <AuthProvider>
        <SDSUploader />
      </AuthProvider>
    );

    expect(
      screen.getByText(/Nincs még feltöltött dokumentum/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/\+ Elemek hozzáadása/i)).toBeInTheDocument();
  });

  // 2. Sikeres feltöltés teszt (Kritikus útvonal)
  test("PDF feltöltésekor elindul a folyamat és sikeresen befejeződik", async () => {
    const { container } = render(
      <AuthProvider>
        <SDSUploader />
      </AuthProvider>
    );

    const file = new File(["dummy content"], "test-sds.pdf", {
      type: "application/pdf",
    });
    const input = container.querySelector<HTMLInputElement>('input[type="file"]');

    // Biztonsági ellenőrzés: a rejtett inputnak léteznie kell
    expect(input).not.toBeNull();

    // Fájl kiválasztás szimulálása
    await act(async () => {
      fireEvent.change(input!, { target: { files: [file] } });
    });

    // Mivel a fetch mock azonnal feloldódik, egyből a siker állapothoz jutunk
    expect(await screen.findByText(/Feldolgozás sikeres/i, {}, { timeout: 3000 })).toBeInTheDocument();
    expect(screen.getByText(/Eredmények megtekintése/i)).toBeInTheDocument();
  }, 10000);

  // 3. Hiba állapot: Rossz fájlformátum (US-01/AC2)
  test("Hibaüzenetet dob nem PDF fájl esetén", () => {
    const { container } = render(
      <AuthProvider>
        <SDSUploader />
      </AuthProvider>
    );

    const file = new File(["image"], "kep.jpg", { type: "image/jpeg" });
    // A komponens rejtett file inputját a containerből célozzuk meg
    const input = container.querySelector<HTMLInputElement>('input[type="file"]');
    expect(input).not.toBeNull();

    fireEvent.change(input!, { target: { files: [file] } });

    expect(
      screen.getByText(/Csak PDF formátumú biztonsági adatlap/i)
    ).toBeInTheDocument();
  });

  // 4. Hiba állapot: Túl nagy fájl (Edge case)
  test("Hibaüzenetet dob 20MB-nál nagyobb fájl esetén", () => {
    const { container } = render(
      <AuthProvider>
        <SDSUploader />
      </AuthProvider>
    );

    const largeFile = new File([""], "big.pdf", { type: "application/pdf" });
    Object.defineProperty(largeFile, "size", { value: 25 * 1024 * 1024 }); // 25MB

    const input = container.querySelector<HTMLInputElement>('input[type="file"]');
    expect(input).not.toBeNull();
    fireEvent.change(input!, { target: { files: [largeFile] } });

    expect(
      screen.getByText(/Egy fájl mérete sem haladhatja meg a 20MB-ot/i)
    ).toBeInTheDocument();
  });

  // 5. Retry funkció tesztelése (Interakció)
  test("Hiba után az Újra gomb visszaállítja az alapállapotot", () => {
    const { container } = render(
      <AuthProvider>
        <SDSUploader />
      </AuthProvider>
    );

    // Először hibára futtatjuk
    const file = new File(["image"], "wrong.png", { type: "image/png" });
    const input = container.querySelector<HTMLInputElement>('input[type="file"]');
    expect(input).not.toBeNull();
    fireEvent.change(input!, { target: { files: [file] } });

    // Megkeressük és megnyomjuk az újrázás gombot
    const retryButton = screen.getByText(/Újra megpróbálom/i);
    fireEvent.click(retryButton);

    // Ellenőrizzük, hogy visszatértünk-e az elejére
    expect(
      screen.getByText(/Nincs még feltöltött dokumentum/i)
    ).toBeInTheDocument();
  });
});
