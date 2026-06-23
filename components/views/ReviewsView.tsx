"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/motion/Reveal";
import { Section } from "@/components/Section";
import { CtaBand } from "@/components/blocks";
import { useAllReviews } from "@/lib/useDmsData";
import type { Review } from "@/lib/data";

const PER_PAGE = 10;

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function Stars({ n }: { n: number }) {
  return (
    <span className="text-sm tracking-wide" aria-label={`${n} out of 5 stars`}>
      <span className="text-gold-400">{"★".repeat(n)}</span>
      <span className="text-white/15">{"★".repeat(5 - n)}</span>
    </span>
  );
}

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
        className="h-11 w-11 shrink-0 rounded-full border border-white/12 object-cover"
      />
    );
  }
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-500/30 bg-gold-500/10 font-display text-sm font-bold text-gold-300">
      {initials(name)}
    </span>
  );
}

function ReviewCard({ r }: { r: Review }) {
  return (
    <figure className="glass mb-6 break-inside-avoid p-6 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <Stars n={r.rating ?? 5} />
        {r.platform && (
          <span className="chip !px-2.5 !py-1 text-[0.65rem]">{r.platform}</span>
        )}
      </div>
      <blockquote className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ivory/90">
        {r.text}
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-white/8 pt-4">
        <Avatar photo={r.photo} name={r.name} />
        <div className="min-w-0">
          <b className="block truncate text-sm text-ivory">{r.name}</b>
          {r.firm && <span className="block truncate text-xs text-mist">{r.firm}</span>}
        </div>
        {r.date && <span className="ml-auto shrink-0 text-[0.7rem] text-mist-dark">{r.date}</span>}
      </figcaption>
    </figure>
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
    <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
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

export default function ReviewsView() {
  const reviews = useAllReviews();
  const [page, setPage] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);

  const paginate = reviews.length > PER_PAGE;
  const pages = Math.max(1, Math.ceil(reviews.length / PER_PAGE));
  useEffect(() => {
    if (page > pages - 1) setPage(0);
  }, [page, pages]);

  const current = paginate ? reviews.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE) : reviews;

  const avg =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + (r.rating ?? 5), 0) / reviews.length).toFixed(1)
      : "5.0";

  function goTo(p: number) {
    setPage(p);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <PageHero
        kicker="Reviews"
        title={
          <>
            Loved by dental <em className="text-shimmer not-italic">practice owners</em>
          </>
        }
        lead="Real words from the dentists, owners, and teams who&apos;ve attended our webinars and worked with us."
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-2 text-sm font-semibold text-gold-300">
          <span className="text-gold-400">★</span> {avg} average · {reviews.length} reviews
        </span>
      </PageHero>

      <Section className="!pt-6">
        <div className="container-x">
          <div ref={gridRef} className="scroll-mt-28">
            <Reveal>
              <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
                {current.map((r, i) => (
                  <ReviewCard key={`${r.name}-${page}-${i}`} r={r} />
                ))}
              </div>
            </Reveal>
            {paginate && <Pagination page={page} pages={pages} onChange={goTo} />}
          </div>
        </div>
      </Section>

      <CtaBand
        kicker="Join them"
        title="Ready to grow your practice?"
        lead="Register for our free webinars or claim a complimentary practice audit, and see the difference for yourself."
        primary={{ href: "/events#upcoming", label: "See Upcoming Webinars" }}
        secondary={{ href: "/msm", label: "Claim a Free Audit" }}
      />
    </>
  );
}
