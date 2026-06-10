"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import Icon, { type IconName } from "@/components/Icon";
import { SITE } from "@/lib/site";

interface DropItem {
  href: string;
  label: string;
  sub: string;
  icon?: IconName;
  external?: boolean;
}

interface NavItem {
  href: string;
  label: string;
  external?: boolean;
  drop?: DropItem[];
}

const NAV: NavItem[] = [
  { href: "/about", label: "About Us" },
  {
    href: "/events",
    label: "Events",
    drop: [
      { href: "/events", label: "Webinars & Events", sub: "Live sessions & replays", icon: "calendar" },
      { href: "/resources", label: "Podcast", sub: "Coming soon", icon: "mic" },
    ],
  },
  { href: "/#reviews", label: "Reviews" },
  {
    href: "/resources",
    label: "Resources",
    drop: [
      { href: "/resources", label: "Blog & Insights", sub: "Coming soon", icon: "book" },
      { href: "/resources", label: "Free Downloads", sub: "Coming soon", icon: "download" },
      { href: "/resources", label: "Practice Tools", sub: "Coming soon", icon: "tool" },
    ],
  },
  { href: SITE.communityUrl, label: "Community", external: true },
  { href: "/audit", label: "Marketing" },
  {
    href: "/contact",
    label: "Contact Us",
    drop: [
      { href: "/contact", label: "Contact Us", sub: "Get in touch", icon: "mail" },
      { href: "/speaker", label: "Sign up as a Speaker", sub: "Share your expertise", icon: "mic" },
    ],
  },
];

