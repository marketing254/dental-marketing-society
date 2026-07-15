import { asset } from "./asset";
// Static fallback content. The live Google Sheet (lib/sheets.ts) overrides
// these at runtime when reachable, exactly like the original site.

export interface Panelist {
  name: string;
  /** Optional headshot (Drive thumbnail URL); shown when the team adds it. */
  image?: string;
}

export interface DmsEvent {
  day: string;
  month: string;
  dateLabel: string;
  /** Precise start datetime (ISO 8601) used by the hero countdown timer. */
  iso?: string;
  title: string;
  description: string;
  time?: string;
  panelists?: Panelist[];
  image?: string;
  /** Dynamic CE credit label from the sheet, e.g. "1 CE" / "2 CE Credits". */
  ceCredits?: string;
  /** Popup-banner image (Drive thumbnail) shown on the home page. */
  popupBanner?: string;
  registerUrl: string;
}

export interface ArchiveItem {
  slug: string;
  title: string;
  subtitle?: string;
  date: string;
  duration?: string;
  category?: string;
  vimeo?: string;
  image?: string;
  summary?: string;
  description?: string; // may be a Google Doc URL (full write-up)
  transcript?: string; // Google Doc URL
}

export interface SpeakerContact {
  label: string;
  url: string;
  platform: string; // normalized key: linkedin | instagram | facebook | website | youtube | twitter | email
}

export interface Speaker {
  name: string;
  role: string;
  photo?: string;
  bio?: string;
  topic?: string;
  linkedin?: string; // kept for the home-page preview
  contacts?: SpeakerContact[];
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  photo?: string;
}

export interface Review {
  name: string;
  firm: string;
  text: string;
  photo?: string;
  rating?: number;
  platform?: string;
  date?: string;
  context: "home" | "about" | "audit";
}

export interface Faq {
  question: string;
  answer: string;
}

export interface ResourceItem {
  category: string;
  title: string;
  description: string;
  author?: string;
  tags: string[];
  pdf?: string;
}

export const UPCOMING_EVENTS: DmsEvent[] = [
  {
    day: "11",
    month: "Jun",
    dateLabel: "Jun 11, 2026",
    iso: "2026-06-11T19:00:00-04:00",
    title: "Dental Marketing & Dental Insights",
    description:
      "In partnership with Dental Intelligence, practical marketing strategies and data-driven insights for your practice.",
    time: "7:00 to 9:30 PM ET",
    ceCredits: "2 CE Credits",
    panelists: [
      { name: "Steven Jensen" },
      { name: "Gerilyn Alfe" },
      { name: "Naren Arulrajah" },
    ],
    registerUrl: "/msm",
  },
  {
    day: "22",
    month: "Jun",
    dateLabel: "Jun 22, 2026",
    iso: "2026-06-22T19:00:00-04:00",
    title: "The Dental Workforce Reset (2026)",
    description:
      "Solving the hygiene & assistant bottleneck, without burning out your team.",
    registerUrl: "/msm",
  },
];

export const HERO_EVENT = UPCOMING_EVENTS[0];

export const ARCHIVE: ArchiveItem[] = [
  { date: "May 15, 2026", title: "Stop Revenue Leakage: From Chairside Production to Bank-Ready Profit", slug: "stop-revenue-leakage" },
  { date: "April 13, 2026", title: "From Chaos to Consistency: Building Efficient Systems That Keep Dental Practices Running Smoothly", slug: "from-chaos-to-consistency" },
  { date: "March 11, 2026", title: "Simple Ways to Stand Out and Get Found First in Your City", slug: "stand-out-get-found-first" },
  { date: "February 11, 2026", title: "Fix Your Cancellations and Attract the Right Patients", slug: "fix-your-cancellations" },
  { date: "January 14, 2026", title: "AI in Dentistry: Stay Competitive. Attract More Patients", slug: "ai-in-dentistry" },
  { date: "December 16, 2025", title: "Finish Strong, Start Stronger: Lead Your Practice into 2026 with Clarity & Confidence", slug: "finish-strong-start-stronger" },
  { date: "November 12, 2025", title: "Turn Clicks into Patients: What Your Dental Website Should Really Be Doing for You", slug: "turn-clicks-into-patients" },
  { date: "October 29, 2025", title: "Money Matters for Dentists: Cut Costs, Protect Profit, Build Wealth", slug: "money-matters-for-dentists" },
  { date: "September 29, 2025", title: "How Shifting Your Mindset Attracts More of the Right Patients", slug: "shifting-your-mindset" },
  { date: "September 10, 2025", title: "The Leadership Mindset: Turning Everyday Challenges Into Strategic Wins", slug: "the-leadership-mindset" },
  { date: "August 19, 2025", title: "Attract the Right Patients: Communication Secrets That Build Trust & Boost Case Acceptance", slug: "communication-secrets" },
  { date: "July 9, 2025", title: "Culture of Excellence: Leadership Habits That Inspire Growth", slug: "culture-of-excellence" },
];

