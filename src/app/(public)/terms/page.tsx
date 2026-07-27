import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell, LegalSection, LegalList } from "@/components/legal/Legal";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms governing your use of NannyOra — memberships, bookings, nanny listings, payments, and payouts for our Auckland childcare platform.",
  alternates: { canonical: "/terms" },
};

const UPDATED = "27 July 2026";

export default function TermsPage() {
  return (
    <LegalShell
      title="Terms of Service"
      updated={UPDATED}
      intro={
        <>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of NannyOra
          (&ldquo;NannyOra&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), a platform
          operated from Auckland, New Zealand that connects families with nannies and childcare
          professionals. By creating an account or using the site, you agree to these Terms.
        </>
      }
    >
      <LegalSection n={1} title="Who we are">
        <p>
          NannyOra is operated by <strong>[Legal entity name, NZBN]</strong> (&ldquo;we&rdquo;). We
          provide an online platform that helps Auckland families discover, contact, and book
          vetted nannies. We are an intermediary — we are <strong>not</strong> the employer of any
          nanny, nor a party to the care arrangement between a family and a nanny.
        </p>
      </LegalSection>

      <LegalSection n={2} title="Eligibility & accounts">
        <p>
          You must be at least 18 years old and able to form a binding contract. You are responsible
          for the accuracy of the information in your account and for keeping your login secure.
          Families register as parent accounts; nannies apply as nanny accounts and complete our
          verification process before their profile is published.
        </p>
      </LegalSection>

      <LegalSection n={3} title="The role of NannyOra (not an employer)">
        <p>
          Nannies on NannyOra are independent of us. Any employment or contracting relationship is
          between the family and the nanny directly. Families are responsible for meeting their own
          obligations as an employer or engager, which may include employment agreements, minimum
          wage, holiday pay, and PAYE. We provide information and tools but do not provide legal,
          tax, or employment advice.
        </p>
      </LegalSection>

      <LegalSection n={4} title="Parent memberships">
        <p>
          Some features (messaging nannies, viewing full profiles and contact details, shortlisting,
          meet-and-greets, posting jobs, and making bookings) require a paid membership. Membership
          is billed in advance on a recurring basis (monthly, quarterly, or annually) through our
          payment processors. Memberships renew automatically until cancelled.
        </p>
        <LegalList
          items={[
            "You may cancel at any time; your membership remains active until the end of the paid period.",
            "Prices are in New Zealand dollars and shown at checkout.",
            "Browsing verified nanny profiles is free and does not require membership.",
          ]}
        />
      </LegalSection>

      <LegalSection n={5} title="Nanny listing tiers">
        <p>
          Nannies pay a one-off fee to be listed — a Standard (&ldquo;Listed&rdquo;) tier covering
          vetting and our induction materials, or a Premium tier which additionally includes
          childcare First Aid training, a &ldquo;Verified Premium&rdquo; badge, and priority search
          placement. There is no monthly nanny fee. Tier fees are subject to our{" "}
          <Link href="/refunds" className="text-primary hover:underline">Refund &amp; Cancellation Policy</Link>.
        </p>
      </LegalSection>

      <LegalSection n={6} title="Bookings, fees & payouts">
        <LegalList
          items={[
            "When a family books a nanny, the family pays the booking amount (hourly rate × hours) through our payment processor.",
            "NannyOra charges a platform service fee of 10%, which is deducted from the nanny's earnings.",
            "Booking funds are held by the platform until the session is completed and approved by the family.",
            "After completion and a short holding period, the nanny's earnings (booking amount less the 10% fee) are paid out to the nanny's nominated PayPal account.",
            "If a nanny declines a booking, or a booking is cancelled before it takes place, the family is refunded as set out in our Refund & Cancellation Policy.",
          ]}
        />
      </LegalSection>

      <LegalSection n={7} title="Payments">
        <p>
          Payments are processed by third-party providers (currently Stripe and PayPal). By making a
          payment you also agree to the applicable processor&rsquo;s terms. We do not store your full
          card details. Prices may include GST where applicable.
        </p>
      </LegalSection>

      <LegalSection n={8} title="Verification & your own due diligence">
        <p>
          We carry out a vetting process that may include identity checks, reference checks,
          qualification checks, and (with consent) Police vetting under the Children&rsquo;s Act
          2014. Verification badges reflect the checks completed at a point in time. While we take
          reasonable care, <strong>we do not guarantee</strong> the conduct, suitability, or safety
          of any nanny or family. Families should exercise their own judgement, meet nannies before
          engaging them, and make their own enquiries. Care of a child remains the responsibility of
          the family and the nanny.
        </p>
      </LegalSection>

      <LegalSection n={9} title="Acceptable use">
        <LegalList
          items={[
            "Provide accurate information and keep your profile up to date.",
            "Use the platform only for genuine childcare purposes.",
            "Do not harass, discriminate against, or endanger any user.",
            "Keep initial contact and bookings on the platform; do not use NannyOra to solicit users off-platform to avoid fees.",
            "Do not misuse, scrape, or attempt to gain unauthorised access to the platform.",
          ]}
        />
      </LegalSection>

      <LegalSection n={10} title="Content & intellectual property">
        <p>
          You retain ownership of content you submit (such as your bio and photos) and grant us a
          licence to display it on the platform for the purpose of providing the service. The
          NannyOra name, brand, and site content are our property and may not be copied without
          permission.
        </p>
      </LegalSection>

      <LegalSection n={11} title="Disclaimers & limitation of liability">
        <p>
          The platform is provided &ldquo;as is&rdquo;. To the maximum extent permitted by law, we
          exclude liability for the acts or omissions of families and nannies and for any loss
          arising from a care arrangement made through the platform. Nothing in these Terms limits
          your rights under the Consumer Guarantees Act 1993 or the Fair Trading Act 1986 where you
          deal with us as a consumer.
        </p>
      </LegalSection>

      <LegalSection n={12} title="Suspension & termination">
        <p>
          We may suspend or close an account that breaches these Terms or that we reasonably believe
          poses a risk to the community. You may close your account at any time; some information may
          be retained as described in our Privacy Policy or as required by law.
        </p>
      </LegalSection>

      <LegalSection n={13} title="Changes to these Terms">
        <p>
          We may update these Terms from time to time. We will update the &ldquo;last updated&rdquo;
          date above and, for material changes, take reasonable steps to notify you. Continued use of
          the platform after changes means you accept the updated Terms.
        </p>
      </LegalSection>

      <LegalSection n={14} title="Governing law & contact">
        <p>
          These Terms are governed by the laws of New Zealand, and the New Zealand courts have
          jurisdiction. Questions? Contact us at{" "}
          <a href="mailto:admin@nannyora.co.nz" className="text-primary hover:underline">admin@nannyora.co.nz</a>.
          See also our{" "}
          <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link> and{" "}
          <Link href="/refunds" className="text-primary hover:underline">Refund &amp; Cancellation Policy</Link>.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
