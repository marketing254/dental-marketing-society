"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import { useUpcomingEvents } from "@/lib/useDmsData";

// Home-page promotional popup. Shows the next upcoming webinar's banner
// (column `popup_banner` in the sheet) shortly after the visitor lands, once
// per browser session. Closes via the X, the backdrop, or the Esc key.
// If the banner image can't load, a text CTA is shown instead (never a broken
// image, never an instant flash-and-dismiss).
const SEEN_KEY = "dms_popup_seen";

export default function PopupBanner() {
  const events = useUpcomingEvents();
  const event = events.find((e) => e.popupBanner) || events[0];
  const banner = event?.popupBanner;
  const [open, setOpen] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  // Show once per session, ~1s after landing. Needs a webinar with a banner.
  useEffect(() => {
    if (!banner) return;
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return;
    } catch {}
    const t = setTimeout(() => setOpen(true), 1000);
    return () => clearTimeout(t);
  }, [banner]);

  const close = () => {
    setOpen(false);
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}
  };

  // Esc to close + lock background scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open || !event) return null;

  const external = /^https?:\/\//.test(event.registerUrl);
  const showImage = banner && !imgFailed;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${event.title} — register`}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        onClick={close}
        className="absolute inset-0 bg-navy-950/85 backdrop-blur-sm"
      />

      {/* Card */}
      <div className="animate-pop relative z-10 my-auto w-full max-w-md sm:max-w-lg lg:max-w-xl">
        <button
          type="button"
          onClick={close}
          aria-label="Close popup"
          className="absolute -right-3 -top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-navy-900 text-ivory shadow-lg transition-colors hover:border-gold-400/60 hover:text-gold-300"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <Link
          href={event.registerUrl}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          onClick={close}
          className="block overflow-hidden rounded-2xl border border-gold-500/25 bg-navy-900 shadow-2xl shadow-navy-950/60"
        >
          {showImage ? (
            <>
              {/* Arbitrary banner aspect ratio → plain img keeps it undistorted.
                  no-referrer is the reliable way to hotlink Google-hosted images. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={banner}
                alt={`${event.title} — register free`}
                referrerPolicy="no-referrer"
                onError={() => setImgFailed(true)}
                className="block max-h-[85vh] min-h-[180px] w-full bg-navy-900 object-contain"
              />
            </>
          ) : (
            // Fallback: a clean text CTA (image missing / not shared publicly).
            <div className="p-8 text-center">
              <span className="chip chip-gold mx-auto">
                <span className="live-dot" /> Live Webinar
              </span>
              <h3 className="h-display mt-4 text-2xl leading-snug">{event.title}</h3>
              {event.dateLabel && (
                <p className="mt-2 text-sm text-mist">
                  {event.dateLabel}
                  {event.time ? ` · ${event.time}` : ""}
                </p>
              )}
              <span className="btn-gold btn-lg mt-6 inline-flex">
                Register Free <Icon name="arrow" size={16} />
              </span>
            </div>
          )}
        </Link>
      </div>
    </div>
  );
}
