"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import { sendLead, spamBlock } from "@/lib/sheets";
import { postToKit } from "@/lib/kit";
import { SITE } from "@/lib/site";

const SUBJECTS = [
  "General inquiry",
  "Webinars & events",
  "Free practice audit",
  "Speaking opportunity",
  "Partnership",
  "Something else",
];

export default function ContactForm() {
  const [done, setDone] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const g = (n: string) =>
      (form.elements.namedItem(n) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null)?.value.trim() ?? "";
    if (spamBlock(form, g("name"))) return;
    setDone(true);
    const payload = {
      form: "contact_us",
      name: g("name"),
      email: g("email"),
      subject: g("subject"),
      message: g("message"),
      page_url: window.location.href,
    };
    sendLead(payload);
    postToKit("contact", payload);
  }

  if (done) {
    return (
      <div className="glass-strong p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-teal-400/40 bg-teal-400/10 text-teal-400">
          <Icon name="check" size={28} />
        </div>
        <h3 className="h-display mt-5 text-3xl">Message sent!</h3>
        <p className="mx-auto mt-3 max-w-sm text-sm text-mist">
          Thanks for reaching out. Our team will get back to you within 1-2 business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="glass-strong relative p-7 sm:p-8">
      <span aria-hidden className="absolute -left-[9999px]">
        <input type="text" name="dms_hp" tabIndex={-1} autoComplete="off" aria-hidden="true" data-1p-ignore data-lpignore="true" data-form-type="other" />
      </span>
      <h3 className="h-display text-2xl">Send us a message</h3>
      <p className="mb-6 mt-1 text-sm text-mist">We typically reply within 1-2 business days.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label">Full name</label>
          <input type="text" name="name" required placeholder="Your full name" className="field-input" />
        </div>
        <div>
          <label className="field-label">Email address</label>
          <input type="email" name="email" required placeholder="you@practice.com" className="field-input" />
        </div>
      </div>
      <div className="mt-4">
        <label className="field-label">I&apos;m reaching out about</label>
        <select name="subject" className="field-input appearance-none">
          {SUBJECTS.map((s) => (
            <option key={s} className="bg-navy-900">{s}</option>
          ))}
        </select>
      </div>
      <div className="mt-4">
        <label className="field-label">Message</label>
        <textarea name="message" required placeholder="How can we help?" rows={5} className="field-input resize-y" />
      </div>
      <button type="submit" className="btn-gold btn-lg mt-6 w-full">
        Send Message <Icon name="arrow" size={16} />
      </button>
      <p className="mt-4 text-center text-xs text-mist-dark">
        Prefer email? Reach us at{" "}
        <a href={`mailto:${SITE.email}`} className="font-semibold text-gold-400">
          {SITE.email}
        </a>
      </p>
    </form>
  );
}
