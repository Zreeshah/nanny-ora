import { NextResponse } from "next/server";
import { indexNowUrls, submitIndexNow } from "@/lib/indexnow";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * A protected manual/cron trigger for re-submitting every public static page
 * plus the currently approved nanny profiles. Vercel Cron uses CRON_SECRET;
 * the same convention is already used by the payouts cron route.
 */
export async function POST(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const urls = await indexNowUrls();
    const result = await submitIndexNow(urls);
    return NextResponse.json({ submitted: urls.length, ...result }, { status: result.ok ? 200 : 502 });
  } catch (error) {
    console.error("indexnow submission failed:", error);
    return NextResponse.json({ error: "IndexNow submission failed" }, { status: 502 });
  }
}
