"use client";

import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/Icon";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/motion/Reveal";
import TiltCard from "@/components/motion/TiltCard";
import { Section } from "@/components/Section";
import { CtaBand } from "@/components/blocks";
import { usePartners } from "@/lib/useDmsData";

export default function PartnersView() {
  const partners = usePartners();

  return (
    <>
      <PageHero
        kicker="Featured Partners"
        title={
          <>
            The brands that{" "}
            <em className="text-shimmer not-italic">power our community</em>
          </>
        }
        lead="We collaborate with leading dental publications, technology providers, and organizations to bring practice owners the very best in marketing education."
      >
        <Link href="/contact" className="btn-gold btn-lg">
          Become a Partner <Icon name="arrow" size={16} />
        </Link>
      </PageHero>

      <Section className="!pt-6">
        <div className="container-x">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((p, i) => {
              const card = (
                <div className="glass group flex h-full flex-col items-center !rounded-3xl p-7 text-center transition-colors duration-300 hover:border-gold-400/30">
                  <div className="flex h-28 w-full items-center justify-center overflow-hidden rounded-2xl border border-white/8 bg-white p-5">
                    {p.logo ? (
                      <Image
                        src={p.logo}
                        alt={p.name}
                        width={260}
                        height={120}
                        className="max-h-16 w-auto object-contain"
                      />
                    ) : (
                      <span className="font-display text-3xl font-bold text-navy-800">
                        {p.name
                          .split(/\s+/)
                          .map((w) => w[0])
                          .filter(Boolean)
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                    )}
                  </div>
                  <h3 className="h-display mt-5 text-xl">{p.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist">
                    {p.blurb || "Featured Dental Marketing Society partner"}
                  </p>
                  {p.url && (
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-300">
                      Visit <Icon name="arrow" size={14} />
                    </span>
                  )}
                </div>
              );
              return (
                <Reveal key={p.name + i} delay={(i % 3) * 0.08} className="h-full">
                  <TiltCard className="h-full">
                    {p.url ? (
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="block h-full">
                        {card}
                      </a>
                    ) : (
                      card
                    )}
                  </TiltCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Section>

      <CtaBand
        kicker="Partner with us"
        title="Reach engaged dental practice owners"
        lead="Get your brand in front of dentists actively investing in growing their practices. Let's explore a partnership."
        primary={{ href: "/contact", label: "Get in Touch" }}
        secondary={{ href: "/about", label: "About the Society" }}
      />
    </>
  );
}
