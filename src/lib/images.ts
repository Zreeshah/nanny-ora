// Local photo library (in /public/images) tagged by topic, plus a deterministic
// "random but intelligent" picker: topic-matched first, seeded shuffle so each page
// gets a stable, non-repeating selection (no SSR/CSR hydration mismatch).

export type SiteImage = { src: string; alt: string; tags: string[] };

// alt = human description for a11y; tags = topic keywords used for matching.
export const SITE_IMAGES: SiteImage[] = [
  { src: "/images/hamilton-nanny-family-hero.png", alt: "Family planning nanny care at home", tags: ["hamilton", "family", "find", "care"] },
  { src: "/images/hamilton-after-school-care.png", alt: "Nanny supporting a child with an after-school activity", tags: ["hamilton", "after-school", "care", "family"] },
  // Real-care library: tags describe only visible activity, not credentials or care claims.
  { src: "/images/children-building-toys-during-home-childcare.jpeg", alt: "Children building toys together during indoor play", tags: ["real-care", "real-construction-play", "play", "care", "home", "toddler"] },
  { src: "/images/caregiver-reading-interactive-book-with-toddler.jpeg", alt: "Caregiver reading an interactive book with a toddler", tags: ["real-care", "real-interactive-reading", "reading", "care", "family", "toddler", "home"] },
  { src: "/images/caregiver-supporting-outdoor-toddler-play.jpeg", alt: "Caregiver supporting a toddler during outdoor play", tags: ["real-care", "real-outdoor-care", "outdoor", "care", "family", "toddler"] },
  { src: "/images/infant-exploring-mirror-and-play-gym.jpeg", alt: "Infant exploring a mirror beside a play gym", tags: ["real-care", "real-infant-mirror-play", "baby", "newborn", "infant", "care"] },
  { src: "/images/caregiver-and-toddler-playing-with-tunnel.jpeg", alt: "Caregiver and toddler playing with a colourful tunnel", tags: ["real-care", "real-play-at-home", "play", "care", "home", "toddler"] },
  { src: "/images/children-exploring-sensory-water-play.jpeg", alt: "Children exploring a water-play activity together", tags: ["real-care", "real-sensory-water", "sensory", "play", "care", "specialist"] },
  { src: "/images/caregiver-leading-toddler-table-activity.jpeg", alt: "Caregiver leading a hands-on table activity with toddlers", tags: ["real-care", "real-family-activity", "care", "family", "toddler", "learning"] },
  { src: "/images/caregiver-leading-group-learning-activity.jpeg", alt: "Caregiver leading a group learning activity with young children", tags: ["real-care", "real-group-activity", "care", "family", "play", "learning"] },
  { src: "/images/caregiver-reading-with-two-toddlers.jpeg", alt: "Caregiver reading with two toddlers during indoor play", tags: ["real-care", "real-shared-reading", "reading", "care", "family", "toddler"] },
  { src: "/images/caregiver-comforting-young-child.jpeg", alt: "Caregiver holding a young child at home", tags: ["real-care", "real-one-to-one-care", "care", "family", "toddler", "home"] },
  { src: "/images/caregiver-holding-sleeping-infant.jpeg", alt: "Caregiver holding a sleeping infant", tags: ["real-care", "real-infant-care", "newborn", "baby", "infant", "care"] },
  { src: "/images/child-creating-play-dough-shapes.jpeg", alt: "Child creating shapes with green play dough", tags: ["real-care", "real-tactile-play", "play", "sensory", "care"] },
  { src: "/images/caregiver-guiding-early-learning-activity.jpeg", alt: "Caregiver guiding a child through an early learning activity", tags: ["real-care", "real-early-learning", "ece", "learning", "care"] },
  { src: "/images/caregiver-with-infants-at-playtime.jpeg", alt: "Caregiver with infants during indoor playtime", tags: ["real-care", "real-infant-group-play", "newborn", "baby", "infant", "care"] },
  { src: "/images/infants-exploring-outdoor-play.jpeg", alt: "Infants exploring toys during outdoor play", tags: ["real-care", "real-outdoor-infant-play", "outdoor", "baby", "infant", "care"] },
  // Dedicated banner images (unique tag = deterministic pick).
  { src: "/images/find-a-nanny-band.jpeg", alt: "Happy child playing at an Auckland beach", tags: ["find-a-nanny-band"] },
  { src: "/images/how-it-works-band.jpeg", alt: "Babies playing happily in front of a mirror during home-based care", tags: ["how-it-works-band"] },
  { src: "/images/adhd-childcare-support.jpeg", alt: "Nanny supporting a child with ADHD during calm play", tags: ["sensory", "neurodiverse", "specialist", "care", "adhd"] },
  { src: "/images/sensory-aware-nanny.jpeg", alt: "Sensory-aware nanny engaging a child in a calm activity", tags: ["sensory", "neurodiverse", "specialist", "care"] },
  { src: "/images/ece-nanny-jobs.jpeg", alt: "Early childhood educator working with young children", tags: ["ece", "teacher", "career", "jobs", "specialist"] },
  { src: "/images/registered-teacher-nanny-auckland.jpeg", alt: "Registered teacher nanny reading with a child", tags: ["ece", "teacher", "specialist", "professional"] },
  { src: "/images/newborn-nanny-auckland.jpeg", alt: "Newborn nanny cradling a baby", tags: ["newborn", "maternity", "care", "baby"] },
  { src: "/images/babysitting-jobs-auckland.jpeg", alt: "Babysitter playing with children at home", tags: ["career", "jobs", "babysitting", "care"] },
  { src: "/images/become-a-nanny-auckland.jpeg", alt: "Aspiring nanny smiling with a child", tags: ["career", "jobs", "apply", "professional"] },
  { src: "/images/nanny-career-auckland.jpeg", alt: "Professional nanny on the job in Auckland", tags: ["career", "jobs", "apply", "professional"] },
  { src: "/images/nanny-jobs-auckland.jpeg", alt: "Nanny caring for a child during a work day", tags: ["career", "jobs"] },
  { src: "/images/private-nanny-jobs.jpeg", alt: "Private nanny with a family", tags: ["career", "jobs", "professional"] },
  { src: "/images/professional-nanny-jobs.jpeg", alt: "Professional nanny at work", tags: ["career", "jobs", "professional"] },
  { src: "/images/childcare-jobs-auckland.jpeg", alt: "Childcare professional with children", tags: ["career", "jobs", "childcare", "care"] },
  { src: "/images/find-a-nanny-auckland.jpeg", alt: "Auckland family finding the right nanny", tags: ["find", "family", "book"] },
  { src: "/images/hire-a-nanny-auckland.jpeg", alt: "Parent meeting a nanny to hire", tags: ["find", "family", "book", "hire"] },
  { src: "/images/book-trusted-nanny-auckland.jpeg", alt: "Family booking a trusted nanny", tags: ["find", "trust", "book", "family"] },
  { src: "/images/professional-childcare-provider.jpeg", alt: "Professional childcare provider with a child", tags: ["professional", "care", "find"] },
  { src: "/images/professional-nanny-auckland.jpeg", alt: "Professional Auckland nanny with a child", tags: ["professional", "find", "care"] },
  { src: "/images/professional-nanny-available-auckland.jpeg", alt: "Available professional nanny in Auckland", tags: ["professional", "find", "care"] },
  { src: "/images/trusted-childcare-provider.jpeg", alt: "Trusted childcare provider holding a child", tags: ["trust", "find", "care"] },
  { src: "/images/nanny-compliance-checks.jpeg", alt: "Nanny background checks and verification", tags: ["trust", "safety", "vetting", "compliance"] },
  { src: "/images/nanny-screening-auckland.jpeg", alt: "Nanny screening and verification process", tags: ["trust", "safety", "vetting", "screening"] },
  { src: "/images/nanny-with-first-aid-auckland.jpeg", alt: "First-aid certified nanny with a child", tags: ["trust", "safety", "first-aid", "care"] },
  { src: "/images/verified-nanny-auckland.jpeg", alt: "Verified Auckland nanny", tags: ["trust", "safety", "vetting", "verified"] },
  { src: "/images/vetted-nanny-auckland.jpeg", alt: "Vetted Auckland nanny with a child", tags: ["trust", "safety", "vetting", "vetted"] },
  { src: "/images/vetted-nanny.jpeg", alt: "Vetted nanny ready for work", tags: ["trust", "safety", "vetting"] },
  { src: "/images/nanny-agency-albany.jpeg", alt: "Nanny care in Albany, Auckland", tags: ["suburb", "albany", "agency"] },
  { src: "/images/nanny-agency-auckland.jpeg", alt: "Nanny agency serving Auckland", tags: ["suburb", "auckland", "agency"] },
  { src: "/images/nanny-agency-devonport.jpeg", alt: "Nanny care in Devonport, Auckland", tags: ["suburb", "devonport", "agency"] },
  { src: "/images/nanny-agency-grey-lynn.jpeg", alt: "Nanny care in Grey Lynn, Auckland", tags: ["suburb", "grey-lynn", "agency"] },
  { src: "/images/nanny-agency-mount-eden.jpeg", alt: "Nanny care in Mount Eden, Auckland", tags: ["suburb", "mount-eden", "epsom", "agency"] },
  { src: "/images/nanny-agency-new-zealand.jpeg", alt: "Nanny care across New Zealand", tags: ["suburb", "nz", "agency"] },
  { src: "/images/nanny-agency-north-shore.jpeg", alt: "Nanny care on Auckland's North Shore", tags: ["suburb", "north-shore", "takapuna", "agency"] },
  { src: "/images/nanny-agency-ponsonby.jpeg", alt: "Nanny care in Ponsonby, Auckland", tags: ["suburb", "ponsonby", "agency"] },
  { src: "/images/nanny-agency-west-auckland.jpeg", alt: "Nanny care in West Auckland", tags: ["suburb", "west-auckland", "agency"] },
];

