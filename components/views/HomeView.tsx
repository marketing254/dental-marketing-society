"use client";

import Link from "next/link";
import Image from "next/image";
import Icon, { type IconName } from "@/components/Icon";
import FlowLines from "@/components/motion/FlowLines";
import EventCover from "@/components/EventCover";
import Reveal from "@/components/motion/Reveal";
import TiltCard from "@/components/motion/TiltCard";
import { Section, SectionHead } from "@/components/Section";
import {
  EventCard,
  FeatureCard,
  StatBand,
  CtaBand,
  PartnersMarquee,
  FaqList,
} from "@/components/blocks";
import NewsletterForm from "@/components/forms/NewsletterForm";
import {
  useUpcomingEvents,
  useSpeakers,
  useReviews,
  usePartners,
  useFaqs,
} from "@/lib/useDmsData";

const PROCESS_STEPS: { icon: IconName; title: string; text: string }[] = [
  { icon: "calendar", title: "Register", text: "Pick an upcoming webinar and reserve your free seat in under a minute." },
  { icon: "video", title: "Attend Live", text: "Join the live session, or watch the replay if you can't make it." },
  { icon: "award", title: "Earn CE Credits", text: "Qualify for free continuing education credits by attending live." },
  { icon: "trending", title: "Grow", text: "Apply what you learn and watch new patients fill your calendar." },
];

