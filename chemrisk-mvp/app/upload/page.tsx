import Link from "next/link";
import Header from "../components/Header";
import SDSUploader from "../components/SDSUploader";

export default function UploadPage() {
  return (
    <main className="app-shell text-[color:var(--foreground)]">
      <Header />

      <section className="app-container app-section">
        <div className="mx-auto max-w-4xl">
          <Link href="/" className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[color:var(--accent-strong)] hover:underline">
            &larr; Vissza a kezdőlapra
          </Link>

          <div className="mb-8 max-w-2xl">
            <div className="app-kicker mb-4">Feltöltés</div>
            <h1 className="app-heading text-4xl font-semibold tracking-tight sm:text-5xl">
              PDF biztonsági adatlap feltöltése
            </h1>
            <p className="mt-4 text-base leading-7 text-[color:var(--muted)] sm:text-lg">
              Húzd ide a dokumentumot vagy tallózz egy fájlt. A rendszer kinyeri a kulcsadatokat, majd elmenti az eredményeket a feldolgozott dokumentumok közé.
            </p>
          </div>

          <SDSUploader />

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            <div className="app-card-soft p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">Formátum</p>
              <p className="mt-2 font-medium">PDF, max. 20MB</p>
            </div>
            <div className="app-card-soft p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">Feldolgozás</p>
              <p className="mt-2 font-medium">CAS, H- és P-mondatok</p>
            </div>
            <div className="app-card-soft p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">Mentés</p>
              <p className="mt-2 font-medium">Eredmények és archívum</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}