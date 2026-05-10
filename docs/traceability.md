# Traceability – Sprint 2: ChemRisk MVP

| Story | AC | Teszt(ek) (File / Scenario) | Kód (Fő komponens) | CI Lépés |
| :--- | :---: | :--- | :--- | :--- |
| **US‑01** | AC1 | `__tests__/SDSUploader.test.tsx`<br>*(Rendereli az üres állapotot...)* | `app/components/SDSUploader.tsx`<br>`app/page.tsx` | unit / test |
| **US‑01** | AC1 | `__tests__/SDSUploader.test.tsx`<br>*(PDF feltöltésekor elindul...)* | `app/components/SDSUploader.tsx` | unit / test |
| **US‑01** | AC2 | `__tests__/SDSUploader.test.tsx`<br>*(Hibaüzenetet dob nem PDF...)* | `app/components/SDSUploader.tsx` | unit |
| **US‑01** | AC3 | `__tests__/SDSUploader.test.tsx`<br>*(Hibaüzenetet dob 20MB-nál...)* | `app/components/SDSUploader.tsx` | unit |
| **US‑01** | - | `app/scripts/smoke.http`<br>`app/scripts/smoke.yaml` | `app/deploy/target.yaml` | smoke |
| **Infra** | IaC | `infra/terraform/main.tf`<br>`terraform validate` | `infra/terraform/*.tf` | build / plan |