export default function HomeView() {
  const events = useUpcomingEvents();
  const speakers = useSpeakers();
  const reviews = useReviews("home");
  const partners = usePartners();
  const faqs = useFaqs();

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative -mt-[110px] overflow-hidden pb-24 pt-[180px] text-center sm:pt-[210px]">
        <FlowLines />
        <div className="container-x relative mx-auto max-w-4xl">
          <Reveal>
            <span className="kicker kicker-center">Free webinars for dental practice owners</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="h-display mx-auto mt-6 max-w-4xl text-5xl leading-[1.06] sm:text-6xl lg:text-7xl">
              Marketing Webinars For{" "}
              <em className="text-shimmer not-italic">Dental Practice</em> Owners
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-mist">
              Fill your calendar with new patients and expand your marketing
              knowledge. Learn the digital strategies that grow modern dental
              practices, straight from the people who do it every day.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link href="/events#upcoming" className="btn-gold btn-lg">
                Register for a Webinar <Icon name="arrow" size={16} />
              </Link>
              <Link href="/audit" className="btn-ghost btn-lg">
                Book a Free Meeting
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.4}>
            <div className="mt-8 flex items-center justify-center gap-2.5">
              <span className="text-gold-400">★★★★★</span>
              <span className="text-sm text-mist">
                Loved by dental practice owners &amp; teams
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ SERVICES ============ */}
      <Section id="services" className="!pt-8">
        <div className="container-x grid gap-6 md:grid-cols-3">
          <FeatureCard
            icon="users"
            title="Attract New Patients"
            text="Proven digital marketing strategies to keep your calendar full with the patients you want most."
          />
          <FeatureCard
            icon="award"
            title="Earn Free CE Credits"
            text="Attend our webinars live and earn free continuing education credits while you learn."
            delay={0.1}
          />
          <FeatureCard
            icon="chart"
            title="Expert-Led Sessions"
            text="Learn from speakers who live and breathe dental marketing, leadership, and practice growth."
            delay={0.2}
          />
        </div>
      </Section>

      {/* ============ ABOUT ============ */}
      <Section id="about" soft>
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <span className="kicker">About Us</span>
            <h2 className="h-display mt-4 text-4xl sm:text-5xl">
              Marketing knowledge that <em className="text-gold-grad not-italic">fills chairs</em>
            </h2>
            <p className="mt-5 leading-relaxed text-mist">
              The Dental Marketing Society hosts free, expert-led webinars that
              help dental practice owners attract the right patients, sharpen
              their marketing, and run more profitable practices, all while
              earning CE credits.
            </p>
            <ul className="mt-8 space-y-5">
              {[
                ["Practical, not theoretical", "Strategies you can apply in your practice the very next week."],
                ["Free CE credits", "Earn continuing education credits by attending live."],
                ["Replay access included", "Can't make it live? Every registration gets the replay."],
              ].map(([title, text]) => (
                <li key={title} className="flex gap-4">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold-500/40 bg-gold-500/10 text-gold-300">
                    <Icon name="check" size={13} />
                  </span>
                  <div>
                    <b className="block text-ivory">{title}</b>
                    <span className="text-sm text-mist">{text}</span>
                  </div>
                </li>
              ))}
            </ul>
            <Link href="/audit" className="btn-gold btn-lg mt-9">
              Book a Free Marketing Meeting <Icon name="arrow" size={16} />
            </Link>
          </Reveal>
          <Reveal delay={0.15}>
            <TiltCard maxTilt={5}>
              <div className="relative">
                <div
                  aria-hidden
                  className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-br from-gold-500/25 via-transparent to-teal-400/15 blur-2xl"
                />
                <div className="glass overflow-hidden !rounded-[2rem] p-2">
                  <div className="relative aspect-[1200/630] overflow-hidden rounded-[1.6rem]">
                    <EventCover
                      title="Live expert webinars, every month"
                      label="Education that fills chairs"
                      index={1}
                    />
                  </div>
                </div>
                <div className="glass absolute -bottom-5 left-8 flex items-center gap-2 !rounded-full px-5 py-3 text-sm font-bold text-gold-300">
                  <Icon name="award" size={16} /> PACE CE Accredited
                </div>
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </Section>

      {/* ============ PROCESS ============ */}
      <Section id="how">
        <div className="container-x">
          <SectionHead
            kicker="How It Works"
            title="From sign-up to growth in four steps"
            lead="Joining a webinar is simple, here's the journey from registration to a fuller calendar."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.1}>
                <TiltCard className="h-full">
                  <div className="glass relative h-full p-7 text-center">
                    <span className="text-gold-grad font-display absolute right-5 top-3 text-5xl font-bold opacity-30">
                      {i + 1}
                    </span>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-gold-500/25 bg-gradient-to-br from-gold-500/15 to-transparent text-gold-300">
                      <Icon name={step.icon} size={26} />
                    </div>
                    <h4 className="h-display mt-5 text-2xl">{step.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-mist">{step.text}</p>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ============ STATS ============ */}
      <Section className="!py-6">
        <div className="container-x">
          <StatBand
            stats={[
              { value: "Free", label: "To attend, every session" },
              { value: "2 CE", label: "Credits per live webinar" },
              { value: "PACE", label: "Accredited education" },
              { value: "Replay", label: "Access for all registrants" },
            ]}
          />
        </div>
      </Section>

      {/* ============ EVENTS ============ */}
      <Section id="events">
        <div className="container-x">
          <SectionHead
            kicker="Upcoming Webinars"
            title="Register for our upcoming webinars"
            lead="Enlighten your knowledge on digital marketing for your practice. Secure your spot soon, seats are limited."
          />
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
            {events.map((ev, i) => (
              <EventCard key={ev.title} event={ev} delay={i * 0.1} index={i} />
            ))}
          </div>
        </div>
      </Section>

      {/* ============ SPEAKERS ============ */}
      <Section id="speakers" soft>
        <div className="container-x">
          <SectionHead
            kicker="Our Speakers"
            title="Learn from the experts"
            lead="Our webinars feature dental marketing leaders, practice owners, and growth specialists from across the industry."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {speakers.map((sp, i) => (
              <Reveal key={sp.name} delay={i * 0.08}>
                <TiltCard className="h-full">
                  <div className="glass group h-full overflow-hidden !rounded-3xl">
                    <div className="relative aspect-square overflow-hidden">
                      {sp.photo ? (
                        <Image
                          src={sp.photo}
                          alt={sp.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, 25vw"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-navy-800 font-display text-5xl text-gold-300">
                          {sp.name.split(/\s+/).map((n) => n[0]).slice(0, 2).join("")}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-transparent to-transparent" />
                      {sp.linkedin && (
                        <a
                          href={sp.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${sp.name} on LinkedIn`}
                          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-navy-950/60 text-ivory opacity-0 backdrop-blur transition-all hover:text-gold-300 group-hover:opacity-100"
                        >
                          <Icon name="linkedin" size={15} />
                        </a>
                      )}
                    </div>
                    <div className="p-5">
                      <h4 className="h-display text-xl">{sp.name}</h4>
                      <small className="text-xs text-mist">{sp.role}</small>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ============ REVIEWS ============ */}
      <Section id="reviews">
        <div className="container-x">
          <SectionHead
            kicker="Reviews"
            title="What practice owners are saying"
            lead="Dentists and practice owners on what our webinars have done for their marketing."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {reviews.map((r, i) => (
              <Reveal key={i} delay={i * 0.1} className="h-full">
                <TiltCard className="h-full">
                  <figure className="glass relative h-full p-7">
                    <span aria-hidden className="text-gold-grad font-display absolute -top-2 right-6 text-7xl">
                      ”
                    </span>
                    <div className="text-gold-400">★★★★★</div>
                    <blockquote className="mt-4 text-sm leading-relaxed text-ivory/90">{r.text}</blockquote>
                    <figcaption className="mt-6 flex items-center gap-3 border-t border-white/8 pt-5">
                      {r.photo && (
                        <Image
                          src={r.photo}
                          alt=""
                          width={42}
                          height={42}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <b className="block text-sm">{r.name}</b>
                        <small className="text-xs text-mist">{r.firm}</small>
                      </div>
                    </figcaption>
                  </figure>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ============ PARTNERS ============ */}
      <Section className="!py-10" id="resources">
        <Reveal className="container-x mb-8 text-center">
          <p className="font-mono text-xs tracking-[0.25em] text-mist uppercase">
            Trusted by practice owners &amp; dental teams across North America
          </p>
        </Reveal>
        <PartnersMarquee partners={partners} />
      </Section>

      {/* ============ FAQ ============ */}
      <Section id="faq" soft>
        <div className="container-x mx-auto max-w-3xl">
          <SectionHead
            kicker="FAQ"
            title="Questions, answered"
            lead="The essentials about our webinars, CE credits, and replays."
          />
          <FaqList faqs={faqs} />
        </div>
      </Section>

      {/* ============ CTA ============ */}
      <CtaBand
        kicker="Get Started"
        title="Ready to fill your calendar with new patients?"
        lead="Register for our upcoming webinars to enlighten your knowledge on digital marketing. Secure your spot soon!"
        primary={{ href: "/events#upcoming", label: "See Upcoming Webinars" }}
        secondary={{ href: "/audit", label: "Book a Free Marketing Meeting" }}
      />

      {/* ============ NEWSLETTER ============ */}
      <Section id="contact" className="!pt-0">
        <div className="container-x">
          <Reveal>
            <div className="glass grid items-center gap-10 !rounded-[2.5rem] p-9 sm:p-12 lg:grid-cols-2">
              <div>
                <span className="kicker">Stay in the loop</span>
                <h2 className="h-display mt-3 text-4xl">Subscribe to our newsletter</h2>
                <p className="mt-3 text-sm leading-relaxed text-mist">
                  Receive regular updates on upcoming webinars, industry trends,
                  and exclusive content for dental practice owners.
                </p>
              </div>
              <div className="relative">
                <NewsletterForm source="home-newsletter" />
                <p className="mt-3 text-xs text-mist-dark">
                  No spam, just webinar invites and growth tips. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
