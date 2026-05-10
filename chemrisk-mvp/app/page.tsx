// app/page.tsx
import SDSUploader from "./components/SDSUploader";
import Header from "./components/Header";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Header />

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
