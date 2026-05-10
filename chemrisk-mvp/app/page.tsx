// app/page.tsx
import SDSUploader from "./components/SDSUploader";
import Header from "./components/Header";

export default function Home() {
  return (
    <main className="app-shell text-[color:var(--foreground)]">
      <Header />

      <section className="app-container app-section">
        <div className="app-gridlines relative overflow-hidden rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface)] px-6 py-10 shadow-[var(--shadow)] sm:px-10 lg:px-14">
          <div className="mx-auto max-w-4xl text-center">
            <div className="app-kicker mb-5">
              <span className="h-2 w-2 rounded-full bg-[color:var(--accent)]" />
              Vegyi adatlap feldolgozás
            </div>
            <h1 className="app-heading text-4xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-5xl lg:text-6xl">
              Biztonsági adatlapokból strukturált adatok egy kattintással.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[color:var(--muted)] sm:text-lg">
              A ChemRisk kinyeri a CAS-számokat, H-mondatokat, összetevőket és a megfelelőségi információkat, majd rendezett áttekintő nézetben mutatja meg.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm">
              <span className="app-chip app-soft-accent">PDF támogatás</span>
              <span className="app-chip">REACH / CLP</span>
              <span className="app-chip app-soft-success">Biztonságos mentés</span>
            </div>
          </div>

          <div className="mt-10">
            <SDSUploader />
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="app-card-soft p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">Lépés 1</p>
              <p className="mt-2 font-medium">Töltsd fel a PDF-et</p>
            </div>
            <div className="app-card-soft p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">Lépés 2</p>
              <p className="mt-2 font-medium">Automatikus kinyerés</p>
            </div>
            <div className="app-card-soft p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">Lépés 3</p>
              <p className="mt-2 font-medium">Áttekintés és export</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
