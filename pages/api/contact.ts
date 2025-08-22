import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  const { name, email, subject, message, hp, consent } = req.body || {};

  // honeypot / validazioni
  if (hp) return res.status(400).json({ ok: false, error: "Spam detected" });
  if (!name || !email || !message || !consent) {
    return res.status(400).json({ ok: false, error: "Dati mancanti" });
  }

  try {
    const html = `
      <h2>Nuovo messaggio dal sito</h2>
      <p><b>Nome:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Oggetto:</b> ${subject || "-"}</p>
      <p><b>Messaggio:</b><br/>${(message || "").replace(/\n/g, "<br/>")}</p>
    `;

    // Nota: reply_to è la proprietà corretta per Resend.
    await (resend as any).emails.send({
      from: "AF Contact <onboarding@resend.dev>",
      to: process.env.TO_EMAIL,
      subject: subject ? `[AF Site] ${subject}` : "[AF Site] Nuovo contatto",
      html,
      reply_to: email,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Invio fallito" });
  }
}
