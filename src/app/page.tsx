import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-100 p-8">
      <div className="max-w-lg rounded-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-sky-700 p-10 text-center text-white shadow-xl">
        <div className="mb-4 text-5xl">🐾</div>
        <h1 className="mb-2 text-4xl font-black tracking-tight">PETSHOP</h1>
        <p className="mb-1 text-lg font-semibold opacity-90">
          Arquitetura X4 com Next.js
        </p>
        <p className="text-sm opacity-70">
          Actions · Handlers · Use Cases · Repositories · Drizzle + SQLite
        </p>
      </div>
      <Link
        href="/pets"
        className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
      >
        Ver Pets Cadastrados →
      </Link>
    </main>
  );
}
