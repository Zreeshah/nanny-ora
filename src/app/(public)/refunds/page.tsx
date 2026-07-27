import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell, LegalSection, LegalList } from "@/components/legal/Legal";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description:
    "How refunds and cancellations work on NannyOra — memberships, nanny tier fees, and bookings — and your rights under New Zealand consumer law.",
  alternates: { canonical: "/refunds" },
};

const UPDATED = "27 July 2026";

export default function RefundsPage() {
  return (
    <LegalShell
      title="Refund & Cancellation Policy"
      updated={UPDATED}
      intro={
        <>
          This policy explains how cancellations and refunds work across NannyOra memberships, nanny
          listing tiers, and bookings. Nothing here limits your rights under the Consumer Guarantees
          Act 1993 or the Fair Trading Act 1986.
        </>
      }
    >
      <LegalSection n={1} title="Parent memberships">
        <LegalList
          items={[
            "You can cancel your membership at any time from your dashboard. Cancellation stops the next renewal — you keep full access until the end of the period you've already paid for.",
            "Membership fees for the current period are generally non-refundable once the period has started, as access is available for the whole period.",
            "If you were charged in error or experienced a service failure, contact us and we'll put it right.",
          ]}
        />
      </LegalSection>

      <LegalSection n={2} title="Nanny listing tiers">
        <p>
          The one-off nanny tier fee has two components — a vetting/admin component and (for the
          Premium tier) a First Aid training component.
        </p>
        <LegalList
          items={[
            "Vetting/admin component: refundable if we are unable to complete your vetting or decline your application before verification, less any costs already incurred.",
            "First Aid training component (Premium): refundable up until the training is booked or delivered. Once your training place is booked or the training has been provided, that component is non-refundable, as the cost has been incurred on your behalf.",
            "If you already hold a current, acceptable First Aid certificate, contact us before purchasing the Premium tier so we can advise on the appropriate option.",
          ]}
        />
      </LegalSection>

      <LegalSection n={3} title="Bookings">
        <p>Booking payments are held by the platform until a session is completed and approved.</p>
        <LegalList
          items={[
            "If a nanny declines your booking request, you receive a full refund automatically.",
            "If a booking is cancelled before the session takes place, you receive a full refund.",
            "Once a session has been completed and approved, that booking is not refundable, as the care has been provided and the nanny is paid.",
            "If something goes wrong with a booking, contact us promptly so we can help resolve it before funds are released to the nanny.",
          ]}
        />
      </LegalSection>

      <LegalSection n={4} title="How refunds are made">
        <p>
          Refunds are made to the original payment method through the relevant payment processor
          (Stripe or PayPal). Once processed, it can take a few business days for the refund to
          appear on your statement, depending on your bank or provider.
        </p>
      </LegalSection>

      <LegalSection n={5} title="Your consumer rights">
        <p>
          As a consumer, you have guarantees under New Zealand law that cannot be excluded. If a
          service is not provided with reasonable care and skill, you may be entitled to a remedy
          under the Consumer Guarantees Act 1993. This policy applies in addition to — not instead of
          — those rights.
        </p>
      </LegalSection>

      <LegalSection n={6} title="Contact">
        <p>
          For any refund or cancellation request, contact us at{" "}
          <a href="mailto:admin@nannyora.co.nz" className="text-primary hover:underline">admin@nannyora.co.nz</a>.
          See also our{" "}
          <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
