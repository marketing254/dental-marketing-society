"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "@/components/Icon";
import { sendLead, spamBlock } from "@/lib/sheets";

export interface GateTarget {
  title: string;
  slug: string;
  vimeo?: string;
}

export default function GateModal({
  target,
  onClose,
}: {
  target: GateTarget | null;
  onClose: () => void;
}) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (target) {
      setDone(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [target, onClose]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!target) return;
    const form = e.currentTarget;
    const g = (n: string) => (form.elements.namedItem(n) as HTMLInputElement | null)?.value.trim() ?? "";
    if (spamBlock(form, g("name"))) return;
    setDone(true);
    sendLead({
      form: "webinar_replay_gate",
      name: g("name"),
      email: g("email"),
      webinar_title: target.title,
      replay_slug: target.slug,
      page_url: window.location.href,
    });
  }

  return (
    <AnimatePresence>
      {target && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-navy-950/80 p-5 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Unlock webinar replay"
        >
          <motion.div
            initial={{ opacity: 0, y: 36, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="glass-strong relative w-full max-w-md p-8"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-mist transition-colors hover:text-ivory"
            >
              ✕
            </button>

            {done ? (
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-teal-400/40 bg-teal-400/10 text-teal-400">
                  <Icon name="check" size={28} />
                </div>
                <h3 className="h-display mt-5 text-3xl">You&apos;re in!</h3>
                <p className="mt-3 text-sm text-mist">
                  Check your inbox, we&apos;ve just sent your replay link. Enjoy the session!
                </p>
                <button onClick={onClose} className="btn-ghost btn-md mt-6">
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-gold-500/30 bg-gold-500/10 text-gold-300">
                  <Icon name="lock" size={22} />
                </div>
                <h3 className="h-display mt-4 text-center text-3xl">Watch the replay</h3>
                <p className="mt-2 text-center text-sm text-mist">
                  Enter your details for instant access to:
                  <span className="mt-1 block font-semibold text-gold-300">{target.title}</span>
                </p>
                <form onSubmit={onSubmit} className="mt-6">
                  <span aria-hidden className="absolute -left-[9999px]">
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                  </span>
                  <label className="field-label">Full name</label>
                  <input type="text" name="name" required placeholder="Your full name" className="field-input" />
                  <label className="field-label mt-4">Email address</label>
                  <input type="email" name="email" required placeholder="you@practice.com" className="field-input" />
                  <button type="submit" className="btn-gold btn-lg mt-6 w-full">
                    Unlock Replay <Icon name="arrow" size={16} />
                  </button>
                </form>
                <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-mist-dark">
                  <Icon name="lock" size={12} /> We&apos;ll email your replay link. No spam, unsubscribe anytime.
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
