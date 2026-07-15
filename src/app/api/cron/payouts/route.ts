import { NextResponse } from "next/server";
import { releaseDuePayouts } from "@/server/actions/payouts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Releases due nanny payouts. Called by Vercel Cron (see vercel.json). Vercel sends
 * a bearer token equal to CRON_SECRET — reject anything else so it can't be poked
 * from outside to trigger money movement.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const result = await releaseDuePayouts();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("payout cron failed:", err);
    return NextResponse.json({ ok: false, error: "Payout run failed" }, { status: 500 });
  }
}
