"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/Icon";
import FlowLines from "@/components/motion/FlowLines";
import Reveal from "@/components/motion/Reveal";
import TiltCard from "@/components/motion/TiltCard";
import EventCover from "@/components/EventCover";
import Transcript from "@/components/Transcript";
import RichDoc from "@/components/RichDoc";
import { Section, SectionHead } from "@/components/Section";
import { useReplay, useArchive } from "@/lib/useDmsData";
import { videoEmbedUrl } from "@/lib/embed";
import { sendLead, spamBlock } from "@/lib/sheets";
import type { ArchiveItem } from "@/lib/data";

const isUrl = (s?: string) => !!s && /^https?:\/\//.test(s);

export default function ReplayDetailView({
  slug,
  initial = null,
}: {
  slug: string;
  initial?: ArchiveItem | null;
}) {
  const live = useReplay(slug);
  const item = live ?? initial;
  const archive = useArchive();
  const [unlocked, setUnlocked] = useState(false);
  const [tab, setTab] = useState<"about" | "transcript">("about");

  const more = archive.filter((r) => r.slug !== slug).slice(0, 3);
  const embed = videoEmbedUrl(item?.vimeo);
  const hasAbout = !!(item && (item.summary || item.description));
  const hasTranscript = !!(item && item.transcript);
  const activeTab =
    tab === "transcript" && hasTranscript ? "transcript" : hasAbout ? "about" : "transcript";

  function onUnlock(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement)?.value || "";
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value || "";
    if (spamBlock(form, name)) return;
    setUnlocked(true);
    sendLead({
      form: "webinar_replay_gate",
      name,
      email,
      webinar_title: item?.title || "",
      replay_slug: slug,
      page_url: typeof location !== "undefined" ? location.href : "",
    });
  }

  return (
    <>
      {/* Hero */}
      <section className="relative -mt-[110px] overflow-hidden pb-10 pt-[170px] sm:pt-[200px]">
        <FlowLines />
        <div className="container-x relative mx-auto max-w-4xl text-center">
          <Reveal>
            <Link
              href="/events#archive"
              className="inline-flex items-center gap-1.5 text-sm text-mist transition-colors hover:text-gold-300"
            >
              <Icon name="back" size={15} /> All replays
            </Link>
          </Reveal>
          <Reveal delay={0.05}>
            <span className="chip chip-gold mt-5">
              <Icon name="replay" size={13} /> {item?.category || "Webinar Replay"}
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="h-display mx-auto mt-4 max-w-3xl text-4xl leading-[1.1] sm:text-5xl">
              {item ? item.title : "Replay not found"}
            </h1>
          </Reveal>
          {item?.subtitle && (
            <Reveal delay={0.15}>
              <p className="mx-auto mt-3 max-w-2xl text-lg leading-relaxed text-mist">
                {item.subtitle}
              </p>
            </Reveal>
          )}
          {item && (
            <Reveal delay={0.2}>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm text-mist">
                {item.date && (
                  <span className="inline-flex items-center gap-1.5">
                    <Icon name="calendar" size={15} /> {item.date}
                  </span>
                )}
                {item.duration && (
                  <span className="inline-flex items-center gap-1.5">
                    <Icon name="clock" size={15} /> {item.duration}
                  </span>
                )}
                {item.category && (
                  <span className="inline-flex items-center gap-1.5">
                    <Icon name="award" size={15} /> {item.category}
                  </span>
                )}
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {!item ? (
        <Section>
          <div className="container-x text-center">
            <p className="text-mist">
              We couldn&apos;t find that replay. Browse the full archive instead.
            </p>
            <Link href="/events#archive" className="btn-gold btn-lg mt-6">
              Browse the Archive <Icon name="arrow" size={16} />
            </Link>
          </div>
        </Section>
      ) : (
        <>
          {/* Player */}
          <Section className="!pt-2">
            <div className="container-x mx-auto max-w-4xl">
              <Reveal>
                <div className="glass-strong overflow-hidden !rounded-3xl p-2.5">
                  <div className="relative aspect-video overflow-hidden rounded-2xl">
                    {unlocked && embed ? (
                      <iframe
                        src={embed}
                        title={item.title}
                        className="absolute inset-0 h-full w-full"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <>
                        {item.image ? (
                          <Image src={item.image} alt={item.title} fill className="object-cover" sizes="100vw" />
                        ) : (
                          <EventCover title={item.title} label="Replay" />
                        )}
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-navy-950/70 backdrop-blur-sm">
                          {unlocked && !embed ? (
                            <p className="px-6 text-center text-sm text-mist">
                              This replay isn&apos;t available to stream yet, we&apos;ll email you the link.
                            </p>
                          ) : (
                            <>
                              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold-400/50 bg-gold-500/20 text-gold-300">
                                <Icon name="lock" size={26} />
                              </span>
                              <p className="px-6 text-center text-sm font-semibold text-ivory">
                                Enter your details below to unlock the replay
                              </p>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </Reveal>

              {/* Gate form */}
              {!unlocked && (
                <Reveal delay={0.1}>
                  <form
                    onSubmit={onUnlock}
                    className="glass mx-auto mt-6 max-w-xl !rounded-3xl p-6 sm:p-8"
                  >
                    <span className="dms-hp" aria-hidden style={{ position: "absolute", left: "-9999px" }}>
                      <input type="text" name="dms_hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                    </span>
                    <h3 className="h-display text-2xl">Watch the replay free</h3>
                    <p className="mt-1 text-sm text-mist">
                      We&apos;ll unlock it instantly and email you the link too. No spam.
                    </p>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
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
                      Unlock Replay <Icon name="arrow" size={16} />
                    </button>
                  </form>
                </Reveal>
              )}

              {(hasAbout || hasTranscript) && (
                <Reveal delay={0.15}>
                  <div className="mx-auto mt-10 max-w-3xl">
                    {/* Tabs */}
                    <div className="flex flex-wrap gap-1 border-b border-white/10">
                      {hasAbout && (
                        <button
                          type="button"
                          onClick={() => setTab("about")}
                          className={`-mb-px flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors ${
                            activeTab === "about"
                              ? "border-b-2 border-gold-400 text-gold-300"
                              : "border-b-2 border-transparent text-mist hover:text-ivory"
                          }`}
                        >
                          <Icon name="book" size={15} /> About this session
                        </button>
                      )}
                      {hasTranscript && (
                        <button
                          type="button"
                          onClick={() => setTab("transcript")}
                          className={`-mb-px flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors ${
                            activeTab === "transcript"
                              ? "border-b-2 border-gold-400 text-gold-300"
                              : "border-b-2 border-transparent text-mist hover:text-ivory"
                          }`}
                        >
                          <Icon name="search" size={15} /> Transcript
                        </button>
                      )}
                    </div>

                    {/* Panels — both stay mounted so neither re-fetches on switch */}
                    {hasAbout && (
                      <div className={activeTab === "about" ? "mt-6" : "hidden"}>
                        {isUrl(item.description) ? (
                          <RichDoc url={item.description!} fallback={item.summary} />
                        ) : (
                          <p className="leading-relaxed text-mist">
                            {item.summary || item.description}
                          </p>
                        )}
                      </div>
                    )}
                    {hasTranscript && (
                      <div className={activeTab === "transcript" ? "mt-6" : "hidden"}>
                        <Transcript url={item.transcript!} title={item.title} />
                      </div>
                    )}
                  </div>
                </Reveal>
              )}
            </div>
          </Section>

          {/* More replays */}
          {more.length > 0 && (
            <Section soft>
              <div className="container-x">
                <SectionHead kicker="Keep learning" title="More webinar replays" />
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {more.map((r, i) => (
                    <Reveal key={r.slug} delay={(i % 3) * 0.08} className="h-full">
                      <TiltCard className="h-full">
                        <Link
                          href={`/replays/${r.slug}`}
                          className="glass group flex h-full flex-col overflow-hidden !rounded-3xl"
                        >
                          <div className="relative aspect-video overflow-hidden">
                            <EventCover title={r.title} label="Replay" index={i} />
                            <span className="absolute inset-0 flex items-center justify-center">
                              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold-400/50 bg-gold-500/20 text-gold-300 transition-transform duration-300 group-hover:scale-110">
                                <Icon name="play" size={22} className="ml-1" />
                              </span>
                            </span>
                          </div>
                          <div className="flex flex-1 flex-col p-6">
                            <span className="font-mono text-xs tracking-wider text-gold-400">{r.date}</span>
                            <h3 className="h-display mt-2 text-lg leading-snug">{r.title}</h3>
                            {r.summary && (
                              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-mist">
                                {r.summary}
                              </p>
                            )}
                          </div>
                        </Link>
                      </TiltCard>
                    </Reveal>
                  ))}
                </div>
              </div>
            </Section>
          )}
        </>
      )}
    </>
  );
}
