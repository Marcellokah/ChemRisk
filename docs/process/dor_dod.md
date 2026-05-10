# DoR / DoD – Sprint 2

## Definition of Ready (DoR)
*Mikor kezdhető el egy feladat fejlesztése?*

- [x] **Story:** INVEST elveknek megfelel, User Story formátum (As a... I want to... So that...).
- [x] **AC:** Elfogadási kritériumok (Given-When-Then) tisztázva vannak minden fő ágra (Happy path + Error case).
- [x] **Design:** Wireframe-ek rendelkezésre állnak az állapotokról (Üres, Töltés, Hiba, Siker).
- [x] **Tech:** Technológiai döntések (ADR) megszülettek (pl. Next.js, Deployment target).

## Definition of Done (DoD)
*Mikor tekinthető késznek a feladat a Sprintben?*

- [x] **Tesztek:**
    - Unit/Integration tesztek sikeresen lefutnak (0 failure).
    - Code Coverage ≥ 60% (Statement/Line).
- [x] **Füstteszt:**
    - A buildelt alkalmazás elindul (`npm start`), és a főoldal 200 OK státuszt ad (`smoke.http`).
- [x] **Infrastruktúra:**
    - Terraform `validate` és `plan` hiba nélkül lefut.
- [x] **Dokumentáció:**
    - Traceability mátrix frissítve.
    - Új fájlok/modulok esetén README vagy kommentek a kódban.
- [x] **Review:**
    - Pull Request létrehozva, screenshot csatolva a működésről.
