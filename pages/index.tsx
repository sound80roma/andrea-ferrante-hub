import { useMemo, useState } from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-6xl px-4 pb-24">
        <Hero />
        <QuickActions />
        <AppGrid />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b border-slate-200">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-slate-900 text-white grid place-content-center font-bold">AF</div>
          <div>
            <div className="text-sm uppercase tracking-wider text-slate-500">Andrea Ferrante</div>
            <div className="text-xs text-slate-400">app hub personale</div>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#apps" className="hover:text-slate-700">App</a>
          <a href="#about" className="hover:text-slate-700">Chi sono</a>
          <a href="#contact" className="hover:text-slate-700">Contatti</a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="py-12 md:py-16">
      <div className="grid gap-6 md:grid-cols-5 items-center">
        <div className="md:col-span-3">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Tutte le mie applicazioni,<br className="hidden md:block" /> in un unico posto.
          </h1>
          <p className="mt-4 text-slate-600 md:text-lg">
            Questo è lo spazio dove pubblico gli strumenti che creo insieme a ChatGPT: finanza
            personale, affitti, investimenti, produttività. Ogni app è semplice, chiara e pronta
            all'uso.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#apps" className="rounded-2xl bg-slate-900 text-white px-5 py-2.5 text-sm shadow hover:shadow-md transition">Sfoglia le app</a>
            <a href="#contact" className="rounded-2xl border border-slate-300 px-5 py-2.5 text-sm hover:bg-white">Suggerisci un'idea</a>
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold">Novità</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 list-disc pl-5">
              <li>🆕 ROI Autorimessa – calcola rientro e rendimento.</li>
              <li>🧪 In arrivo: Gestione affitto studenti.</li>
              <li>📈 Roadmap: Proiezione patrimonio 18 anni.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuickActions() {
  return (
    <section className="py-2">
      <div className="grid gap-3 md:grid-cols-3">
        <a href="#apps" className="rounded-2xl border border-slate-200 bg-white p-4 hover:shadow-sm transition">
          <div className="text-xs uppercase text-slate-500">Avvia</div>
          <div className="font-semibold">Apri l'ultima app usata</div>
        </a>
        <a href="#apps" className="rounded-2xl border border-slate-200 bg-white p-4 hover:shadow-sm transition">
          <div className="text-xs uppercase text-slate-500">Crea</div>
          <div className="font-semibold">Nuova app dalla mia idea</div>
        </a>
        <a href="#about" className="rounded-2xl border border-slate-200 bg-white p-4 hover:shadow-sm transition">
          <div className="text-xs uppercase text-slate-500">Info</div>
          <div className="font-semibold">Chi sono e contatti</div>
        </a>
      </div>
    </section>
  );
}

function AppGrid() {
  return (
    <section id="apps" className="mt-12">
      <div className="flex items-end justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold">Le mie App</h2>
        <span className="text-sm text-slate-500">v0.1 • prototipo</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AppCard title="ROI Autorimessa" emoji="🚗⚡" description="Calcola rendimento, rientro e margine netto di un'autorimessa o box.">
          <RoiAutorimessa />
        </AppCard>

        <AppCard title="Gestione Affitto Studenti" emoji="🏠📚" description="Dashboard per entrate/uscite, stanze, cedolare secca, ripartizione costi.">
          <ComingSoon name="Gestione Affitto Studenti" />
        </AppCard>

        <AppCard title="Proiezione Patrimonio 18 anni" emoji="🎂💶" description="Simula il traguardo 100K al compimento dei 18 anni con versamenti periodici.">
          <ComingSoon name="Proiezione 18 anni" />
        </AppCard>

        <AppCard title="Spese & Entrate Mensili" emoji="📊🧾" description="Pannello per tracciare budget mensile e report annuale.">
          <ComingSoon name="Spese & Entrate" />
        </AppCard>
      </div>
    </section>
  );
}