// cyrb53 string hash -> 32-bit seed
function hashSeed(str: string): number {
  let h1 = 0xdeadbeef ^ str.length;
  let h2 = 0x41c6ce57 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  return (h1 >>> 0);
}

// mulberry32 PRNG — deterministic stream from a numeric seed
function rng(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Pick `count` images, topic-matched first then seeded-shuffled.
 * Same seed -> same result (stable SSR/CSR). Different page seeds -> different mixes.
 * Always returns `count` images (falls back to off-topic fillers if matches run short).
 */
export function pickImages(opts: {
  tags?: string[];
  count?: number;
  seed: string;
  exclude?: string[];
}): SiteImage[] {
  const { tags = [], count = 1, seed, exclude = [] } = opts;
  const rand = rng(hashSeed(seed));
  const wanted = new Set(tags);
  const scored = SITE_IMAGES
    .filter((img) => !exclude.includes(img.src))
    .map((img) => ({
      img,
      // A real-* tag is an explicit editorial placement, not a general subject tag.
      // It keeps page-specific images distinct while normal topic matching remains unchanged.
      score: img.tags.reduce((n, t) => n + (wanted.has(t) ? (t.startsWith("real-") ? 100 : 1) : 0), 0),
      r: rand(), // stable tiebreak/shuffle key per image
    }))
    // topic match desc, then deterministic shuffle within equal scores
    .sort((a, b) => b.score - a.score || a.r - b.r);
  return scored.slice(0, count).map((s) => s.img);
}
