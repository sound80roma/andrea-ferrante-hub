// pages/api/lavinio/request.ts
import type { NextApiRequest, NextApiResponse } from "next";

type Body = {
  roomId: string;
  checkIn: string;   // YYYY-MM-DD
  checkOut: string;  // YYYY-MM-DD
  guests: number;
  total: number;     // totale stimato
};

type SavedRequest = Body & {
  id: string;
  createdAt: string;
};

// 🔒 MOCK: memoria volatile lato server (si azzera al redeploy)
const REQUESTS: SavedRequest[] = [];

function isValidDateStr(d?: string): d is string {
  return !!d && /^\d{4}-\d{2}-\d{2}$/.test(d);
}
function toDate(d: string): Date {
  return new Date(`${d}T00:00:00`);
}
function generateId() {
  return `REQ-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { roomId, checkIn, checkOut, guests, total } = req.body as Partial<Body>;

  if (!roomId) return res.status(400).json({ error: "roomId mancante" });
  if (!isValidDateStr(checkIn) || !isValidDateStr(checkOut)) {
    return res.status(400).json({ error: "Date non valide. Usa formato YYYY-MM-DD" });
  }
  const inD = toDate(checkIn), outD = toDate(checkOut);
  if (!(inD < outD)) return res.status(400).json({ error: "Intervallo date non valido" });
  if (!Number.isFinite(guests!) || (guests as number) < 1) {
    return res.status(400).json({ error: "Numero ospiti non valido" });
  }
  if (!Number.isFinite(total!)) {
    return res.status(400).json({ error: "Totale non valido" });
  }

  const saved: SavedRequest = {
    id: generateId(),
    roomId,
    checkIn,
    checkOut,
    guests: guests as number,
    total: total as number,
    createdAt: new Date().toISOString(),
  };

  REQUESTS.push(saved);
  // utile in dev: vedi la richiesta sul server
  // eslint-disable-next-line no-console
  console.log("Nuova richiesta:", saved);

  return res.status(200).json({ ok: true, id: saved.id, createdAt: saved.createdAt });
}
