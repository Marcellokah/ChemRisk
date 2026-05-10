/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import SDSUploader from "../app/components/SDSUploader";

// Időzítők mockolása a setInterval miatt (gyors, determinisztikus teszt)
jest.useFakeTimers();

describe("SDSUploader Component", () => {
  // 1. Üres állapot teszt (US-01/AC1)
  test("Rendereli az üres állapotot és a CTA gombot", () => {
    render(<SDSUploader />);

    expect(
      screen.getByText(/Nincs még feltöltött dokumentum/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/\+ Új elem hozzáadása/i)).toBeInTheDocument();
  });

  // 2. Sikeres feltöltés teszt (Kritikus útvonal)
  test("PDF feltöltésekor elindul a folyamat és sikeresen befejeződik", async () => {
    const { container } = render(<SDSUploader />);

    const file = new File(["dummy content"], "test-sds.pdf", {
      type: "application/pdf",
    });
    const input = container.querySelector<HTMLInputElement>('input[type="file"]');

    // Biztonsági ellenőrzés: a rejtett inputnak léteznie kell
    expect(input).not.toBeNull();

    // Fájl kiválasztás szimulálása
    fireEvent.change(input!, { target: { files: [file] } });

    // Ellenőrizzük, hogy megjelent-e a feldolgozás állapot
    expect(screen.getByText(/Feldolgozás alatt/i)).toBeInTheDocument();

    // Idő pörgetése előre a setInterval miatt (3 mp)
    act(() => {
      jest.advanceTimersByTime(3500);
    });

    // Siker állapot ellenőrzése
    expect(screen.getByText(/Feldolgozás sikeres/i)).toBeInTheDocument();
    expect(screen.getByText(/Eredmények megtekintése/i)).toBeInTheDocument();
  });

  // 3. Hiba állapot: Rossz fájlformátum (US-01/AC2)
  test("Hibaüzenetet dob nem PDF fájl esetén", () => {
    const { container } = render(<SDSUploader />);

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
    const { container } = render(<SDSUploader />);

    const largeFile = new File([""], "big.pdf", { type: "application/pdf" });
    Object.defineProperty(largeFile, "size", { value: 25 * 1024 * 1024 }); // 25MB

    const input = container.querySelector<HTMLInputElement>('input[type="file"]');
    expect(input).not.toBeNull();
    fireEvent.change(input!, { target: { files: [largeFile] } });

    expect(
      screen.getByText(/mérete nem haladhatja meg a 20MB-ot/i)
    ).toBeInTheDocument();
  });

  // 5. Retry funkció tesztelése (Interakció)
  test("Hiba után az Újra gomb visszaállítja az alapállapotot", () => {
    const { container } = render(<SDSUploader />);

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
