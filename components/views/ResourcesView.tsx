"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon, { type IconName } from "@/components/Icon";
import FlowLines from "@/components/motion/FlowLines";
import Reveal from "@/components/motion/Reveal";
import TiltCard from "@/components/motion/TiltCard";
import { Section, SectionHead } from "@/components/Section";
import NewsletterForm from "@/components/forms/NewsletterForm";
import { useResources } from "@/lib/useDmsData";
import { sendLead, spamBlock, driveDownloadUrl } from "@/lib/sheets";
import { postToKit } from "@/lib/kit";
import type { ResourceItem } from "@/lib/data";

const UNLOCK_KEY = "dms_resources_unlocked";

function categoryIcon(category: string): IconName {
  const c = category.toLowerCase();
  if (c.includes("template")) return "tool";
  if (c.includes("checklist") && c.includes("guide")) return "book";
  if (c.includes("checklist")) return "target";
  if (c.includes("guide")) return "book";
  if (c.includes("podcast") || c.includes("audio")) return "mic";
  if (c.includes("video")) return "video";
  return "download";
}

export default function ResourcesView() {
  const resources = useResources();
  const [filter, setFilter] = useState("All");
  const [unlocked, setUnlocked] = useState(false);
  const [gateFor, setGateFor] = useState<ResourceItem | null>(null);

  // Returning visitors who already left their details skip the gate.
  useEffect(() => {
    try {
      if (localStorage.getItem(UNLOCK_KEY) === "1") setUnlocked(true);
    } catch {}
  }, []);

  // Downloadable resources first (stable within each group), then coming-soon.
  const sorted = useMemo(
    () => [...resources].sort((a, b) => (b.pdf ? 1 : 0) - (a.pdf ? 1 : 0)),
    [resources]
  );

  const categories = useMemo(() => {
    const seen = new Set<string>();
    for (const r of sorted) if (r.category) seen.add(r.category);
    return ["All", ...Array.from(seen)];
  }, [sorted]);

  const visible = useMemo(
    () => (filter === "All" ? sorted : sorted.filter((r) => r.category === filter)),
    [sorted, filter]
  );

  // Download the file directly (no Drive viewer tab). Drive links go through
  // the uc?export=download endpoint in a hidden iframe so the page stays put;
  // non-Drive links fall back to opening in a new tab.
  function triggerDownload(url?: string) {
    if (!url) return;
    const direct = driveDownloadUrl(url);
    if (direct) {
      const frame = document.createElement("iframe");
      frame.style.display = "none";
      frame.src = direct;
      document.body.appendChild(frame);
      setTimeout(() => frame.remove(), 60_000);
    } else {
      window.open(url, "_blank", "noopener");
    }
  }

  function onUnlock(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement)?.value || "";
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value || "";
    if (spamBlock(form, name)) return;
    setUnlocked(true);
    try {
      localStorage.setItem(UNLOCK_KEY, "1");
    } catch {}
    const payload = {
      form: "resource_download",
      name,
      email,
      resource_title: gateFor?.title || "",
      resource_category: gateFor?.category || "",
      page_url: typeof location !== "undefined" ? location.href : "",
    };
    sendLead(payload);
    postToKit("webinar_replay_gate", {
      name,
      email,
      webinar_title: gateFor ? `Resource: ${gateFor.title}` : "Resource download",
      page_url: payload.page_url,
    });
    triggerDownload(gateFor?.pdf);
    setGateFor(null);
  }

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative -mt-[110px] overflow-hidden pb-16 pt-[170px] text-center sm:pt-[190px]">
        <FlowLines />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-950 to-transparent" />
        <div className="container-x relative mx-auto max-w-3xl">
          <Reveal>
            <span className="chip chip-gold !px-4 !py-2 !text-[0.8rem]">
              <Icon name="download" size={14} /> Free Resource Library
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="h-display mt-6 text-5xl leading-[1.06] sm:text-6xl">
              Guides, templates &amp; checklists{" "}
              <em className="text-gold-grad not-italic">built for dental practices</em>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-mist">
              Practical, no-fluff downloads from the Dental Marketing Society —
              put them to work in your practice the same day. All free.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-mist">
              <span className="inline-flex items-center gap-1.5">
                <Icon name="book" size={15} /> {resources.length} resources
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="shield" size={15} /> 100% free
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="spark" size={15} /> New additions regularly
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ LIBRARY ============ */}
      <Section className="!pt-2">
        <div className="container-x">
          {/* Category filter */}
          <Reveal>
            <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFilter(c)}
                  aria-pressed={filter === c}
                  className={`rounded-full border px-4 py-2 text-[0.8rem] font-semibold transition-colors ${
                    filter === c
                      ? "border-gold-400/60 bg-gold-500/15 text-gold-200"
                      : "border-white/12 bg-white/[0.04] text-mist hover:border-gold-400/30 hover:text-ivory"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((r, i) => (
              <Reveal key={r.title} delay={(i % 3) * 0.08} className="h-full">
                <TiltCard className="h-full">
                  <article className="glass flex h-full flex-col !rounded-3xl p-7 transition-colors duration-300 hover:border-gold-400/30">
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl border border-gold-500/25 bg-gradient-to-br from-gold-500/15 to-transparent text-gold-300"
                        style={{ transform: "translateZ(30px)" }}
                      >
                        <Icon name={categoryIcon(r.category)} size={22} />
                      </span>
                      <span className="chip chip-gold text-[0.65rem]">{r.category}</span>
                    </div>
                    {r.date && (
                      <span className="mt-5 block font-mono text-xs tracking-wider text-gold-400">
                        {r.date}
                      </span>
                    )}
                    <h3 className={`h-display text-2xl leading-snug ${r.date ? "mt-2" : "mt-5"}`}>
                      {r.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-mist">{r.description}</p>
                    {r.author && (
                      <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-mist-dark">
                        <Icon name="users" size={13} /> By {r.author}
                      </p>
                    )}
                    {r.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {r.tags.map((t) => (
                          <span key={t} className="chip !text-[0.65rem]">{t}</span>
                        ))}
                      </div>
                    )}
                    <div className="mt-auto pt-6">
                      {!r.pdf ? (
                        <button
                          type="button"
                          disabled
                          className="btn-ghost btn-lg w-full cursor-not-allowed opacity-60"
                        >
                          <Icon name="clock" size={16} /> Coming Soon
                        </button>
                      ) : unlocked ? (
                        <button
                          type="button"
                          onClick={() => triggerDownload(r.pdf)}
                          className="btn-gold btn-lg w-full"
                        >
                          Download Free <Icon name="download" size={16} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setGateFor(r)}
                          className="btn-gold btn-lg w-full"
                        >
                          Download Free <Icon name="download" size={16} />
                        </button>
                      )}
                    </div>
                  </article>
                </TiltCard>
              </Reveal>
            ))}
          </div>

          {visible.length === 0 && (
            <p className="py-10 text-center text-mist">
              No resources in this category yet — check back soon.
            </p>
          )}
        </div>
      </Section>

      {/* ============ DOWNLOAD GATE ============ */}
      <AnimatePresence>
        {gateFor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-navy-950/80 px-4 py-10 backdrop-blur-sm"
            onClick={() => setGateFor(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="glass-strong relative w-full max-w-lg !rounded-3xl p-7 sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setGateFor(null)}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-mist transition-colors hover:text-ivory"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
              <span className="flex h-13 w-13 items-center justify-center rounded-2xl border border-gold-500/25 bg-gold-500/10 text-gold-300">
                <Icon name="lock" size={22} />
              </span>
              <h3 className="h-display mt-5 text-2xl leading-snug">{gateFor.title}</h3>
              <p className="mt-2 text-sm text-mist">
                Tell us where to send it — we&apos;ll unlock the download instantly.
                No spam, ever.
              </p>
              <form onSubmit={onUnlock} className="mt-6">
                <span className="dms-hp" aria-hidden style={{ position: "absolute", left: "-9999px" }}>
                  <input type="text" name="dms_hp" tabIndex={-1} autoComplete="off" aria-hidden="true" data-1p-ignore data-lpignore="true" data-form-type="other" />
                </span>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="field-label">Full name</label>
                    <input name="name" required placeholder="Your full name" className="field-input" />
                  </div>
                  <div>
                    <label className="field-label">Email address</label>
                    <input name="email" type="email" required placeholder="you@practice.com" className="field-input" />
                  </div>
                </div>
                <button type="submit" className="btn-gold btn-lg mt-5 w-full">
                  Unlock Download <Icon name="download" size={16} />
                </button>
                <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-mist-dark">
                  <Icon name="shield" size={13} /> Unlocks the whole library — one time only
                </p>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============ NEWSLETTER ============ */}
      <Section soft>
        <div className="container-x mx-auto max-w-3xl">
          <SectionHead
            kicker="Stay in the loop"
            title={
              <>
                New resources, <em className="text-gold-grad not-italic">delivered first</em>
              </>
            }
            lead="Join the list and get every new guide, template, and checklist in your inbox the moment it drops."
          />
          <Reveal delay={0.1}>
            <div className="glass-strong mx-auto max-w-lg p-7">
              <NewsletterForm
                source="resources-updates"
                buttonLabel="Subscribe"
                doneLabel="Thanks! You're on the list."
              />
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
