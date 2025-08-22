// pages/api/houses.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { neon } from "@neondatabase/serverless";

const DB_URL =
process.env.DATABASE_URL ||
process.env.NEON_DATABASE_URL ||
process.env.POSTGRES_URL ||
"";

if (!DB_URL) {
  console.warn("DATABASE_URL non configurata: aggiungi la variabile su Vercel o .env.local");
}

const sql = neon(DB_URL);

async function ensureSchema() {
  // Tabella semplice per le case
  await sql/* sql */`
    CREATE TABLE IF NOT EXISTS houses (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      address TEXT,
      rooms INTEGER NOT NULL DEFAULT 1,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await ensureSchema();

    if (req.method === "POST") {
      const { name, address, rooms } = req.body || {};
      const roomsNum = Number(rooms);
      if (!name || !Number.isFinite(roomsNum) || roomsNum < 1) {
        return res.status(400).json({ ok: false, error: "Dati non validi" });
      }

      const r = await sql/* sql */`
        INSERT INTO houses (name, address, rooms)
        VALUES (${name}, ${address || ""}, ${roomsNum})
        RETURNING id, name, address, rooms, created_at;
      `;
      return res.status(201).json({ ok: true, house: r[0] });
    }

    if (req.method === "GET") {
      const r = await sql/* sql */`
        SELECT id, name, address, rooms, created_at
        FROM houses
        ORDER BY created_at DESC;
      `;
      return res.status(200).json({ ok: true, houses: r });
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  } catch (err: any) {
    console.error("API /houses error:", err);
    return res.status(500).json({ ok: false, error: "Errore server" });
  }
}
