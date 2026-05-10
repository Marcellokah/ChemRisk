# Wireframes – ChemRisk MVP Flow

A drótvázak a rendszer fő felhasználói útvonalát (Happy Path és Edge Cases) mutatják be: a biztonsági adatlap feltöltésétől az adatok ellenőrzéséig.

## 01-upload-empty.png (Kezdőképernyő)
**Cél:** A felhasználó egyértelműen azonosítsa a fő funkciót (PDF feltöltés) és elindíthassa a folyamatot zavaró tényezők nélkül.  
**Interakciók:** - Drag & Drop zóna használata.
- „Új elem hozzáadása” / „Feltöltés” gomb kattintása.
- Navigáció a felső menüben (Dokumentumok vs. Feltöltés).
**Állapotok:** - Üres (Empty State): nincs még feltöltött adat, tiszta CTA.
**Megjegyzések:** A design minimalista, hogy a figyelem a „Dropzone”-ra terelődjön.  
**Hivatkozások:** - Story: US-01 (Biztonsági adatlap feltöltése)
- AC: AC1 (Sikeres feltöltés indítása)
- Teszt: `tests/acceptance/sds_upload.feature` (Scenario: Érvényes PDF)

---

## 02-processing-success.png (Feldolgozás és Siker)
**Cél:** Visszajelzés adása a felhasználónak a háttérben zajló OCR/NLP folyamatról, majd a siker megerősítése és továbbirányítás.  
**Interakciók:** - Várakozás (nincs interakció a töltés alatt).
- „Eredmények megtekintése” gomb (csak siker esetén aktív).
**Állapotok:** - Loading: Progress bar vagy spinner animáció.
- Success: Zöld pipa ikon, validált fájlnév megjelenítése.
**Megjegyzések:** Fontos a technikai visszajelzés (NFR-1: < 15 mp), hogy a felhasználó tudja, a rendszer dolgozik.  
**Hivatkozások:** - Story: US-01
- AC: AC1 (Átirányítás az eredményekre)
- Teszt: `tests/acceptance/sds_upload.feature`

---

## 03-error-state.png (Hiba kezelése)
**Cél:** A felhasználó tájékoztatása a sikertelen feltöltés okáról (pl. rossz formátum) és gyors visszaterelés a folyamatba.  
**Interakciók:** - „Újra megpróbálom” gomb (Reset).
**Állapotok:** - Error: Piros ikon, jól olvasható, konkrét hibaüzenet (pl. "Csak PDF").
**Megjegyzések:** A hibaüzenet nem lehet generikus "Hiba történt", specifikusnak kell lennie (fájlméret vagy formátum).  
**Hivatkozások:** - Story: US-01
- AC: AC2 (Érvénytelen formátum), AC3 (Fájlméret)
- Teszt: `tests/acceptance/sds_upload.feature` (Scenario: Érvénytelen fájlformátum)

---

## 04-data-review.png (Adatok ellenőrzése – Tervezett)
*(Ez a nézet következik a "Siker" után, a fejlesztés következő lépése)*
**Cél:** Az EHS specialista vagy laboros áttekinthesse és szükség esetén javíthassa az automatikusan kinyert adatokat (CAS, H-mondatok).  
**Interakciók:** - Input mezők szerkesztése (Terméknév, CAS szám).
- „Mentés és Jóváhagyás” gomb.
- Validációs üzenetek megjelenése (pl. hiányzó kötelező mező).
**Állapotok:** - Review: Előre kitöltött űrlap az OCR eredményeivel.
- Dirty/Edited: Ha a felhasználó módosít egy mezőt.
**Megjegyzések:** Ez a képernyő felel meg a Bence (Labor felelős) által kért ellenőrzési funkciónak.  
**Hivatkozások:** - Story: US-02 (Kinyert adatok ellenőrzése)
- AC: AC1 (Adatmegjelenítés), AC2 (Szerkeszthetőség)
- Teszt: `tests/acceptance/data_review.feature`
