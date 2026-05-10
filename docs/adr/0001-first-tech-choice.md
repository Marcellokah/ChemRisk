# 0001: Kezdeti technológiai stack kiválasztása

- Dátum: 2025-10-16
- Státusz: Elfogadva

## Kontextus

A projekt (ChemRisk) célja, hogy a biztonsági adatlapokból (SDS) automatikusan strukturált adatokat nyerjen ki (CAS-számok, H- és P-mondatok, összetevők, koncentrációk), és ezekből exportálható táblázatokat és expozíciós mátrixokat készítsen. A PRD és a felhasználói interjúk alapján a fő igények:

- Gyors, megbízható adatkinyerés és normalizálás (CAS, H-mondatok, összetevők) — több interjúalany is ezt emelte ki.
- Tömeges feltöltés és tömeges export, egyszerű keresés és összehasonlítás (bulk műveletek).
- Auditálhatóság, verziókövetés és státuszjelentések vállalati/vezetői igényekhez.
- GDPR és jogszabályi megfelelés, valamint későbbi nemzetközi kiterjeszthetősége.

A piaci áttekintésből (competitors.csv) látható, hogy vannak nagy, teljeskörű EHS rendszerek (pl. Sphera) és speciális SDS-kinyerő szolgáltatások (pl. niche SaaS-ok). A versenyelőnyünk az lehet, hogy egy könnyen integrálható, API-first, kifejezetten SDS-kinyerésre és exportokra optimalizált terméket készítünk, amely auditálható workflow-val és egyszerű felhasználói felülettel célozza a kis- és középvállalati (SME) felhasználókat.

## Döntés

Az első technológiai döntés: a gyors iterációt és a tipizált fejlesztést elősegítő JavaScript/TypeScript-alapú stacket választjuk, részletek:

- Frontend: Next.js (React) + TypeScript

  - Indoklás: gyors fejlesztés, SSR/SSG lehetőségek, kész komponenskönyvtárak (UI kit), egyszerű deploy (Vercel), és a célközönség számára könnyen használható, reszponzív webes UI megvalósítható.

- Backend: Node.js + NestJS + TypeScript

  - Indoklás: NestJS strukturált, moduláris és DI-alapú keretrendszer, erős TypeScript támogatással, jó alap REST/OpenAPI generálásra és skálázható szerkezetre. Támogatja a háttérfeladatokat (queueing), moduláris integrációt külső OCR/ML szolgáltatásokkal és jó közösségi támogatással.

- Adatbázis: PostgreSQL

  - Indoklás: relációs, megbízható, jól támogatott; szükséges a konzisztensek, auditálható relációkhoz (verziózás, státuszok, user actions). Használatára ajánlott ORM: Prisma (TypeScript-compatibilitás, migrációk egyszerű kezelése).

- API-s kommunikáció és integrációk

  - Elsődleges belső API: REST + OpenAPI (egyszerű fogyaszthatóság és dokumentálhatóság). A belső frontend-backend integrációhoz tetszés szerint használható tRPC későbbi prototípusokhoz, de a kiindulási szerződés OpenAPI/REST legyen a külső integrációk miatt.

- Feldolgozó / ML komponensek

  - Nagy memória-/GPU-igényű OCR és ML feldolgozást (pl. speciális modellek, PDF parsing pipeline) külön szolgáltatásként tervezzük (Python alapú microservice), amelyet a Node/NestJS backend hív REST API-n vagy üzenetközvetítéssel (pl. RabbitMQ / Redis + BullMQ) a háttérmunkák indításához.

- Telepítés / CI
  - Frontend: Vercel (gyors previewek), Backend: Railway / Fly / Docker container registry + egyszerű CI (GitHub Actions). Lokális fejlesztés Docker-compose-tal, a folyamatok reproducibility érdekében.

## Megfontolt alternatívák

- Vue 3 + Vite + Supabase

  - Előny: Supabase beépített auth és adatbázis-szolgáltatások, gyors prototipizálás.
  - Hátrány: a csapat tapasztalata erősebben a React/Next.js irányában van, Supabase korábban nem volt célzottan auditált enterprise igényekre optimalizálva.

- Django (Python) + React

  - Előny: beépített admin és erős Python ökoszisztéma az ML/QR/regex feladatokhoz.
  - Hátrány: két nyelv/stack fenntartása növeli a build/infra komplexitását az MVP fázisban; kivéve ha az OCR/ML feladatokat külön Python szolgáltatásként valósítjuk meg (amit a döntés támogat).

- Node.js + Express (vagy Fastify) egyszerűbb backend
  - Előny: kisebb kezdeti komplexitás.
  - Hátrány: kevesebb beépített szerkezeti konvenció, nagyobb kezdeti döntési terület (választások a project layout, DI, modulhatárok terén) — NestJS meglévő konvenciók mentén gyorsítja a szervezett fejlesztést.

## Következmények

- Előnyök

  - Gyors prototipizálás és rövid onboarding a TypeScript-ekoszisztéma miatt.
  - Kész eszközkészlet a webes UI-hoz (Next.js) és jól szervezett szerveroldali architektúra (NestJS) a bővíthetőséghez.
  - PostgreSQL + Prisma biztosítja az auditálható, tranzakciókezelhető adattárolást.

- További fejlesztési és üzemeltetési teendők

  - Külön microservice szükséges az OCR/ML feladatokhoz (Python), ami infra- és kommunikációs terveket igényel (auth, retry, idempotency, költségbecslés).
  - Háttérfeldolgozási rendszer bevezetése (Redis + BullMQ, vagy RabbitMQ) a tömeges SDS-feldolgozás miatt.
  - Audit-log és verziókövetés az adatobjektumokra (ki, mikor, mit módosított) — tervezési követelmény a GDPR és megfelelőségi igények miatt.
  - Biztonsági és adatvédelmi követelmények (titkosítás, hozzáférés-szabályozás, backup stratégia).
  - Rendszeres dependency-audit és sebezhetőség-ellenőrzés (eszközök: Dependabot / Snyk / GitHub Security).

- Következmények a csapat és roadmap szemszögéből
  - Kezdetben TypeScript-only fejlesztők aránya növeli a hatékonyságot; a Python tudás szükséges lesz az ML/OCR komponensekhez (külső partner vagy belső fejlesztés döntendő a Sprint 2-3 során).
  - A választott architektúra elősegíti az API-first gondolkodást, ami könnyíti az integrációt a későbbi partner/szállítói rendszerekkel (pl. Chemwatch, belső EHS rendszerek).