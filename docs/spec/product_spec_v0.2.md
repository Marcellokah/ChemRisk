# Product Spec v0.2: ChemRisk MVP

## Cél
A ChemRisk MVP célja, hogy validálja az automatikus adatkinyerés technikai megvalósíthatóságát és felhasználói értékét. A rendszer lehetővé teszi az EHS specialisták (pl. Anna) számára, hogy manuális gépelés helyett egy biztonsági adatlap (PDF) feltöltésével automatikusan kinyerjék a kritikus adatokat (összetevők, CAS számok, H- és P-mondatok). Ezzel a folyamat ideje és a hibázási lehetőség radikálisan csökken, előkészítve az adatokat a további kockázatelemzéshez.

## Scope (In/Out)
**In (MVP fókusz):**
- **Single Upload:** Egyedi biztonsági adatlap (PDF) feltöltése és validálása.
- **Auto-Extraction:** Szöveges adatkinyerés (OCR/NLP) a dokumentumból: Terméknév, Összetevők listája, CAS számok, Veszélyességi osztályok, H- és P-mondatok.
- **Data Review:** A kinyert adatok strukturált megjelenítése egy ellenőrző nézetben (Web UI).
- **Export:** Az ellenőrzött adatok letöltése CSV vagy Excel formátumban (további elemzéshez).

**Out (Későbbi fázisok):**
- Tömeges feltöltés (Bulk upload).
- Képjavító algoritmusok (rossz minőségű szkennelt dokumentumokhoz).
- Felhasználókezelés és jogosultsági szintek (Admin/User).
- Beépített jogi tanácsadás vagy teljes expozíciós mátrix generálás a felületen belül.

## User Story térkép
- **US-01: Dokumentum feltöltése**
  - *Mint EHS specialista, szeretnék feltölteni egy PDF-et, hogy a rendszer elkezdhesse a feldolgozást.*
- **US-02: Kinyert adatok áttekintése**
  - *Mint labor felelős, szeretném látni a kinyert CAS számokat és veszélyességi mondatokat táblázatos formában, hogy ellenőrizhessem a helyességüket.*
- **US-03: Adatok exportálása**
  - *Mint EHS specialista, szeretném letölteni az adatokat Excelben, hogy beilleszthessem a saját kockázatelemzési sablonomba.*

## NFR (Mérhető nem-funkcionális követelmények)
- **NFR-1 (Teljesítmény):** Egy átlagos (8-12 oldalas) PDF feldolgozási ideje < 15 másodperc.
- **NFR-2 (Pontosság):** A CAS számok felismerési pontossága ≥ 90% tiszta, digitális PDF esetén.
- **NFR-3 (Stabilitás):** Smoke test pass ≥ 95% a CI pipeline futása alatt.
- **NFR-4 (Build):** Build és deploy idő < 3 perc (CI).

## Fő AC-k (Given–When–Then)
**AC1: Sikeres feltöltés és feldolgozás**
- **Given:** A felhasználó a "Feltöltés" oldalon van.
- **When:** Kiválaszt egy érvényes PDF biztonsági adatlapot és a "Feldolgozás" gombra kattint.
- **Then:** Megjelenik egy töltőképernyő (spinner), majd sikeres feldolgozás esetén átirányít az "Eredmények" oldalra, ahol a mezők (pl. CAS szám) ki vannak töltve.

**AC2: Hibás fájl kezelése**
- **Given:** A felhasználó a feltöltő felületen van.
- **When:** Nem PDF formátumot (pl. .jpg, .docx) vagy sérült fájlt próbál feltölteni.
- **Then:** A rendszer hibaüzenetet jelenít meg ("Csak érvényes PDF fájl tölthető fel") és felajánlja az újbóli próbálkozást (Retry).

**AC3: Export funkció működése**
- **Given:** A felhasználó az "Eredmények" oldalon látja a kinyert adatokat.
- **When:** Az "Exportálás CSV-be" gombra kattint.
- **Then:** A böngésző letölt egy .csv fájlt, amely tartalmazza a kinyert adatokat (Terméknév;CAS;H-mondatok) megfelelő karakterkódolással (UTF-8).
