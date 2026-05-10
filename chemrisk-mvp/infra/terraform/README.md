# ChemRisk Infrastructure (Terraform)

Ez a könyvtár tartalmazza az infrastruktúra kód alapú leírását (IaC).
A jelenlegi verzió a `validate` és `plan` folyamatok tesztelésére szolgál.

## Előfeltételek
- Terraform CLI (>= 1.5.7) telepítése: `brew install terraform` (macOS)

## Használat (Lokális)
1. Inicializálás:
   ```bash
   terraform init