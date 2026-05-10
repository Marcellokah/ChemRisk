Feature: Kinyert adatok ellenőrzése (US-02)
  Mint labor felelős, szeretném látni és javítani a kinyert adatokat, 
  hogy biztosítsam a megfelelőséget.

  Scenario: Kinyert adatok megjelenítése az űrlapon
    Given a "Hypo_SDS.pdf" fájl feldolgozása sikeresen befejeződött
    When a felhasználó megnyitja az ellenőrző nézetet
    Then a "Terméknév" mezőben látja: "Hypo"
     And a "CAS szám" mezőben látja: "7681-52-9"
     And a "H-mondatok" mezőben látja: "H314"

  Scenario: Pontatlan adat javítása
    Given a felhasználó az ellenőrző nézeten van
     And a "CAS szám" mezőben hibás "12345" érték szerepel
    When átírja a "CAS szám" mezőt erre: "1310-73-2"
    Then a mező tartalma frissül "1310-73-2" értékre

  Scenario: Mentés megakadályozása hiányzó adatnál
    Given a "CAS szám" mező üres
    When a "Mentés és Jóváhagyás" gombra kattint
    Then lát "Kötelező mező" hibaüzenetet a "CAS szám" alatt
     And a mentés nem történik meg
     And a felhasználó az oldalon marad
