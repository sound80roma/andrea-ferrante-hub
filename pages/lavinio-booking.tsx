export default function LavinioBooking() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Prenota Lavinio
        </h1>
        <p className="mt-4 text-slate-600 md:text-lg">
          Qui potrai prenotare una stanza del mio appartamento a Lavinio.
          Al momento questa è solo una pagina introduttiva: presto aggiungeremo
          il calendario delle disponibilità, i prezzi e il modulo di prenotazione.
        </p>

        <div className="mt-8 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-2">📍 Posizione</h2>
            <p className="text-slate-600 mb-4">
              L’appartamento si trova in <strong>Passeggiata delle Sirene 54, Lavinio</strong>,
              a pochi minuti dal mare.
            </p>
            <div className="w-full h-64 rounded-xl overflow-hidden border">
              <iframe
                title="Mappa Lavinio (OSM)"
                // ⬇️ METTI QUI LE TUE COORDINATE ESATTE (lat, lon) prese dal link che mi hai dato
                // Esempio: 41.4610013 (lat) e 12.6171558 (lon)
                src={
                  "https://www.openstreetmap.org/export/embed.html?bbox=" +
                  // bbox = [lon-Δ, lat-Δ, lon+Δ, lat+Δ] per inquadrare bene (qui Δ ~ 0.002)
                  `${12.6171558 - 0.002}%2C${41.4610013 - 0.002}%2C${12.6171558 + 0.002}%2C${41.4610013 + 0.002}` +
                  // layer e marker (lat,lon) precisi
                  `&layer=mapnik&marker=${41.4610013}%2C${12.6171558}`
                }
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
              ></iframe>
            </div>

            <a
              href="https://maps.app.goo.gl/wJ9zhAAKmqezQ2rk7?g_st=aw"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium ring-1 ring-slate-300 hover:bg-slate-100"
            >
              📍 Apri in Google Maps
            </a>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-2">🛏️ Camere</h2>
            <p className="text-slate-600">
              Stanze accoglienti con servizi inclusi.
              A breve potrai scegliere quella che preferisci.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-2">📅 Disponibilità</h2>
            <p className="text-slate-600 mb-4">
              Seleziona camera e date per ottenere un preventivo. La disponibilità verrà verificata nel passo successivo.
            </p>
            <BookingWidget />
          </div>
        </div>

        <div className="mt-10">
          <a
            href="/"
            className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium ring-1 ring-slate-300 hover:bg-slate-100"
          >
            ⬅ Torna alla Home
          </a>
        </div>
      </main>
    </div>
  );
}

import { useMemo, useState } from "react";

// Catalogo camere
const ROOMS = [
  { id: "mare", name: "Camera Mare", capacity: 2, pricePerNight: 95, cleaningFee: 30 },
  { id: "giardino", name: "Camera Giardino", capacity: 3, pricePerNight: 110, cleaningFee: 35 },
  { id: "suite", name: "Suite", capacity: 4, pricePerNight: 160, cleaningFee: 45 },
];

type ApiConflict = {
  type: "reservation" | "blackout";
  roomId?: string;
  start: string;
  end: string; // end esclusa
  note?: string;
};

