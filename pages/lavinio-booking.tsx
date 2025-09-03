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
            <p className="text-slate-600">
              Stiamo lavorando al calendario per visualizzare date libere e prenotare online.
            </p>
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
