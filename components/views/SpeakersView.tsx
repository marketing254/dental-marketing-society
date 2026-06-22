"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/motion/Reveal";
import { Section } from "@/components/Section";
import { CtaBand } from "@/components/blocks";
import { useSpeakers } from "@/lib/useDmsData";
import type { Speaker } from "@/lib/data";
import type { IconName } from "@/components/Icon";

const PER_PAGE = 6;
const BIO_LIMIT = 200;

const PLATFORM_ICON: Record<string, IconName> = {
  linkedin: "linkedin",
  instagram: "instagram",
  facebook: "facebook",
  youtube: "youtube",
  twitter: "globe",
  tiktok: "globe",
  email: "mail",
  website: "globe",
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Splits "Title, Company" into [title, company]; leaves title-only intact. */
function splitRole(role: string): [string, string] {
  const i = role.indexOf(",");
  if (i === -1) return [role.trim(), ""];
  return [role.slice(0, i).trim(), role.slice(i + 1).trim()];
}

/** Photo that falls back to an initials avatar when missing or broken. */
function Avatar({ photo, name }: { photo?: string; name: string }) {
  const [broken, setBroken] = useState(false);
  if (photo && !broken) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photo}
        alt={name}
        loading="lazy"
        onError={() => setBroken(true)}
        className="h-16 w-16 shrink-0 rounded-full border border-white/12 object-cover"
      />
    );
  }
  return (
    <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-gold-500/30 bg-gold-500/10 font-display text-xl font-bold text-gold-300">
      {initials(name)}
    </span>
  );
}

function SpeakerCard({ sp }: { sp: Speaker }) {
  const [open, setOpen] = useState(false);
  const bio = sp.bio || "";
  const long = bio.length > BIO_LIMIT;
  const shown = open || !long ? bio : `${bio.slice(0, BIO_LIMIT).trimEnd()}…`;
  const [title, company] = splitRole(sp.role || "");
  const contacts = sp.contacts ?? [];

  return (
    <div className="glass flex h-full flex-col p-6 sm:p-7">
      <div className="flex items-start gap-4">
        <Avatar photo={sp.photo} name={sp.name} />
        <div className="min-w-0">
          <h3 className="h-display text-xl leading-tight">{sp.name}</h3>
          {title && <p className="mt-0.5 text-sm font-semibold leading-snug text-gold-300">{title}</p>}
          {company && <p className="text-sm text-mist">{company}</p>}
        </div>
      </div>

      {bio && (
        <div className="mt-4">
          <p className="text-sm leading-relaxed text-mist">{shown}</p>
          {long && (
            <button
              onClick={() => setOpen((v) => !v)}
              className="mt-1.5 text-sm font-semibold text-gold-300 transition-colors hover:text-gold-200"
            >
              {open ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      )}

      {sp.topic && (
        <p className="mt-4 border-l-2 border-gold-500/40 pl-3 text-xs leading-relaxed text-mist-dark">
          {sp.topic}
        </p>
      )}

      {contacts.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-2.5 pt-5">
          {contacts.map((c, i) => (
            <a
              key={`${c.platform}-${i}`}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${sp.name} on ${c.label}`}
              title={c.label}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-mist transition-all hover:-translate-y-0.5 hover:border-gold-400/50 hover:text-gold-300"
            >
              <Icon name={PLATFORM_ICON[c.platform] || "globe"} size={15} />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function Pagination({
  page,
  pages,
  onChange,
}: {
  page: number;
  pages: number;
  onChange: (p: number) => void;
}) {
  const btn =
    "flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-sm font-semibold transition-colors";
  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      <button
        onClick={() => onChange(Math.max(0, page - 1))}
        disabled={page === 0}
        className={`${btn} border-white/12 text-mist hover:border-gold-400/50 hover:text-gold-300 disabled:cursor-not-allowed disabled:opacity-40`}
        aria-label="Previous page"
      >
        <Icon name="back" size={16} />
      </button>
      {Array.from({ length: pages }).map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          aria-current={i === page}
          className={`${btn} ${
            i === page
              ? "border-gold-400/60 bg-gold-500/15 text-gold-200"
              : "border-white/12 text-mist hover:border-gold-400/50 hover:text-gold-300"
          }`}
        >
          {i + 1}
        </button>
      ))}
      <button
        onClick={() => onChange(Math.min(pages - 1, page + 1))}
        disabled={page === pages - 1}
        className={`${btn} border-white/12 text-mist hover:border-gold-400/50 hover:text-gold-300 disabled:cursor-not-allowed disabled:opacity-40`}
        aria-label="Next page"
      >
        <Icon name="arrow" size={16} />
      </button>
    </div>
  );
}

export default function SpeakersView() {
  const speakers = useSpeakers();
  const [page, setPage] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);

  const pages = Math.max(1, Math.ceil(speakers.length / PER_PAGE));
  // Keep page in range if the data size changes after load.
  useEffect(() => {
    if (page > pages - 1) setPage(0);
  }, [page, pages]);

  const current = speakers.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  function goTo(p: number) {
    setPage(p);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <PageHero
        kicker="Our Speakers"
        title={
          <>
            Learn from the{" "}
            <em className="text-shimmer not-italic">industry&apos;s best</em>
          </>
        }
        lead="Our webinars feature dental marketing leaders, practice owners, and growth specialists, each sharing proven, practical strategies you can put to work."
      >
        <Link href="/speaker" className="btn-gold btn-lg">
          Apply to Speak <Icon name="arrow" size={16} />
        </Link>
        <Link href="/events#upcoming" className="btn-ghost btn-lg">
          See Upcoming Webinars
        </Link>
      </PageHero>

      <Section className="!pt-6">
        <div className="container-x">
          <div ref={gridRef} className="scroll-mt-28 grid gap-6 md:grid-cols-2">
            {current.map((sp, i) => (
              <Reveal key={`${sp.name}-${page}-${i}`} delay={(i % 2) * 0.08} className="h-full">
                <SpeakerCard sp={sp} />
              </Reveal>
            ))}
          </div>
          {pages > 1 && <Pagination page={page} pages={pages} onChange={goTo} />}
        </div>
      </Section>

      <CtaBand
        kicker="Share your expertise"
        title="Want to speak on a DMS webinar?"
        lead="Reach an engaged audience of dental practice owners. We handle the tech, promotion, and production, you bring the insight."
        primary={{ href: "/speaker", label: "Apply to Speak" }}
        secondary={{ href: "/events#upcoming", label: "Browse Webinars" }}
      />
    </>
  );
}
