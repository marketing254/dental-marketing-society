"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import { sendLead, spamBlock } from "@/lib/sheets";

const TOPICS = [
  "Practice Marketing",
  "Patient Acquisition",
  "Leadership & Culture",
  "Team & Systems",
  "Practice Finance",
  "AI & Technology",
  "Treatment Acceptance",
  "Insurance & PPO",
  "Other",
];

export default function SpeakerForm() {
  const [done, setDone] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const g = (n: string) =>
      (form.elements.namedItem(n) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null)?.value.trim() ?? "";
    if (spamBlock(form, g("first_name"), g("last_name"))) return;
    setDone(true);
    sendLead({
      form: "guest_speaker",
      first_name: g("first_name"),
      last_name: g("last_name"),
      email: g("email"),
      title: g("title"),
      apply_as: g("apply_as"),
      topic: g("topic"),
      about: g("about"),
      page_url: window.location.href,
    });
  }

  if (done) {
    return (
      <div className="glass-strong p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-teal-400/40 bg-teal-400/10 text-teal-400">
          <Icon name="check" size={28} />
        </div>
        <h3 className="h-display mt-5 text-3xl">Application received!</h3>
        <p className="mx-auto mt-3 max-w-sm text-sm text-mist">
          Thanks for your interest in speaking with the Dental Marketing Society.
          We&apos;ll review and get back to you within <strong className="text-ivory">3 business days</strong>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="glass-strong relative p-7 sm:p-8">
      <span aria-hidden className="absolute -left-[9999px]">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </span>
      <h3 className="h-display text-2xl">Apply to Speak</h3>
      <p className="mb-6 mt-1 text-sm text-mist">Tell us a bit about you, we respond within 3 business days.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label">First name</label>
          <input type="text" name="first_name" required placeholder="First name" className="field-input" />
        </div>
        <div>
          <label className="field-label">Last name</label>
          <input type="text" name="last_name" required placeholder="Last name" className="field-input" />
        </div>
      </div>
      <div className="mt-4">
        <label className="field-label">Email address</label>
        <input type="email" name="email" required placeholder="you@practice.com" className="field-input" />
      </div>
      <div className="mt-4">
        <label className="field-label">Professional title</label>
        <input type="text" name="title" required placeholder="e.g. Practice Owner, Consultant" className="field-input" />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label">Apply as</label>
          <select name="apply_as" className="field-input appearance-none">
            {["Webinar speaker", "Podcast guest", "Both"].map((o) => (
              <option key={o} className="bg-navy-900">{o}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label">Topic area</label>
          <select name="topic" className="field-input appearance-none">
            {TOPICS.map((t) => (
              <option key={t} className="bg-navy-900">{t}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-4">
        <label className="field-label">About you &amp; your talk</label>
        <textarea
          name="about"
          required
          rows={4}
          placeholder="A short bio and what you'd love to present..."
          className="field-input resize-y"
        />
      </div>
      <button type="submit" className="btn-gold btn-lg mt-6 w-full">
        Submit Application <Icon name="arrow" size={16} />
      </button>
      <p className="mt-4 text-center text-xs text-mist-dark">We review every application personally. No spam, ever.</p>
    </form>
  );
}
