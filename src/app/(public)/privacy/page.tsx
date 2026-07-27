import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell, LegalSection, LegalList } from "@/components/legal/Legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How NannyOra collects, uses, stores, and protects your personal information under the New Zealand Privacy Act 2020.",
  alternates: { canonical: "/privacy" },
};

const UPDATED = "27 July 2026";

export default function PrivacyPage() {
  return (
    <LegalShell
      title="Privacy Policy"
      updated={UPDATED}
      intro={
        <>
          NannyOra (&ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your privacy. This policy explains
          what personal information we collect, how we use and protect it, and your rights under the
          New Zealand Privacy Act 2020. It applies to families, nannies, and referees who use our
          platform.
        </>
      }
    >
      <LegalSection n={1} title="Information we collect">
        <LegalList
          items={[
            "Account details — name, email, phone number, password (stored only as a secure hash), and role.",
            "Family details — suburb, children's ages and care needs, and messages you send.",
            "Nanny details — profile, experience, qualifications, availability, hourly rate, suburbs covered, bio and photo, and your nominated PayPal email for payouts.",
            "Vetting information — identity documents, references and referee details, qualification/First Aid certificates, and (with your explicit consent) Police vetting results under the Children's Act 2014.",
            "Payment information — processed by our payment providers; we receive confirmation and records of transactions but do not store full card details.",
            "Usage information — profile views, saved nannies, and basic technical/log data needed to run and secure the service.",
          ]}
        />
      </LegalSection>

      <LegalSection n={2} title="How we use your information">
        <LegalList
          items={[
            "To operate the platform — create and display profiles, enable search, messaging, bookings, and payouts.",
            "To verify nannies and maintain the safety and trust of the community.",
            "To process memberships, bookings, tier fees, refunds, and nanny payouts.",
            "To send service communications (enquiry receipts, booking updates, verification updates, and notifications).",
            "To meet legal obligations and to detect and prevent fraud or misuse.",
          ]}
        />
      </LegalSection>

      <LegalSection n={3} title="Children's information">
        <p>
          Families may provide limited information about their children (such as ages and care
          needs) to help match with a suitable nanny. We treat this information as sensitive, use it
          only for matching and providing the service, and do not use it for marketing.
        </p>
      </LegalSection>

      <LegalSection n={4} title="Who we share it with">
        <p>We share personal information only as needed to provide the service:</p>
        <LegalList
          items={[
            "With other users as part of the service — e.g. a nanny sees a family's enquiry; a family sees a nanny's profile. Contact details are only shared with paid members.",
            "With referees you nominate, to complete reference checks.",
            "With trusted service providers who help us operate — including our hosting and database (Supabase, Vercel), email delivery (Resend), SMS delivery (Twilio), email routing (Cloudflare), and payment processing (Stripe, PayPal).",
            "Where required by law, or to protect the safety of a child or person.",
          ]}
        />
        <p>We do not sell your personal information.</p>
      </LegalSection>

      <LegalSection n={5} title="Storage, security & overseas hosting">
        <p>
          We protect your information with technical and organisational measures, including
          row-level database security, access controls, and encryption in transit. Passwords are
          stored only as secure hashes. Some of our service providers store data on servers located
          outside New Zealand (for example, in the United States); by using the platform you consent
          to this cross-border storage, and we take reasonable steps to ensure comparable
          protections apply.
        </p>
      </LegalSection>

      <LegalSection n={6} title="How long we keep it">
        <p>
          We keep personal information for as long as your account is active and as needed to provide
          the service, resolve disputes, and meet legal, tax, and safety obligations. When it is no
          longer required, we delete or de-identify it.
        </p>
      </LegalSection>

      <LegalSection n={7} title="Your rights">
        <p>
          Under the Privacy Act 2020 you have the right to request access to, and correction of, the
          personal information we hold about you. To make a request, or to close your account,
          contact us at{" "}
          <a href="mailto:admin@nannyora.co.nz" className="text-primary hover:underline">admin@nannyora.co.nz</a>.
        </p>
      </LegalSection>

      <LegalSection n={8} title="Cookies">
        <p>
          We use essential cookies to keep you signed in and to run the site securely. We do not use
          them to build advertising profiles.
        </p>
      </LegalSection>

      <LegalSection n={9} title="Data breaches">
        <p>
          If a privacy breach occurs that is likely to cause serious harm, we will notify affected
          individuals and the Office of the Privacy Commissioner as required by the Privacy Act 2020.
        </p>
      </LegalSection>

      <LegalSection n={10} title="Contact & complaints">
        <p>
          For any privacy question or concern, contact our Privacy Officer at{" "}
          <a href="mailto:admin@nannyora.co.nz" className="text-primary hover:underline">admin@nannyora.co.nz</a>.
          If you are not satisfied with our response, you can contact the{" "}
          <a href="https://www.privacy.org.nz" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            Office of the Privacy Commissioner
          </a>
          . See also our{" "}
          <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
