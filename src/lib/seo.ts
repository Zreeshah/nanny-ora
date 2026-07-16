// schema.org builders — the shapes Google reads for rich results.

export const SITE_URL = "https://www.nannyora.co.nz";
const LOGO = `${SITE_URL}/logo.png`;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NannyOra",
    url: SITE_URL,
    logo: LOGO,
    description:
      "NannyOra connects Auckland families with verified, specialist nannies — sensory-aware, ECE-qualified, and highly experienced.",
    areaServed: { "@type": "City", name: "Auckland", addressCountry: "NZ" },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "NannyOra",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/find-a-nanny?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

/** ChildCare LocalBusiness — helps local-pack / map relevance for Auckland. */
export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ChildCare",
    name: "NannyOra",
    url: SITE_URL,
    logo: LOGO,
    image: `${SITE_URL}/opengraph-image`,
    description: "Verified, specialist nanny care for Auckland families.",
    areaServed: { "@type": "City", name: "Auckland", addressCountry: "NZ" },
    address: { "@type": "PostalAddress", addressLocality: "Auckland", addressRegion: "Auckland", addressCountry: "NZ" },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

export function personSchema(n: {
  name: string;
  slug: string;
  bio: string;
  suburb: string;
  profileImageUrl?: string;
  avg?: number;
  reviewCount?: number;
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: n.name,
    url: `${SITE_URL}/nannies/${n.slug}`,
    jobTitle: "Nanny",
    description: n.bio.slice(0, 300),
    address: { "@type": "PostalAddress", addressLocality: n.suburb, addressRegion: "Auckland", addressCountry: "NZ" },
    worksFor: { "@type": "Organization", name: "NannyOra", url: SITE_URL },
  };
  if (n.profileImageUrl) schema.image = n.profileImageUrl;
  if (n.avg && n.reviewCount) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: n.avg,
      reviewCount: n.reviewCount,
      bestRating: 5,
    };
  }
  return schema;
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