function AppCard({ title, emoji, description, children }: { title: string; emoji: string; description: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="text-2xl" aria-hidden>{emoji}</div>
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-slate-600 mt-1">{description}</p>
        </div>
      </div>
      <div className="mt-4 flex gap-3">
        <button onClick={() => setOpen(true)} className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm hover:shadow">Apri</button>
        <button className="rounded-xl border border-slate-300 px-4 py-2 text-sm">Dettagli</button>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 grid place-items-center p-4" role="dialog" aria-modal>
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative z-50 w-full max-w-2xl rounded-3xl bg-white shadow-xl border border-slate-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <div className="font-semibold">{title}</div>
              <button onClick={() => setOpen(false)} className="rounded-full border px-3 py-1 text-sm">Chiudi</button>
            </div>
            <div className="p-5">{children}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function ComingSoon({ name }: { name: string }) {
  return (
    <div className="text-sm text-slate-600">
      <p className="mb-4">Questa app è in costruzione. Vuoi che la realizziamo ora? Dimmi i campi che vuoi inserire e le logiche di calcolo e la aggiungo qui.</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Esempio: campi di input, report, esportazione CSV</li>
        <li>Esempio: tassazione (cedolare secca), ripartizioni, storico mensile</li>
      </ul>
    </div>
  );
}

function RoiAutorimessa() {
  const [investimento, setInvestimento] = useState(80000);
  const [utileMensile, setUtileMensile] = useState(1100);
  const [speseMensili, setSpeseMensili] = useState(0);
  const [tasseAnnue, setTasseAnnue] = useState(0);

  const nettoAnnuo = useMemo(() => (utileMensile - speseMensili) * 12 - tasseAnnue, [utileMensile, speseMensili, tasseAnnue]);
  const roi = useMemo(() => (investimento > 0 ? (nettoAnnuo / investimento) * 100 : 0), [nettoAnnuo, investimento]);
  const breakEvenMesi = useMemo(() => {
    const mensileNetto = utileMensile - speseMensili - tasseAnnue / 12;
    if (mensileNetto <= 0) return Infinity;
    return Math.ceil(investimento / mensileNetto);
  }, [investimento, utileMensile, speseMensili, tasseAnnue]);

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2">
        <NumberField label="Investimento iniziale (€)" value={investimento} setValue={setInvestimento} />
        <NumberField label="Utile lordo mensile (€)" value={utileMensile} setValue={setUtileMensile} />
        <NumberField label="Spese mensili (€)" value={speseMensili} setValue={setSpeseMensili} />
        <NumberField label="Tasse annue (€)" value={tasseAnnue} setValue={setTasseAnnue} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Kpi title="Netto annuo" value={formatMoney(nettoAnnuo)} note="(dopo spese + tasse)" />
        <Kpi title="ROI annuo" value={`${roi.toFixed(1)}%`} note="netto su capitale" />
        <Kpi title="Rientro (mesi)" value={isFinite(breakEvenMesi) ? `${breakEvenMesi}` : "—"} note="break-even" />
      </div>

      <div className="mt-6 text-xs text-slate-500">
        Suggerimenti: inserisci spese come assicurazione, energia ricariche EV, manutenzione, e tasse locali.
      </div>
    </div>
  );
}

function NumberField({ label, value, setValue }: { label: string; value: number; setValue: (n: number) => void }) {
  return (
    <label className="block">
      <div className="text-sm text-slate-600 mb-1">{label}</div>
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => setValue(parseFloat(e.target.value))}
        className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
      />
    </label>
  );
}

function Kpi({ title, value, note }: { title: string; value: string; note?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs uppercase tracking-wide text-slate-500">{title}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
      {note && <div className="text-xs text-slate-500 mt-1">{note}</div>}
    </div>
  );
}

function Footer() {
  return (
    <footer id="about" className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-6 md:grid-cols-3">
        <div>
          <div className="font-semibold">Andrea Ferrante</div>
          <p className="text-sm text-slate-600 mt-2">
            Costruisco piccole applicazioni utili per la vita reale. Questo hub raccoglie tutti i
            miei progetti.
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
        <div id="contact">
          <div className="font-semibold">Contatti</div>
          <p className="text-sm text-slate-600 mt-2">Scrivimi su <span className="font-medium">LinkedIn</span> oppure invia un'idea per una nuova app.</p>
        </div>
      </div>
      <div className="text-center text-xs text-slate-500 pb-8">© {new Date().getFullYear()} Andrea Ferrante · Tutti i diritti riservati</div>
    </footer>
  );
}

function formatMoney(n: number) {
  try {
    return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
  } catch {
    return `${n.toFixed(0)} €`;
  }
}