function BookingWidget() {
  const today = new Date().toISOString().slice(0, 10);

  const [roomId, setRoomId] = useState(ROOMS[0].id);
  const [guests, setGuests] = useState(2);
  const [checkIn, setCheckIn] = useState<string>(today);
  const [checkOut, setCheckOut] = useState<string>("");

  const [isChecking, setIsChecking] = useState(false);
  const [availability, setAvailability] = useState<null | {
    available: boolean;
    nights: number;
    conflicts: ApiConflict[];
    error?: string;
  }>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<null | { ok: boolean; id?: string; error?: string }>(null);

  const room = useMemo(() => ROOMS.find(r => r.id === roomId)!, [roomId]);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const inD = new Date(checkIn);
    const outD = new Date(checkOut);
    const diff = (outD.getTime() - inD.getTime()) / (1000 * 60 * 60 * 24);
    return Number.isFinite(diff) && diff > 0 ? Math.round(diff) : 0;
  }, [checkIn, checkOut]);

  const price = useMemo(() => {
    if (!room) return 0;
    const base = nights * room.pricePerNight;
    return base > 0 ? base + room.cleaningFee : 0;
  }, [nights, room]);

  const errors = useMemo(() => {
    const list: string[] = [];
    if (!room) list.push("Seleziona una camera.");
    if (!checkIn) list.push("Seleziona il check-in.");
    if (!checkOut) list.push("Seleziona il check-out.");
    if (nights <= 0) list.push("Le date non sono valide (il check-out deve essere successivo al check-in).");
    if (guests < 1) list.push("Numero ospiti non valido.");
    if (room && guests > room.capacity) list.push(`La camera scelta supporta al massimo ${room.capacity} ospiti.`);
    return list;
  }, [room, checkIn, checkOut, nights, guests]);

  function formatMoney(n: number) {
    try {
      return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
    } catch {
      return `${n.toFixed(0)} €`;
    }
  }

  const checkAvailability = async () => {
    setAvailability(null);
    setSubmitResult(null);
    if (errors.length) return;

    setIsChecking(true);
    try {
      const params = new URLSearchParams({ roomId, from: checkIn, to: checkOut });
      const res = await fetch(`/api/lavinio/availability?${params.toString()}`);
      const data = await res.json();

      if (!res.ok || data?.error) {
        setAvailability({ available: false, nights, conflicts: [], error: data?.error || "Errore di rete" });
      } else {
        setAvailability(data);
      }
    } catch (e) {
      setAvailability({ available: false, nights, conflicts: [], error: "Errore imprevisto nella chiamata" });
    } finally {
      setIsChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitResult(null);
    if (errors.length) return;

    // opzionale: forziamo che sia disponibile prima di inviare
    if (!availability || availability.available !== true) {
      await checkAvailability();
      if (!availability || availability.available !== true) return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/lavinio/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          checkIn,
          checkOut,
          guests,
          total: price,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        setSubmitResult({ ok: false, error: data?.error || "Invio non riuscito" });
      } else {
        setSubmitResult({ ok: true, id: data.id });
      }
    } catch {
      setSubmitResult({ ok: false, error: "Errore di rete" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
      <label className="block">
        <div className="text-sm text-slate-600 mb-1">Camera</div>
        <select
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-3 py-2"
        >
          {ROOMS.map(r => (
            <option key={r.id} value={r.id}>
              {r.name} — max {r.capacity} ospiti — {formatMoney(r.pricePerNight)}/notte
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <div className="text-sm text-slate-600 mb-1">Ospiti</div>
        <input
          type="number"
          min={1}
          max={10}
          value={guests}
          onChange={(e) => setGuests(parseInt(e.target.value || "1", 10))}
          className="w-full rounded-xl border border-slate-300 px-3 py-2"
        />
      </label>

      <label className="block">
        <div className="text-sm text-slate-600 mb-1">Check-in</div>
        <input
          type="date"
          min={today}
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-3 py-2"
        />
      </label>

      <label className="block">
        <div className="text-sm text-slate-600 mb-1">Check-out</div>
        <input
          type="date"
          min={checkIn || today}
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-3 py-2"
        />
      </label>

      <div className="md:col-span-2 grid gap-2">
        <div className="grid grid-cols-3 gap-2">
          <Kpi title="Notti" value={String(nights)} />
          <Kpi title="Pulizia" value={room ? formatMoney(room.cleaningFee) : "—"} />
          <Kpi title="Totale stimato" value={formatMoney(price)} />
        </div>

        {/* Stato verifica disponibilità */}
        {availability && (
          <div
            className={`rounded-xl p-3 text-sm ${
              availability.available
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {availability.error ? (
              <div>Errore: {availability.error}</div>
            ) : availability.available ? (
              <div>✅ Disponibile per {availability.nights} notte{availability.nights !== 1 ? "i" : ""}.</div>
            ) : (
              <div>
                ❌ Non disponibile nelle date selezionate.
                {availability.conflicts.length > 0 && (
                  <ul className="list-disc pl-5 mt-2">
                    {availability.conflicts.map((c, i) => (
                      <li key={i}>
                        {c.type === "reservation" ? "Prenotazione esistente" : "Blocco calendario"}
                        {c.roomId ? ` (stanza: ${c.roomId})` : ""}: {c.start} → {c.end}
                        {c.note ? ` — ${c.note}` : ""}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}

        {/* Esito invio richiesta */}
        {submitResult && (
          <div
            className={`rounded-xl p-3 text-sm ${
              submitResult.ok
                ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {submitResult.ok ? (
              <div>
                ✅ Richiesta registrata. Codice <strong>{submitResult.id}</strong>. Riceverai conferma a breve.
              </div>
            ) : (
              <div>❌ Invio non riuscito: {submitResult.error}</div>
            )}
          </div>
        )}

        <div className="flex gap-3 mt-1">
          <button
            type="button"
            onClick={checkAvailability}
            disabled={isChecking || errors.length > 0}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm disabled:opacity-50"
          >
            {isChecking ? "Verifico..." : "Verifica disponibilità"}
          </button>
          <button
            type="submit"
            disabled={errors.length > 0 || (availability && !availability.available) || isSubmitting}
            className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm hover:shadow disabled:opacity-50"
          >
            {isSubmitting ? "Invio..." : "Richiedi prenotazione"}
          </button>
        </div>

        <div className="text-xs text-slate-500">
          * Prezzo indicativo: non include eventuali variazioni stagionali o cauzione. Conferma e pagamento arriveranno via email.
        </div>
      </div>
    </form>
  );
}

function Kpi({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="text-xs uppercase tracking-wide text-slate-500">{title}</div>
      <div className="mt-1 text-lg font-bold">{value}</div>
    </div>
  );
}