export const SPEAKERS: Speaker[] = [
  {
    name: "Nicole Toudouze",
    role: "Founder & CEO, Transcendental",
    photo: asset("/assets/speaker-nicole.jpg"),
    bio: "Nicole is a practice-growth strategist who helps dental teams turn marketing into predictable new-patient flow. Over 15 years she has coached hundreds of owners on the systems behind sustainable growth, from front-desk conversion to community brand-building.",
    topic: "Filling the Schedule: A Repeatable New-Patient System",
    contacts: [
      { label: "LinkedIn", url: "https://www.linkedin.com/", platform: "linkedin" },
      { label: "Instagram", url: "https://www.instagram.com/", platform: "instagram" },
      { label: "Website", url: "https://productivedentist.com/", platform: "website" },
    ],
  },
  {
    name: "Lori A. Parr, MS, RDH",
    role: "Founder, Houndstooth Dental Solutions",
    photo: asset("/assets/speaker-lori.jpg"),
    bio: "Lori blends clinical experience as a registered dental hygienist with operations consulting to help practices run smoother and more profitably. She is known for practical, team-first systems that reduce burnout while lifting production.",
    topic: "From Chaos to Consistency: Systems That Run Your Practice",
    contacts: [
      { label: "LinkedIn", url: "https://www.linkedin.com/", platform: "linkedin" },
      { label: "Facebook", url: "https://www.facebook.com/", platform: "facebook" },
      { label: "Website", url: "https://productivedentist.com/", platform: "website" },
    ],
  },
  {
    name: "Dr. Michael J. Goldberg",
    role: "Founder & CEO, Associate Professor",
    photo: asset("/assets/speaker-michael.jpg"),
    bio: "Dr. Goldberg bridges academic dentistry and real-world practice ownership, teaching the leadership and case-acceptance skills that grow thriving offices. His sessions translate research into everyday actions teams can apply immediately.",
    topic: "Treatment Acceptance: Communicate So Patients Say Yes",
    contacts: [
      { label: "LinkedIn", url: "https://www.linkedin.com/", platform: "linkedin" },
      { label: "Website", url: "https://productivedentist.com/", platform: "website" },
    ],
  },
  {
    name: "Dr. Vaheed Shahnam",
    role: "Founder, Praexis Advisory",
    photo: asset("/assets/speaker-vaheed.jpg"),
    bio: "Dr. Shahnam advises practice owners on finance, profitability, and long-term wealth-building. He helps dentists understand their numbers and make confident decisions that protect margin and fund growth.",
    topic: "Money Matters: Protect Profit and Build Wealth",
    contacts: [
      { label: "LinkedIn", url: "https://www.linkedin.com/", platform: "linkedin" },
      { label: "Instagram", url: "https://www.instagram.com/", platform: "instagram" },
      { label: "Facebook", url: "https://www.facebook.com/", platform: "facebook" },
      { label: "Website", url: "https://productivedentist.com/", platform: "website" },
    ],
  },
];

export const TEAM: TeamMember[] = [
  {
    name: "Lester",
    role: "Assistant Marketing Manager",
    photo: asset("/assets/team-lester-hs.jpg"),
    bio: "Lester drives growth at DMS through strategic partnerships and event management. With a people-first approach, he helps dental practice owners build leadership confidence and connect with the practical resources they need to grow.",
  },
  {
    name: "Hameesha",
    role: "Content & Community Lead",
    photo: asset("/assets/team-hameesha.jpg"),
    bio: "Hameesha is the Content & Community Lead at Dental Marketing Society, the brains behind the platform. From event planning and content planning to community initiatives, she shapes how DMS connects with dental professionals. With a sharp eye for storytelling, she knows the best content doesn't just inform, it builds trust. Driven by a passion for dental and marketing, Hameesha makes complex dental topics accessible, relevant, and worth reading.",
  },
  {
    name: "Don Adeesha Achalanka",
    role: "Host & Moderator",
    photo: asset("/assets/team-adeesha.jpg"),
    bio: "Adeesha hosts and moderates our webinars and live conversations across platforms. Drawing on his broadcasting experience, he helps speakers share their expertise in a credible, engaging way that keeps our dental audience informed and builds their trust.",
  },
];

