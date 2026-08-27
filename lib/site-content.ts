export const founders = [
  "Leroy Barnett",
  "William Berry",
  "W. E. Davis",
  "Richard Pettiford",
  "Elmer Shackelford",
  "John Shavers",
  "Norman Thorne",
  "H. A. Turner",
  "C. C. Underwood",
  "Walter Williams",
  "William Woodward",
] as const;

export const pillars = [
  {
    number: "01",
    name: "Brotherhood",
    description:
      "A lifelong bond grounded in accountability, fellowship, and the shared work of building stronger communities.",
  },
  {
    number: "02",
    name: "Scholarship",
    description:
      "Academic excellence and intellectual curiosity as instruments of personal advancement and collective progress.",
  },
  {
    number: "03",
    name: "Integrity",
    description:
      "Character expressed through principled leadership, moral courage, and responsibility to one another.",
  },
  {
    number: "04",
    name: "Uplift",
    description:
      "Service that addresses historical racial injustice, expands opportunity, and advances civic engagement.",
  },
] as const;

export const chapters = [
  {
    name: "Alpha Chapter",
    letters: "Α",
    location: "Columbus, Ohio",
    institution: "The Ohio State University",
    designation: "Founding chapter",
    statement:
      "The birthplace of Pi Gamma Omicron and the living center of its archival and institutional legacy.",
  },
  {
    name: "Beta Chapter",
    letters: "Β",
    location: "Kennesaw, Georgia",
    institution: "Kennesaw State University",
    designation: "Renewal-era chapter",
    statement:
      "Extending the fraternity’s mission of scholarship, integrity, brotherhood, and community uplift.",
  },
] as const;

export const timeline = [
  {
    year: "1905",
    title: "The founding",
    description:
      "Pi Gamma Omicron’s fraternity-approved founding date is Sunday, January 1, 1905, at The Ohio State University in Columbus.",
    source: "Official fraternity record",
  },
  {
    year: "1906",
    title: "The public record",
    description:
      "Contemporary newspaper reports documented eleven Black students organizing Pi Gamma Omicron and planning an ambitious national expansion.",
    source: "Contemporary press reports",
  },
  {
    year: "1906",
    title: "A chartered purpose",
    description:
      "A surviving report described incorporation by students of Ohio State and Ohio Medical University, with a purpose centered on social, moral, and intellectual advancement.",
    source: "Publication and exact date under verification",
  },
  {
    year: "—",
    title: "The surviving record grows quiet",
    description:
      "The archive does not yet tell a complete story of what followed. The absence of surviving records is presented honestly, not filled with invention.",
    source: "Archival gap",
  },
  {
    year: "2023",
    title: "The renewal",
    description:
      "Fraternity leadership identifies October 2023 as the formal renewal of Pi Gamma Omicron and the beginning of its next institutional chapter.",
    source: "Official fraternity record",
  },
  {
    year: "2026",
    title: "The legacy moves forward",
    description:
      "A new digital home begins preserving the record, connecting brothers, and creating a public foundation for the work ahead.",
    source: "Digital relaunch",
  },
] as const;

export const expansionDestinations = [
  "Chicago",
  "Indiana",
  "Denison",
  "Fisk",
  "Tennessee",
  "Hampton",
  "Wilberforce",
  "Virginia",
] as const;

export const leadership = [
  {
    role: "President",
    name: "Zeke Lipscomb",
    initials: "ZL",
    statement:
      "Guiding national direction and institutional stewardship as Pi Gamma Omicron advances its renewal.",
  },
  {
    role: "Vice President",
    name: "Kawame Curry",
    initials: "KC",
    statement:
      "Supporting member operations, communications, and the work of building a durable national foundation.",
  },
] as const;

export const membershipPaths = [
  {
    number: "01",
    title: "Collegiate membership",
    description:
      "For students seeking a brotherhood shaped by scholarship, integrity, service, and purposeful campus leadership.",
  },
  {
    number: "02",
    title: "Alumni & graduate membership",
    description:
      "For graduates and professionals prepared to strengthen the fraternity’s renewal, mentorship, and community work.",
  },
] as const;

export const publicUpdates = [
  {
    type: "National conference",
    date: "2027 · Dates forthcoming",
    title: "Pi Gamma Omicron is heading to Charlotte.",
    description:
      "Charlotte, North Carolina will host the fraternity’s 2027 National Conference. Confirmed dates and registration information will be published when finalized.",
    href: "/news#charlotte-2027",
  },
  {
    type: "Revival update",
    date: "The work now",
    title: "A new digital home for a living legacy.",
    description:
      "The fraternity’s public archive, chapter presence, and member infrastructure are being rebuilt as part of the modern renewal.",
    href: "/news#revival",
  },
  {
    type: "Historical preservation",
    date: "Research ongoing",
    title: "The archival record continues to grow.",
    description:
      "Newspaper references and fraternity records are being reviewed carefully so verified history can be preserved without filling archival gaps with invention.",
    href: "/history#archive",
  },
] as const;
