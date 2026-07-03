"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import { sendLead, spamBlock } from "@/lib/sheets";
import { postToKit } from "@/lib/kit";

export default function NewsletterForm({
  source,
  buttonLabel = "Subscribe Now!",
  doneLabel = "Thanks! You're subscribed.",
}: {
  source: string;
  buttonLabel?: string;
  doneLabel?: string;
}) {
  const [done, setDone] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value.trim();
    if (!email || spamBlock(form)) return;
    setDone(true);
    const page_url = window.location.href;
    sendLead({ form: "newsletter", email, source, page_url });
    postToKit("newsletter", { email, source, page_url });
  }

  if (done) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-2xl border border-teal-400/30 bg-teal-400/10 px-5 py-4 text-sm font-semibold text-teal-400">
        <Icon name="check" size={16} /> {doneLabel}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
      <span aria-hidden className="absolute -left-[9999px]">
        <input type="text" name="dms_hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      </span>
      <input
        type="email"
        name="email"
        required
        placeholder="Enter your email address"
        aria-label="Email address"
        className="field-input flex-1 !rounded-full px-5"
      />
      <button type="submit" className="btn-gold btn-lg shrink-0">
        {buttonLabel}
      </button>
    </form>
  );
}
