# Szakdolgozat
[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/VSPuLl7_)

Rövid leírás

- **Projekt:** ChemRisk MVP (kémiai biztonsági adatlapok automatikus feldolgozása)
- **Branch:** `sprint2`

Gyorsstart

- Telepítés:

```bash
cd chemrisk-mvp
npm ci
```

- Fejlesztői szerver indítása:

```bash
npm run dev
```

Helyi CI (egyparancsos)

Ez a repository tartalmaz egy egyszerű, egyparancsos helyi CI futtatót a `chemrisk-mvp` mappában, amely követi a CI lépéseket: build → test → coverage → preview → smoke → terraform plan.

- Futtatás npm-mel:

```bash
cd chemrisk-mvp
npm run ci-local
```

- Vagy Make segítségével:

```bash
cd chemrisk-mvp
make ci-local
```

Megjegyzés: a `ci-local` lépések részletei és a smoke-spec fájlok a `chemrisk-mvp` alatti `scripts/` és `app/scripts/` mappákban találhatók. A Terraform plan lépés csak akkor fut, ha a `terraform` elérhető a PATH-on; különben kihagyásra kerül.
