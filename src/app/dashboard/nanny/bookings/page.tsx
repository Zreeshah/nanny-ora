import type { Metadata } from "next";
import Link from "next/link";
import { getNannyBookings } from "@/server/actions/booking";
import { BookingsClient } from "@/components/booking/BookingsClient";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = { title: "Bookings" };

export default async function NannyBookingsPage() {
  const res = await getNannyBookings();
  const bookings = (res.data as any[]) ?? [];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <Link
        href="/dashboard/nanny"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Back to dashboard
      </Link>

      <h1 className="font-heading text-3xl sm:text-4xl text-foreground mb-2">Bookings</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Booking requests from families. Accept to confirm — the family has already paid, held
        securely until the session is complete.
      </p>

      <BookingsClient bookings={bookings} role="nanny" />
    </div>
  );
}
