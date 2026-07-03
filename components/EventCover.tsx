import Icon from "@/components/Icon";

/**
 * A custom-designed, on-brand webinar cover graphic — replaces the old baked-in
 * promo banner JPGs. Pure CSS/SVG, so the title is crisp, high-contrast and
 * perfectly legible at any size. The theme rotates by index for variety.
 */
const THEMES = [
  {
    bg: "linear-gradient(135deg,#102036 0%,#0a1422 60%,#0d1a2e 100%)",
    g1: "rgba(212,168,47,0.40)",
    g2: "rgba(47,169,196,0.18)",
    ring: "rgba(240,212,137,0.45)",
    accent: "#f0d489",
  },
  {
    bg: "linear-gradient(135deg,#15233a 0%,#0a1422 58%,#101d33 100%)",
    g1: "rgba(232,196,92,0.34)",
    g2: "rgba(212,168,47,0.22)",
    ring: "rgba(232,196,92,0.42)",
    accent: "#f6e3a8",
  },
  {
    bg: "linear-gradient(135deg,#0e2330 0%,#0a1422 60%,#13233a 100%)",
    g1: "rgba(212,168,47,0.36)",
    g2: "rgba(47,169,196,0.22)",
    ring: "rgba(240,212,137,0.40)",
    accent: "#f0d489",
  },
];

export default function EventCover({
  title,
  label = "Live Webinar",
  day,
  month,
  index = 0,
  showTitle = true,
}: {
  title: string;
  label?: string;
  day?: string;
  month?: string;
  index?: number;
  /** When false the title text is hidden (avoids repeating it under a card). */
  showTitle?: boolean;
}) {
  const t = THEMES[index % THEMES.length];
  return (
    <div className="absolute inset-0 select-none" style={{ background: t.bg }}>
      {/* Corner glows */}
      <div
        className="absolute -right-12 -top-14 h-52 w-52 rounded-full blur-3xl"
        style={{ background: t.g1 }}
      />
      <div
        className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full blur-2xl"
        style={{ background: t.g2 }}
      />

      {/* Dotted grid */}
      <div
        className="absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.85) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />

      {/* Concentric arcs */}
      <svg
        className="absolute -right-6 -top-8 h-52 w-52 opacity-50"
        viewBox="0 0 200 200"
        fill="none"
        aria-hidden
      >
        <circle cx="168" cy="42" r="58" stroke={t.ring} strokeWidth="1.4" />
        <circle
          cx="168"
          cy="42"
          r="92"
          stroke={t.ring}
          strokeOpacity="0.5"
          strokeWidth="1"
          strokeDasharray="3 7"
        />
      </svg>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-6">
        <div className="flex items-start justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-navy-950/45 px-3 py-1 text-[0.62rem] font-bold tracking-[0.18em] text-ivory uppercase backdrop-blur">
            <Icon name="tooth" size={12} style={{ color: t.accent }} /> DMS Webinar
          </span>
          {day && month && (
            <span className="flex flex-col items-center rounded-xl border border-white/15 bg-white/[0.07] px-3 py-1.5 backdrop-blur">
              <span className="font-display text-xl font-bold leading-none text-ivory">
                {day}
              </span>
              <span
                className="text-[0.55rem] font-bold tracking-widest uppercase"
                style={{ color: t.accent }}
              >
                {month}
              </span>
            </span>
          )}
        </div>

        {/* Centered brand emblem — fills the space when the title is hidden. */}
        {!showTitle && (
          <div className="flex flex-1 items-center justify-center py-2">
            <span
              className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.07] backdrop-blur"
              style={{ boxShadow: `0 0 44px ${t.g1}` }}
            >
              <Icon name="tooth" size={30} style={{ color: t.accent }} />
            </span>
          </div>
        )}

        <div>
          <span
            className="inline-flex items-center gap-1.5 text-[0.68rem] font-bold tracking-[0.16em] uppercase"
            style={{ color: t.accent }}
          >
            <span className="live-dot" /> {label}
          </span>
          {showTitle && (
            <h3
              className="font-display mt-1.5 line-clamp-2 text-[1.5rem] font-semibold leading-tight text-ivory"
              style={{ textShadow: "0 2px 14px rgba(0,0,0,0.45)" }}
            >
              {title}
            </h3>
          )}
        </div>
      </div>
    </div>
  );
}
