import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/Icon";
import { SITE } from "@/lib/site";
import { asset } from "@/lib/asset";

const COLUMNS: { title: string; links: { href: string; label: string; external?: boolean }[] }[] = [
  {
    title: "Explore",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/events", label: "Webinars & Events" },
      { href: "/reviews", label: "Reviews" },
      { href: "/speaker", label: "Sign up as a Speaker" },
      { href: SITE.communityUrl, label: "Community", external: true },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/resources", label: "Blog & Insights" },
      { href: "/resources", label: "Free Downloads" },
      { href: "/resources", label: "Practice Tools" },
      { href: "/resources", label: "Podcast" },
    ],
  },
  {
    title: "Get Started",
    links: [
      { href: "/events#upcoming", label: "Request Free Webinars" },
      { href: "/events#archive", label: "Webinar Archive" },
      { href: "/msm", label: "Free Marketing Meeting" },
      { href: "/contact", label: "Contact Us" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/8">
      {/* Glow accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-px mx-auto h-px w-2/3 bg-gradient-to-r from-transparent via-gold-400/60 to-transparent"
      />
      <div className="container-x pb-10 pt-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex">
              <span className="flex items-center rounded-2xl bg-gradient-to-b from-white to-[#f3eee1] px-4 py-2.5 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.75)] ring-1 ring-gold-400/40">
                <Image
                  src={asset("/assets/logo.png")}
                  alt="Dental Marketing Society"
                  width={170}
                  height={54}
                  className="h-11 w-auto"
                />
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-mist">
              Free marketing webinars for dental practice owners. Fill your
              calendar, grow your knowledge, and earn CE credits, live.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-mist">
              <li className="flex items-center gap-2.5">
                <Icon name="mail" size={15} className="shrink-0 text-gold-400" />
                <a href={`mailto:${SITE.email}`} className="transition-colors hover:text-gold-300">
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Icon name="pin" size={15} className="mt-0.5 shrink-0 text-gold-400" />
                {SITE.address}
              </li>
            </ul>
            <div className="mt-6 flex gap-2.5">
              {(["facebook", "instagram", "linkedin", "youtube"] as const).map((net) => (
                <a
                  key={net}
                  href={SITE.social[net]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={net}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-mist transition-all hover:-translate-y-0.5 hover:border-gold-400/50 hover:text-gold-300"
                >
                  <Icon name={net} size={16} />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h5 className="font-mono text-xs font-semibold tracking-[0.22em] text-gold-400 uppercase">
                {col.title}
              </h5>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.external ? (
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-mist transition-colors hover:text-ivory"
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href} className="text-sm text-mist transition-colors hover:text-ivory">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/8 pt-7 text-xs text-mist-dark sm:flex-row">
          <span>© 2026 Dental Marketing Society. All Rights Reserved.</span>
          <span className="flex gap-5">
            <span className="cursor-default">Privacy Policy</span>
            <span className="cursor-default">Terms of Use</span>
            <span className="cursor-default">Accessibility</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
