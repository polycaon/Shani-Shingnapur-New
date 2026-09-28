import { NextResponse } from "next/server";

/**
 * Contact form endpoint. Validates input, drops obvious spam (honeypot and
 * implausibly fast submissions) and forwards the message to CONTACT_WEBHOOK_URL.
 * No message is stored on this server.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }
  const str = (k: string, max: number) => String(body[k] ?? "").trim().slice(0, max);
  const name = str("name", 120);
  const email = str("email", 200);
  const subject = str("subject", 200);
  const message = str("message", 5000);
  const elapsed = Number(body.elapsedMs) || 0;

  // Spam traps: pretend success so bots learn nothing.
  if (str("website", 200) || elapsed < 3000) {
    return NextResponse.json({ message: "Thank you — your message has been sent." });
  }
  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || subject.length < 3 || message.length < 20) {
    return NextResponse.json({ message: "Please check the form fields and try again." }, { status: 422 });
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json(
      { message: "Sorry — the contact form is not accepting messages yet. Please try again later." },
      { status: 503 },
    );
  }
  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, subject, message, source: "shanishingnapurtemple.com", receivedAt: new Date().toISOString() }),
    });
    if (!res.ok) throw new Error(String(res.status));
  } catch {
    return NextResponse.json({ message: "Sorry — we could not send your message. Please try again later." }, { status: 502 });
  }
  return NextResponse.json({ message: "Thank you — your message has been sent." });
}
