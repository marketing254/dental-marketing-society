"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import FlowLines from "@/components/motion/FlowLines";
import Reveal from "@/components/motion/Reveal";
import ReplayDetailView from "@/components/views/ReplayDetailView";
import WebinarDetailView from "@/components/views/WebinarDetailView";

type Route =
  | { kind: "replay" | "webinar"; slug: string }
  | { kind: "none" };

/**
 * Smart 404. The site is a static export, so a replay/webinar added to the
 * Google Sheet has no pre-rendered page until the next deploy — its URL lands
 * here. When the path looks like /replays/<slug>/ or /webinars/<slug>/ we
 * render the real detail view, which pulls the item live from the sheet, so
 * new content works instantly. Anything else gets a branded 404.
 */
export default function NotFoundView() {
  const [route, setRoute] = useState<Route | null>(null);

  useEffect(() => {
    const path = window.location.pathname.replace(/\/+$/, "");
    let m = path.match(/\/replays\/([^/]+)$/);
    if (m) {
      setRoute({ kind: "replay", slug: decodeURIComponent(m[1]) });
      return;
    }
    m = path.match(/\/webinars\/([^/]+)$/);
    if (m) {
      setRoute({ kind: "webinar", slug: decodeURIComponent(m[1]) });
      return;
    }
    setRoute({ kind: "none" });
  }, []);

  if (!route) return null;
  if (route.kind === "replay") return <ReplayDetailView slug={route.slug} />;
  if (route.kind === "webinar") return <WebinarDetailView slug={route.slug} />;

  return (
    <section className="relative -mt-[110px] overflow-hidden pb-24 pt-[170px] text-center sm:pt-[200px]">
      <FlowLines />
      <div className="container-x relative mx-auto max-w-2xl">
        <Reveal>
          <span className="chip chip-gold !px-4 !py-2 !text-[0.8rem]">404</span>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="h-display mt-6 text-5xl leading-[1.06] sm:text-6xl">
            This page seems to have <em className="text-gold-grad not-italic">wandered off</em>
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-mist">
            The page you&apos;re looking for doesn&apos;t exist or has moved.
            Try one of these instead.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/" className="btn-gold btn-lg">
              <Icon name="back" size={16} /> Back to Home
            </Link>
            <Link href="/events" className="btn-ghost btn-lg">
              Browse Webinars
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
