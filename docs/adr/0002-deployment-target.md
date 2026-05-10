# ADR 0002 – Deployment és Hosting stratégia

**Dátum:** 2025-11-13  
**Státusz:** Elfogadva
**Hivatkozás:** [ADR-0001 Kezdeti technológiai stack](./0001-first-tech-choice.md)

## Kontextus
A ChemRisk projekt architektúrája (lásd ADR-0001) három fő komponensből áll, amelyek eltérő futtatási környezetet igényelnek:
1.  **Frontend:** Next.js (SSR/SSG, TypeScript) – *Igény: Preview URL-ek, gyors CDN.*
2.  **Backend:** NestJS (Node.js) + PostgreSQL – *Igény: Folyamatosan futó szerver, adatbázis kapcsolat.*
3.  **OCR/ML Service:** Python microservice – *Igény: Docker konténer támogatás, esetleges GPU skálázhatóság.*

Olyan megoldást keresünk, amely minimalizálja a DevOps terheket (NoOps/PaaS), támogatja a CI/CD automatizmust (preview környezetek PR-onként), és költséghatékony az MVP fázisban.

## Döntés
Hibrid PaaS (Platform as a Service) megközelítést alkalmazunk:

1.  **Frontend: Vercel**
    * **Indoklás:** A Next.js keretrendszer alkotója, "zero-config" deployment, automatikus preview URL-ek minden Pull Requesthez (kritikus a tesztelőknek), kiváló Edge Network teljesítmény.

2.  **Backend és Adatbázis: Railway (vagy alternatívaként Fly.io)**
    * **Indoklás:** Egyszerűen kezeli a multi-service projekteket (Monorepo támogatás).
    * Támogatja a **Dockerfile** alapú buildet (szükséges a Python OCR service-hez és a NestJS-hez).
    * Beépített, menedzselt **PostgreSQL** szolgáltatást nyújt (nem kell külön AWS RDS-t konfigurálni).
    * Könnyen összeköthető a Vercel-lel környezeti változókon keresztül.

## Alternatívák

### 1. Firebase Hosting + Cloud Functions
* **Előny:** Minden egy helyen (Google ökoszisztéma), ingyenes SSL.
* **Hátrány:** A Next.js SSR támogatása Firebase Functions-ön (vagy App Hostingon) lassabb "hideg indítással" (cold start) járhat, mint a Vercel Edge. A Python service és a relációs adatbázis (Postgres) integrációja bonyolultabb (a Firebase inkább NoSQL/Firestore-ra optimalizált).

### 2. VPS (Virtual Private Server - pl. DigitalOcean, AWS EC2) + Docker Compose
* **Előny:** Teljes kontroll, fix havidíj.
* **Hátrány:** Magas karbantartási igény (biztonsági frissítések, manuális CI/CD pipeline építése, load balancing, SSL tanúsítványok kezelése). Az MVP fázisban ez felesleges komplexitás.

### 3. AWS (Amplify + RDS + ECS/Lambda)
* **Előny:** Ipari standard, végtelenül skálázható.
* **Hátrány:** Túl meredek tanulási görbe és konfigurációs idő (Terraform/CloudFormation) egy kis csapathoz képest.

## Következmények

### Pozitív
* **Fejlesztői élmény (DX):** A `git push` automatikusan deployol mindent (Frontend -> Vercel, Backend -> Railway).
* **Validáció:** A Preview URL-ek segítségével a tesztelők (pl. Anna, Bence a user storykból) azonnal ki tudják próbálni a fejlesztéseket anélkül, hogy lokálisan futtatnák a kódot.
* **Skálázhatóság:** A komponensek külön skálázhatók (ha az OCR lassú, a frontend attól még gyors marad).

### Negatív
* **Vendor Lock-in:** A Vercel-specifikus funkciók (pl. Vercel Postgres vagy Edge Functions) túlzott használata megnehezítheti a későbbi migrációt. *Mitigáció: Maradjunk a standard Next.js API-knál, ahol lehet.*
* **Költség menedzsment:** Két külön szolgáltatónál (Vercel + Railway) keletkezik számla, amit figyelni kell a free tier átlépésekor.
