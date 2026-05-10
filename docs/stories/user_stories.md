# User Stories (Sprint 2)

> Minimum: 5 story (INVEST). Legalább 2 story AC-ját automatizáld.

## INVEST ellenőrzőlista
- Independent, Negotiable, Valuable, Estimable, Small, Testable

---

### US‑01: Biztonsági adatlap (PDF) feltöltése
**As a** EHS specialista (Anna)
**I want to** feltölteni egy PDF formátumú biztonsági adatlapot
**So that** a rendszer automatikusan kinyerhesse belőle a szükséges adatokat a kézi gépelés helyett

> *Insight: "Jelenleg biztonsági adatlapokat PDF formátumban gyűjt, és kézzel másolja át az adatokat... Ha lenne egy eszköz, ami automatikusan kinyerné... rengeteg időt spórolnék."*

Acceptance Criteria (Given–When–Then):
- AC1: **Sikeres feltöltés:** Ha érvényes PDF-et választok ki, a feltöltés elindul, és töltőképernyő jelzi a folyamatot.
- AC2: **Formátum validáció:** Ha nem PDF fájlt (pl. .docx, .jpg) próbálok feltölteni, a rendszer hibaüzenetet dob és nem indítja el a feldolgozást.
- AC3: **Fájlméret korlát:** Ha a fájl nagyobb mint 20MB, a rendszer figyelmeztet és elutasítja a feltöltést.

Automatizálás: `tests/acceptance/sds_upload.feature`

---

### US‑02: Kinyert adatok (CAS, H-mondatok) ellenőrzése és javítása
**As a** Labor felelős (Bence)
**I want to** áttekinteni és szerkeszteni az automatikusan felismert mezőket (CAS számok, H-mondatok)
**So that** biztosíthassam az adatok helyességét a véglegesítés előtt

> *Insight: "Új anyag bevezetésekor minden adatot kézzel kell felvinni és ellenőrizni... előforduló emberi hibák nehezen nyomon követhetők."*

Acceptance Criteria (Given–When–Then):
- AC1: **Adatmegjelenítés:** A sikeres feldolgozás után az űrlap mezői (Terméknév, CAS, H-mondatok) előre ki vannak töltve a kinyert adatokkal.
- AC2: **Szerkeszthetőség:** Minden mező szerkeszthető, ha az OCR pontatlan volt.
- AC3: **Mentés:** A "Mentés és Jóváhagyás" gomb csak akkor aktív, ha minden kötelező mező ki van töltve.

Automatizálás: `tests/acceptance/data_review.feature`

---

### US‑03: Figyelmeztetés hiányzó kritikus adatokra
**As a** EHS menedzser (Flóra)
**I want to** automatikus figyelmeztetést látni, ha kritikus mezők (pl. CAS szám) üresek maradtak
**So that** ne kerülhessen a rendszerbe hiányos vagy nem megfelelő adatlap

> *Insight: "Értékesnek tartja az automatizált figyelmeztetéseket a hiányzó vagy ellentmondó adatokra... Hiányzik az automatikus ellenőrzés."*

AC példák:
- AC1: Ha a CAS szám mező üres a mentési kísérletkor, a mező piros keretet kap és hibaüzenet jelenik meg ("Kötelező mező").
- AC2: Ha a H-mondat formátuma nem szabványos (pl. hiányzik a 'H' betű), a rendszer "warning" jelzést ad.

---

### US‑04: Feldolgozott anyagok listázása és státuszuk
**As a** Munkavédelmi adminisztrátor (Ernő)
**I want to** látni a feltöltött dokumentumok listáját és azok státuszát (Feldolgozás alatt, Ellenőrzésre vár, Kész)
**So that** nyomon követhessem, hol tart a folyamat és mely adatlapokkal van még teendő

> *Insight: "Nehezen nyomon követhető, mikor melyik SDS frissült utoljára... A manuális adatbevitel és ellenőrzés időigényes."*

AC példák:
- AC1: A lista időrendben csökkenő sorrendben mutatja az elemeket.
- AC2: Minden elem mellett egyértelmű státusz badge (címke) látható színkóddal (pl. Sárga: Ellenőrzésre vár, Zöld: Kész).

---

### US‑05: Strukturált adat exportálása (CSV/Excel)
**As a** EHS adminisztrátor (Dorka)
**I want to** a jóváhagyott adatokat standard CSV/Excel formátumban letölteni
**So that** beilleszthessem őket a meglévő kémiai kockázatértékelési jelentéseimbe

> *Insight: "Szeretne egy egyszerű felületet, ahol gyorsan lehet keresni és exportálni szabványosított riportokat... Ha egy kattintással kapnám meg... nagyban egyszerűsítené a munkám."*

AC példák:
- AC1: Az "Export" gombra kattintva elindul a letöltés.
- AC2: Az exportált fájl külön oszlopokban tartalmazza a Terméknevet, CAS számot és a H-mondatokat, UTF-8 kódolással.