export const REVIEWS: Review[] = [
  {
    context: "home",
    name: "[Dentist Name]",
    firm: "[Practice Name]",
    photo: asset("/assets/review-1.jpg"),
    text: "Informative and practical, I walked away with marketing ideas I could put to work in my practice the very next week.",
  },
  {
    context: "home",
    name: "[Dentist Name]",
    firm: "[Practice Name]",
    photo: asset("/assets/review-2.jpg"),
    text: "The content was clear, actionable, and genuinely useful for a practice owner. Easily the best free webinar I've attended.",
  },
  {
    context: "home",
    name: "[Dentist Name]",
    firm: "[Practice Name]",
    photo: asset("/assets/review-3.jpg"),
    text: "Great speakers and real strategies, not fluff. The CE credits are a wonderful bonus on top of everything I learned.",
  },
  {
    context: "about",
    name: "Dr. Christopher Phelps, DMD",
    firm: "Carolinas Dental Center",
    text: "Naren has really strived to put together marketing programs that tap into the science of influence and give his clients the best opportunity for a real return on their investment.",
  },
  {
    context: "about",
    name: "Dr. Michaela McKenzie",
    firm: "Dazzling Smiles",
    text: "Naren, Ekwa Founder and CEO, has been a pivotal part of my growth and prosperity in my practice. I have learned a lot from Naren and I enjoy and value our friendship.",
  },
  {
    context: "about",
    name: "Dr. Gary Edeer",
    firm: "Aesthetic Smile Design",
    text: "Naren is a true professional who listens to our concerns, develops a plan of action specific to our needs and communicates it back to us in a timely manner.",
  },
  {
    context: "audit",
    name: "Marie-Louise Ratcliffe",
    firm: "1 review",
    text: "I just finished a marketing strategy call with Lila and this gave me so much valuable information, answers to questions that I did not know I have. This was an hour worth of knowledge and advice. I love their whole package offer as well as personalized approach to each client. Well researched, presented and communicated! Thank you, Lila!",
  },
];

export const FAQS: Faq[] = [
  {
    question: "How much does it cost to attend a webinar?",
    answer:
      "Nothing. Every Dental Marketing Society webinar is 100% free to attend, including the live session, the replay, and the CE credits you earn by attending live.",
  },
  {
    question: "How do I earn CE credits?",
    answer:
      "Attend the live session from start to finish and you qualify for 2 free continuing education credits per webinar, delivered through our PACE-accredited platform.",
  },
  {
    question: "What if I can't make it live?",
    answer:
      "Every registrant automatically receives the replay link after the session, so you never miss the content. Note that CE credits are only available for live attendance.",
  },
  {
    question: "Who are the webinars for?",
    answer:
      "Dental practice owners, dentists, office managers, and team members who want practical, proven digital marketing and practice growth strategies.",
  },
  {
    question: "What is the Complimentary Practice Audit Session?",
    answer:
      "A free 45-minute, one-on-one growth session ($900 value). Our team does 4-5 hours of research on your practice beforehand and you walk away with a custom growth roadmap that's yours to keep.",
  },
];

export const PARTNERS = [
  { name: "AADOM", logo: asset("/assets/media-aadom.jpg") },
  { name: "Dentistry Today", logo: asset("/assets/media-dentistrytoday.jpg") },
  { name: "Dentistry IQ", logo: asset("/assets/media-dentistryiq.jpg") },
  { name: "Oral Health", logo: asset("/assets/media-oralhealth.jpg") },
  { name: "Data Driven Dentistry", logo: asset("/assets/media-datadriven.jpg") },
  { name: "The Dental Geek", logo: asset("/assets/media-dentalgeek.jpg") },
];

// Static fallback for the `resources` sheet tab (shown until the live sheet loads).
export const RESOURCES: ResourceItem[] = [
  {
    category: "Guide",
    title: "From Click to Consultation: The Patient Journey Audit",
    description:
      "Map every digital touchpoint a prospective patient encounters before booking — and find the leak costing your practice consultations.",
    author: "OBA Editorial",
    tags: ["Patient Journey", "Digital Marketing", "Conversion"],
  },
  {
    category: "Template",
    title: "Premium IOL Consultation Script & Objection Guide",
    description:
      "A structured conversation framework for the in-office premium IOL discussion — including the 7 most common objections and how top surgeons respond.",
    author: "Guido Piquet, COO",
    tags: ["Premium IOL", "Sales Conversation", "Cataract"],
  },
  {
    category: "Checklist",
    title: "90-Day Marketing ROI Audit Checklist",
    description:
      "Pinpoint exactly where your marketing budget is working — and where it's leaking. Built for practice owners who don't have time to become marketers.",
    author: "Naren Arulrajah",
    tags: ["Marketing Audit", "ROI", "Google Ads"],
  },
  {
    category: "Guide + Checklist",
    title: "The Dental Practice Growth Leak Checklist",
    description:
      "A practical guide for dental practice owners to identify where growth is leaking across marketing, patient calls, team execution, and leadership — with checklists, a 7-day reset plan, and simple action steps to turn busyness into profitable growth.",
    author: "Dental Marketing Society Editorial",
    tags: ["Practice Growth", "Dental Marketing", "Team Execution", "Leadership"],
  },
  {
    category: "Guide + Checklist",
    title: "FILTER: The Better-Fit Patient Lead Guide",
    description:
      "A practical marketing guide for dental practice owners and marketers to attract higher-quality patients, build trust earlier, and reduce time spent on poor-fit inquiries. Includes a four-part lead filter, a quick marketing audit, a lead-quality scorecard, and a 7-day action plan.",
    author: "Hameesha Hassan / Dental Marketing Society Editorial",
    tags: ["Patient Lead Quality", "Dental Marketing", "Practice Growth", "Lead Qualification"],
    pdf: "https://drive.google.com/file/d/1EFyAIj-TtEODfkAKSCNmNA60OyWaClIc/view?usp=sharing",
  },
];
