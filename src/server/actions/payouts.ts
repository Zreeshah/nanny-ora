import "server-only";
import { prisma } from "@/lib/db/prisma";
import { sendPayout } from "@/lib/payments/paypal";

/**
 * Release due booking payouts to nannies. A booking is due when it's COMPLETED,
 * still HELD, past its payoutReleaseAt hold, and the nanny has a PayPal email.
 *
 * Idempotent: payoutStatus flips to RELEASED before/with the send, and the PayPal
 * sender_batch_id is derived from the booking id, so a duplicate run is rejected
 * by PayPal too. Runs from the cron route; safe to trigger manually.
 */
export async function releaseDuePayouts(limit = 50): Promise<{
  released: number;
  skipped: number;
  errors: number;
}> {
  const due = await prisma.booking.findMany({
    where: {
      status: "COMPLETED",
      payoutStatus: "HELD",
      payoutReleaseAt: { lte: new Date() },
    },
    include: { nanny: { select: { payoutPaypalEmail: true } } },
    take: limit,
  });

  let released = 0;
  let skipped = 0;
  let errors = 0;

  for (const b of due) {
    const email = b.nanny.payoutPaypalEmail;
    // No payout details → leave HELD; admin/nanny is prompted to add PayPal.
    if (!email) {
      skipped++;
      continue;
    }

    const earningsCents = b.subtotalCents - b.feeCents;
    if (earningsCents <= 0) {
      skipped++;
      continue;
    }

    try {
      // Claim the row first so a concurrent run won't also pay it.
      const claim = await prisma.booking.updateMany({
        where: { id: b.id, payoutStatus: "HELD" },
        data: { payoutStatus: "RELEASED" },
      });
      if (claim.count === 0) {
        skipped++; // someone else claimed it
        continue;
      }

      const { batchId } = await sendPayout({
        email,
        amountCents: earningsCents,
        senderItemId: `booking_${b.id}`, // idempotency key at PayPal
        note: "NannyOra booking earnings",
      });

      await prisma.booking.update({ where: { id: b.id }, data: { payoutRef: batchId } });
      released++;
    } catch (err) {
      // Roll the claim back so the next run retries.
      await prisma.booking
        .updateMany({ where: { id: b.id, payoutStatus: "RELEASED", payoutRef: null }, data: { payoutStatus: "HELD" } })
        .catch(() => {});
      console.error(`payout failed for booking ${b.id}:`, err);
      errors++;
    }
  }

  return { released, skipped, errors };
}
