import type { Metadata } from "next";
import Link from "next/link";
import { getParentBookings, confirmPaypalBooking } from "@/server/actions/booking";
import { BookingsClient } from "@/components/booking/BookingsClient";
import { Card } from "@/components/ui/Card";
import { ArrowLeft, CheckCircle } from "lucide-react";

export const metadata: Metadata = { title: "My Bookings" };

export default async function ParentBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; booking?: string; cancelled?: string }>;
}) {
  const sp = await searchParams;

  // PayPal returns with ?token=<orderId> — capture the payment now.
  let justPaid = false;
  if (sp.token) {
    const res = await confirmPaypalBooking(sp.token);
    justPaid = res.success;
  } else if (sp.booking) {
    // Stripe returns with ?booking=<id>; the webhook settles it.
    justPaid = true;
  }

  const res = await getParentBookings();
  const bookings = (res.data as any[]) ?? [];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <Link
        href="/dashboard/parent"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Back to dashboard
      </Link>

      <h1 className="font-heading text-3xl sm:text-4xl text-foreground mb-2">My bookings</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Your childcare bookings. Payment is held securely until each session is complete.
      </p>

      {justPaid && (
        <Card className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3 mb-6">
          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-foreground">Booking confirmed & paid 🎉</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              We&apos;ve sent your request to the nanny. You&apos;ll hear once they accept.
            </p>
          </div>
        </Card>
      )}
      {sp.cancelled && !justPaid && (
        <Card className="rounded-2xl border border-border/40 bg-secondary/20 p-4 mb-6">
          <p className="text-sm text-muted-foreground">Payment was cancelled — no booking was made.</p>
        </Card>
      )}

      <BookingsClient bookings={bookings} role="parent" />
    </div>
  );
}
