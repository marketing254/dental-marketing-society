// Central site configuration — single source of truth for contact info & links.

export const SITE = {
  name: "Dental Marketing Society",
  url: "https://www.dentalmarketingsociety.com",
  email: "team@dentalmarketingsociety.com",
  address: "303 Pinetree Way, Mississauga, Ontario L5G 2R4, Canada",
  communityUrl: "https://www.dentalmembernetwork.com/",
  schedulerUrl:
    "https://ekwasales-withoutceo-dentalmarketingsociety.youcanbook.me/?noframe=true&skipHeaderFooter=true",
  social: {
    facebook:
      "https://www.facebook.com/people/Dental-Marketing-Society/100078654861630/",
    instagram: "https://www.instagram.com/dentalmarketingsociety_dms/",
    linkedin: "https://www.linkedin.com/company/dental-marketing-society/",
    youtube: "https://www.youtube.com/@dentalmarketingsociety8864",
  },
} as const;

export type SocialKey = keyof typeof SITE.social;
