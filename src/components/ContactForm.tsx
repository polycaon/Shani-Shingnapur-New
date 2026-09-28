"use client";

import Link from "next/link";
import { useRef, useState } from "react";

type State = { status: "idle" | "sending" | "sent" | "error"; message?: string };

export function ContactForm() {
  const [state, setState] = useState<State>({ status: "idle" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const startedAt = useRef<number>(0);

  function validate(fd: FormData) {
    const e: Record<string, string> = {};
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const subject = String(fd.get("subject") || "").trim();
    const message = String(fd.get("message") || "").trim();
    if (name.length < 2) e.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) e.email = "Please enter a valid email address.";
    if (subject.length < 3) e.subject = "Please add a short subject.";
    if (message.length < 20) e.message = "Please write at least 20 characters so we can understand your message.";
    if (message.length > 5000) e.message = "Please keep your message under 5,000 characters.";
    return e;
  }

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const form = ev.currentTarget;
    const fd = new FormData(form);
    const e = validate(fd);
    setErrors(e);
    if (Object.keys(e).length) {
      const first = form.querySelector<HTMLElement>(`[name="${Object.keys(e)[0]}"]`);
      first?.focus();
      return;
    }
    setState({ status: "sending" });
    try {
      const res = await fetch("/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(fd), elapsedMs: startedAt.current ? Date.now() - startedAt.current : 0 }),
      });
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) throw new Error(data.message || "Something went wrong.");
      form.reset();
      setState({ status: "sent", message: data.message });
    } catch (err) {
      setState({ status: "error", message: err instanceof Error ? err.message : "Something went wrong." });
    }
  }

  const field = "mt-1.5 block w-full rounded-lg border border-sand-300 bg-white px-3 py-2.5 text-base focus:border-saffron-600";
  const err = (k: string) =>
    errors[k] ? (
      <p id={`${k}-error`} className="mt-1 text-sm font-medium text-[#a1260d]">
        {errors[k]}
      </p>
    ) : null;

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      onFocus={() => {
        if (!startedAt.current) startedAt.current = Date.now();
      }}
      className="not-prose card space-y-5 p-5 sm:p-6"
      aria-label="Contact form"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="font-semibold">
            Name
          </label>
          <input id="cf-name" name="name" autoComplete="name" required className={field} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />
          {err("name")}
        </div>
        <div>
          <label htmlFor="cf-email" className="font-semibold">
            Email
          </label>
          <input id="cf-email" name="email" type="email" autoComplete="email" required className={field} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />
          {err("email")}
        </div>
      </div>
      <div>
        <label htmlFor="cf-subject" className="font-semibold">
          Subject
        </label>
        <input id="cf-subject" name="subject" required className={field} aria-invalid={!!errors.subject} aria-describedby={errors.subject ? "subject-error" : undefined} />
        {err("subject")}
      </div>
      <div>
        <label htmlFor="cf-message" className="font-semibold">
          Message
        </label>
        <textarea id="cf-message" name="message" rows={6} required className={field} aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : "message-hint"} />
        {err("message") ?? (
          <p id="message-hint" className="mt-1 text-sm text-ink-600">
            For corrections, please include the page address and, if possible, a source.
          </p>
        )}
      </div>
      {/* Honeypot: hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="cf-website">Website</label>
        <input id="cf-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn-primary" disabled={state.status === "sending"}>
          {state.status === "sending" ? "Sending…" : "Send message"}
        </button>
        <p role="status" aria-live="polite" className={state.status === "error" ? "font-medium text-[#a1260d]" : "font-medium text-[#1f5b32]"}>
          {state.status === "sent" && (state.message || "Thank you — your message has been sent.")}
          {state.status === "error" && state.message}
        </p>
      </div>
      <p className="text-sm text-ink-600">
        We use your details only to reply to your message. See our <Link href="/privacy-policy/">privacy policy</Link>. We are not the
        temple trust and cannot book darshan, pooja or rooms.
      </p>
    </form>
  );
}
