# ADR 0003 – Infrastructure as Code (IaC) stratégia

**Dátum:** 2025-11-13  
**Státusz:** Elfogadva  x
**Hivatkozás:** [ADR-0001 Kezdeti technológiai stack](./0001-first-tech-choice.md), [ADR-0002 Deployment és Hosting stratégia](./0002-deployment-target.md)

## Kontextus
A ChemRisk alkalmazás (Next.js frontend, NestJS backend, Python OCR, PostgreSQL) több futtatókörnyezetet és szolgáltatást érint (Vercel, Railway/VPS). A fejlesztői környezet és az éles környezet közötti paritás fenntartása, valamint a környezeti változók (pl. `DATABASE_URL`, `API_SECRET`) biztonságos és konzisztens kezelése manuálisan ("ClickOps") hibaérzékeny és nem auditálható folyamat.

Szükségünk van egy olyan megoldásra, amely dokumentálja az infrastruktúrát, és lehetővé teszi a változások előzetes ellenőrzését (preview), még mielőtt azok élesednének.

## Döntés
**Terraform** használata az infrastruktúra deklaratív leírására, az alábbi megkötésekkel az MVP fázisban:

1.  **Eszköz:** Terraform (HCL szintaxis).
2.  **Scope (Hatókör):**
    * **Vercel Project konfiguráció:** A frontend beállítások és domainek kódként való kezelése (Vercel Provider használatával).
    * **Környezeti változók:** A titkosítást nem igénylő változók (pl. public API URL-ek) és a secret hivatkozások szinkronizálása a szolgáltatók között.
    * **Adatbázis (opcionális):** A felhő alapú PostgreSQL példány paramétereinek leírása.
3.  **Munkafolyamat (Workflow) - "Plan Minimum":**
    * A CI/CD pipeline (GitHub Actions) részeként minden Pull Request-nél lefut a `terraform plan`.
    * **Nem automatizáljuk az `apply`-t:** Az MVP fázisban a módosítások jóváhagyása után a tényleges infrastruktúra-módosítást (apply) egy kijelölt DevOps felelős futtatja manuálisan vagy egy külön jóváhagyási kör után (manual approval step). Ez csökkenti a véletlen rombolás kockázatát.

## Alternatívák

### 1. Pulumi
* **Előny:** TypeScript-ben írható infrastruktúra, ami a csapat stackjéhez (Next.js/NestJS) közelebb áll.
* **Hátrány:** Kisebb közösségi modul-könyvtár, mint a Terraformnál; az állapotkezelés (state management) tanulási görbéje eltérő lehet.

### 2. Manuális Provisioning ("ClickOps")
* **Előny:** A leggyorsabb indulás, nincs extra kód.
* **Hátrány:** Nem reprodukálható; ha törlődik egy projekt véletlenül, a beállítások elvesznek. Nincs audit log arról, ki állította át a környezeti változókat.

### 3. Shell Scriptek / Makefiles
* **Előny:** Egyszerű parancsok.
* **Hátrány:** Imperatív (hogyan csináld) a deklaratív (mit szeretnék) helyett; nem kezeli az állapotot (pl. nem tudja, hogy egy erőforrás már létezik-e, ezért duplikálhat).

## Következmények

### Pozitív
* **Auditálhatóság:** A `terraform plan` kimenete ("artefakt") a PR-ekben pontosan megmutatja, mi fog változni az infrastruktúrában (pl. "+ create environment variable").
* **Biztonság:** A konfigurációs hibák (pl. rossz API URL) kiderülnek a `plan` fázisban, nem az éles deploy után.
* **Dokumentáció:** Az `.tf` fájlok naprakész dokumentációként szolgálnak a rendszer felépítéséről.

### Negatív
* **Kezdeti befektetés:** A Terraform setup (backend state konfigurálása pl. S3-ban vagy Terraform Cloud-ban) időt igényel a sprint elején.
* **State Management:** Oda kell figyelni a `terraform.tfstate` fájl biztonságára (nem kerülhet git-be!), különben érzékeny adatok szivároghatnak ki.