function NavLink({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3.5 py-2 text-[0.84rem] font-semibold text-mist transition-colors hover:text-ivory"
      >
        {item.label}
      </a>
    );
  }
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className="px-3.5 py-2 text-[0.84rem] font-semibold text-mist transition-colors hover:text-ivory"
    >
      {item.label}
    </Link>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileDrop, setMobileDrop] = useState<string | null>(null);
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
    document.body.style.overflow = "";
  }, [pathname]);

  function toggleMenu() {
    const next = !open;
    setOpen(next);
    document.body.style.overflow = next ? "hidden" : "";
  }

  function closeMenu() {
    setOpen(false);
    document.body.style.overflow = "";
  }

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        className="fixed inset-x-0 top-0 z-[60] h-[2.5px] origin-left bg-gradient-to-r from-gold-600 via-gold-400 to-gold-200"
        style={{ scaleX: progress }}
      />

      {/* Utility top bar */}
      <div className="relative z-40 border-b border-white/5 bg-navy-950/90 text-[0.74rem]">
        <div className="container-x flex h-9 items-center justify-between">
          <a
            href={`mailto:${SITE.email}`}
            className="hidden items-center gap-1.5 text-mist transition-colors hover:text-gold-300 sm:inline-flex"
          >
            <Icon name="mail" size={13} /> {SITE.email}
          </a>
          <div className="flex items-center gap-4">
            <span className="hidden font-mono tracking-wider text-gold-400/90 sm:inline">
              EARN FREE CE CREDITS LIVE
            </span>
            <div className="flex items-center gap-2.5 text-mist">
              {(["facebook", "instagram", "linkedin"] as const).map((net) => (
                <a
                  key={net}
                  href={SITE.social[net]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={net}
                  className="transition-colors hover:text-gold-300"
                >
                  <Icon name={net} size={13} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-white/8 bg-navy-950/80 shadow-[0_12px_40px_-12px_rgb(0_0_0/0.6)] backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="container-x">
          <nav className="flex h-[76px] items-center justify-between gap-4">
            <Link
              href="/"
              aria-label="Dental Marketing Society home"
              className="group shrink-0"
            >
              <span className="relative flex items-center rounded-2xl bg-gradient-to-b from-white to-[#f3eee1] px-4 py-2.5 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.75)] ring-1 ring-gold-400/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_16px_38px_-12px_rgba(212,168,47,0.55)] group-hover:ring-gold-400/70">
                {/* soft gold glow behind the chip */}
                <span
                  aria-hidden
                  className="absolute -inset-1 -z-10 rounded-[1.1rem] bg-gold-400/20 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100"
                />
                <Image
                  src="/assets/logo.png"
                  alt="Dental Marketing Society"
                  width={150}
                  height={48}
                  className="h-9 w-auto sm:h-10"
                  priority
                />
              </span>
            </Link>

            {/* Desktop nav — pushed away from the logo for breathing room */}
            <ul className="hidden items-center xl:ml-10 2xl:ml-16 xl:flex">
              {NAV.map((item) => (
                <li key={item.label} className="group relative">
                  <span className="flex items-center">
                    <NavLink item={item} onNavigate={closeMenu} />
                    {item.drop && (
                      <span className="-ml-2.5 mt-0.5 text-mist transition-transform duration-200 group-hover:rotate-180">
                        <svg width="9" height="6" viewBox="0 0 10 6" fill="none">
                          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                      </span>
                    )}
                  </span>
                  {item.drop && (
                    <div className="invisible absolute left-0 top-full pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                      <div className="glass-strong w-72 overflow-hidden !rounded-2xl p-2">
                        {item.drop.map((d) => (
                          <Link
                            key={d.label}
                            href={d.href}
                            className="flex items-center gap-3 rounded-xl px-3.5 py-3 transition-colors hover:bg-white/[0.06]"
                          >
                            {d.icon && (
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gold-500/25 bg-gold-500/10 text-gold-300">
                                <Icon name={d.icon} size={16} />
                              </span>
                            )}
                            <span>
                              <span className="block text-sm font-semibold text-ivory">{d.label}</span>
                              <span className="block text-xs text-mist">{d.sub}</span>
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3">
              <Link href="/audit" className="btn-gold btn-md hidden md:inline-flex">
                <span className="hidden 2xl:inline">Complimentary Practice Audit Session</span>
                <span className="hidden md:inline 2xl:hidden">Free Practice Audit</span>
              </Link>
              {/* Mobile toggle */}
              <button
                onClick={toggleMenu}
                aria-label="Toggle menu"
                aria-expanded={open}
                className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-full border border-white/15 bg-white/[0.04] xl:hidden"
              >
                <span className={`h-[2px] w-5 rounded bg-ivory transition-all duration-300 ${open ? "translate-y-[7px] rotate-45" : ""}`} />
                <span className={`h-[2px] w-5 rounded bg-ivory transition-all duration-300 ${open ? "opacity-0" : ""}`} />
                <span className={`h-[2px] w-5 rounded bg-ivory transition-all duration-300 ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 overflow-y-auto bg-navy-950/95 px-6 pb-16 pt-32 backdrop-blur-2xl xl:hidden"
          >
            <ul className="mx-auto grid max-w-md gap-1">
              {NAV.map((item, i) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                >
                  {item.drop ? (
                    <>
                      <button
                        onClick={() => setMobileDrop(mobileDrop === item.label ? null : item.label)}
                        className="flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left text-lg font-semibold text-ivory"
                      >
                        {item.label}
                        <span className={`transition-transform ${mobileDrop === item.label ? "rotate-180" : ""}`}>
                          <svg width="12" height="8" viewBox="0 0 10 6" fill="none">
                            <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                          </svg>
                        </span>
                      </button>
                      <AnimatePresence>
                        {mobileDrop === item.label && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            {item.drop.map((d) => (
                              <Link
                                key={d.label}
                                href={d.href}
                                onClick={closeMenu}
                                className="block rounded-xl px-7 py-2.5 text-mist"
                              >
                                {d.label}
                                <span className="block text-xs text-mist-dark">{d.sub}</span>
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-xl px-4 py-3.5 text-lg font-semibold text-ivory"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className="block rounded-xl px-4 py-3.5 text-lg font-semibold text-ivory"
                    >
                      {item.label}
                    </Link>
                  )}
                </motion.li>
              ))}
            </ul>
            <div className="mx-auto mt-8 max-w-md">
              <Link href="/audit" onClick={closeMenu} className="btn-gold btn-lg w-full">
                Free Practice Audit <Icon name="arrow" size={16} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
