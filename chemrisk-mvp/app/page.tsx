// app/page.tsx
import SDSUploader from "./components/SDSUploader";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white font-bold p-2 rounded">
              CR
            </div>
            <span className="text-xl font-bold tracking-tight">ChemRisk</span>
          </div>
          <nav className="hidden md:flex space-x-6 text-sm font-medium text-slate-600">
            <Link href="/files" className="hover:text-blue-600 my-auto">
              Dokumentumok kezelése
            </Link>
            <a
              href="#"
              className="text-blue-600 bg-blue-50 px-3 py-1 rounded-md"
            >
              Feltöltés
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Biztonsági adatlap feltöltése
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            A rendszer automatikusan kinyeri a CAS-számokat, H-mondatokat és az
            összetevőket.
          </p>
        </div>

        {/* Component Injection */}
        <SDSUploader />

        {/* Helper Text / Trust Signals */}
        <div className="mt-12 text-center text-sm text-slate-400">
          <p>Támogatott formátum: PDF (max 20MB) • Megfelelés: REACH, CLP</p>
        </div>
      </section>
    </main>
  );
}
