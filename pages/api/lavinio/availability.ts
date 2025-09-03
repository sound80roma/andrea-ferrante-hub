// pages/api/lavinio/availability.ts
import type { NextApiRequest, NextApiResponse } from "next";

type Conflict = {
  type: "reservation" | "blackout";
  roomId?: string;
  start: string; // ISO date (YYYY-MM-DD)
  end: string;   // ISO date (YYYY-MM-DD) - end esclusa
  note?: string;
};

type Data =
  | { available: true; nights: number; conflicts: Conflict[] }
  | { available: false; nights: number; conflicts: Conflict[] }
  | { error: string };

function toDate(d: string): Date {
  // interpretazione “locale” di YYYY-MM-DD a mezzanotte
  return new Date(`${d}T00:00:00`);
}
function isValidDateStr(d?: string): d is string {
  return !!d && /^\d{4}-\d{2}-\d{2}$/.test(d);
}
function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  // intervalli [start, end)
  return aStart < bEnd && bStart < aEnd;
}

// 🔧 MOCK: periodi bloccati e prenotazioni esistenti
const blackout: Conflict[] = [
  { type: "blackout", start: "2025-09-18", end: "2025-09-19", note: "Manutenzione impianti" },         // blocco generale (tutte le camere)
  { type: "blackout", roomId: "giardino", start: "2025-10-05", end: "2025-10-07", note: "Lavori stanza" }, // solo Camera Giardino
];

const reservations: Conflict[] = [
  { type: "reservation", roomId: "mare", start: "2025-09-10", end: "2025-09-13" },
  { type: "reservation", roomId: "suite", start: "2025-09-25", end: "2025-09-28" },
];

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { roomId, from, to } = req.query as Partial<Record<string, string>>;
  if (!roomId) return res.status(400).json({ error: "Param 'roomId' mancante" });
  if (!isValidDateStr(from) || !isValidDateStr(to)) {
    return res.status(400).json({ error: "Date non valide. Usa formato YYYY-MM-DD" });
  }

  const start = toDate(from!);
  const end = toDate(to!);
  if (!(start < end)) {
    return res.status(400).json({ error: "Intervallo date non valido (check-out deve essere successivo al check-in)" });
  }

  const nights = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  // Filtra i conflitti che si sovrappongono all'intervallo e che riguardano:
  // - la stanza specifica, oppure (per blackout senza roomId) tutte le stanze
  const conflicts = [...reservations, ...blackout].filter((c) => {
    const cStart = toDate(c.start);
    const cEnd = toDate(c.end);
    const sameRoom = !c.roomId || c.roomId === roomId; // blackout globale o stanza specifica
    return sameRoom && overlaps(start, end, cStart, cEnd);
  });

  if (conflicts.length > 0) {
    return res.status(200).json({ available: false, nights, conflicts });
  }

  return res.status(200).json({ available: true, nights, conflicts: [] });
}
