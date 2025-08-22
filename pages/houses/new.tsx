import { useState } from "react";
import { useRouter } from "next/router";

export default function NewHouse() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [rooms, setRooms] = useState<number>(4);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setSending(true); setErr("");
    const r = await fetch("/api/houses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, address, rooms })
    });
    const j = await r.json();
    setSending(false);
    if (j.ok) router.push("/houses");
    else setErr(j.error || "Errore");
  }

  return (
    <div className="py-10">
      <h1 className="text-2xl font-extrabold">Nuova casa</h1>

      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-3xl bg-white p-6 border border-slate-200 max-w-xl">
        <Field label="Nome casa">
          <input required value={name} onChange={e=>setName(e.target.value)}
                 className="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </Field>
        <Field label="Indirizzo">
          <input value={address} onChange={e=>setAddress(e.target.value)}
                 className="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </Field>
        <Field label="Numero stanze">
          <input required type="number" min={1} value={rooms}
                 onChange={e=>setRooms(parseInt(e.target.value || "1", 10))}
                 className="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </Field>

        <div className="flex items-center gap-3">
          <button disabled={sending} className="rounded-xl bg-slate-900 text-white px-5 py-2.5 text-sm disabled:opacity-60">
            {sending ? "Salvataggio…" : "Salva"}
          </button>
          {err && <span className="text-sm text-red-600">{err}</span>}
        </div>
      </form>
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
