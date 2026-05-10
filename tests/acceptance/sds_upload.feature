Feature: Biztonsági adatlap feltöltése (US-01)
  Mint EHS specialista, szeretnék PDF-et feltölteni, 
  hogy elinduljon az automatikus adatkinyerés.

  Scenario: Érvényes PDF sikeres feltöltése
    Given a felhasználó a "Feltöltés" oldalon van
    When kiválaszt egy érvényes "biztonsagi_adatlap.pdf" fájlt
     And a "Feldolgozás" gombra kattint
    Then megjelenik a töltőképernyő "Feldolgozás folyamatban..." felirattal
     And átirányításra kerül az "Eredmények" oldalra

  Scenario: Érvénytelen fájlformátum kezelése
    Given a felhasználó a "Feltöltés" oldalon van
    When kiválaszt egy "kep.jpg" fájlt
     And a "Feldolgozás" gombra kattint
    Then lát "Csak érvényes PDF fájl tölthető fel" hibaüzenetet
     And a feldolgozás nem indul el

  Scenario: Túl nagy fájlméret (Edge case)
    Given a felhasználó a "Feltöltés" oldalon van
    When kiválaszt egy 25MB méretű fájlt
    Then lát "A fájl mérete nem haladhatja meg a 20MB-ot" hibaüzenetet
     And a "Feldolgozás" gomb inaktív marad
