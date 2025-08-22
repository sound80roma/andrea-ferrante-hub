import { useEffect, useState } from "react";
import Link from "next/link";

type House = { id: number; name: string; address: string; rooms: number; created_at: string };

export default function HousesList() {
  const [data, setData] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/houses").then(r => r.json()).then(j => {
      setData(j.houses || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="py-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-extrabold">Le mie case</h1>
        <Link href="/houses/new" className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm">+ Nuova casa</Link>
      </div>

      {loading ? <div>Caricamento…</div> : (
        <div className="grid gap-3">
          {data.length === 0 && <div className="text-slate-600">Nessuna casa configurata.</div>}
          {data.map(h => (
            <div key={h.id} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="font-semibold">{h.name}</div>
              <div className="text-sm text-slate-600">{h.address || "—"}</div>
              <div className="text-xs text-slate-500 mt-1">Stanze: {h.rooms}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
