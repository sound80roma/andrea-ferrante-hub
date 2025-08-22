import { useState } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [hp, setHp] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle"|"sending"|"ok"|"err">("idle");
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending"); setErr("");
    const r = await fetch("/api/contact",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ name, email, subject, message, consent, hp })
    });
    const data = await r.json();
    if (data.ok) setStatus("ok"); else { setStatus("err"); setErr(data.error || "Errore"); }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-extrabold">Contatti</h1>
        <p className="text-slate-600 mt-2">Scrivimi per idee, suggerimenti o collaborazioni.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5 rounded-3xl bg-white p-6 border border-slate-200">
          {/* honeypot nascosto */}
          <label className="hidden">
            Azienda
            <input value={hp} onChange={(e)=>setHp(e.target.value)} />
          </label>

          <Field label="Nome e cognome">
            <input required value={name} onChange={(e)=>setName(e.target.value)}
                   className="w-full rounded-xl border border-slate-300 px-3 py-2" />
          </Field>

          <Field label="Email">
            <input required type="email" value={email} onChange={(e)=>setEmail(e.target.value)}
                   className="w-full rounded-xl border border-slate-300 px-3 py-2" />
          </Field>

          <Field label="Oggetto (opzionale)">
            <input value={subject} onChange={(e)=>setSubject(e.target.value)}
                   className="w-full rounded-xl border border-slate-300 px-3 py-2" />
          </Field>

          <Field label="Messaggio">
            <textarea required value={message} onChange={(e)=>setMessage(e.target.value)}
                      rows={6} className="w-full rounded-xl border border-slate-300 px-3 py-2" />
          </Field>

          <label className="flex items-start gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={consent} onChange={(e)=>setConsent(e.target.checked)} className="mt-1" required />
            Acconsento al trattamento dei dati per rispondere al mio messaggio (GDPR).
          </label>

          <div className="flex items-center gap-3">
            <button disabled={status==="sending"} className="rounded-xl bg-slate-900 text-white px-5 py-2.5 text-sm disabled:opacity-60">
              {status==="sending" ? "Invio..." : "Invia"}
            </button>
            {status==="ok" && <span className="text-green-600 text-sm">Messaggio inviato! Ti rispondo via email.</span>}
            {status==="err" && <span className="text-red-600 text-sm">Errore: {err}</span>}
          </div>

          <div className="text-xs text-slate-500">
            In alternativa: <a className="underline" href="mailto:info@andreaferrante.online">info@andreaferrante.online</a>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-sm text-slate-600 mb-1">{label}</div>
      {children}
    </label>
  );
}
