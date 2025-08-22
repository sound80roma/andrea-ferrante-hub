export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-6 md:grid-cols-3">
        <div>
          <div className="font-semibold">Andrea Ferrante</div>
          <p className="text-sm text-slate-600 mt-2">
            Costruisco piccole applicazioni utili per la vita reale. Questo hub raccoglie tutti i miei progetti.
          </p>
        </div>
        <div>
          <div className="font-semibold">Tecnologie</div>
          <ul className="text-sm text-slate-600 mt-2 space-y-1 list-disc pl-5">
            <li>Next.js / React</li>
            <li>Tailwind CSS</li>
            <li>Vercel (deploy)</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold">Contatti</div>
          <p className="text-sm text-slate-600 mt-2">
            Scrivimi: <a className="underline" href="mailto:info@andreaferrante.online">info@andreaferrante.online</a>
          </p>
        </div>
      </div>
      <div className="text-center text-xs text-slate-500 pb-8">
        © {new Date().getFullYear()} Andrea Ferrante · Tutti i diritti riservati
      </div>
    </footer>
  );
}
