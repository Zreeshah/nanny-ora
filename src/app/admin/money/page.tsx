import type { Metadata } from "next";
import Link from "next/link";
import { getMoneyOverview } from "@/server/actions/money";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, TrendingUp, Wallet, Clock, Receipt } from "lucide-react";

export const metadata: Metadata = { title: "Money — Admin" };

const nzd = (c: number) => `NZ$${(c / 100).toLocaleString("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default async function AdminMoneyPage() {
  const res = await getMoneyOverview();
  if (!res.success) {
    return <div className="p-8 text-sm text-muted-foreground">{res.error}</div>;
  }
  const d = res.data as any;

  const tiles = [
    { label: "Platform revenue", value: nzd(d.platformRevenueCents), icon: TrendingUp, sub: "memberships + tiers + booking fees", tint: "text-primary bg-primary/5" },
    { label: "Held for nannies", value: nzd(d.heldForNanniesCents), icon: Clock, sub: "earnings not yet paid out", tint: "text-amber-600 bg-amber-50" },
    { label: "Paid out to nannies", value: nzd(d.paidOutCents), icon: Wallet, sub: "released payouts", tint: "text-emerald-600 bg-emerald-50" },
    { label: "Gross processed", value: nzd(d.grossProcessedCents), icon: Receipt, sub: "all money through the platform", tint: "text-blue-600 bg-blue-50" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Back to admin
      </Link>

      <h1 className="font-heading text-3xl sm:text-4xl text-foreground mb-2">Money flow</h1>
      <p className="text-sm text-muted-foreground mb-8">Revenue, payouts, and held funds across the platform.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {tiles.map((t) => (
          <Card key={t.label} className="rounded-2xl border-border/40 p-5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${t.tint}`}>
              <t.icon className="w-4.5 h-4.5" aria-hidden="true" />
            </div>
            <p className="font-heading text-2xl text-foreground leading-none">{t.value}</p>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2">{t.label}</p>
            <p className="text-[11px] text-muted-foreground mt-1">{t.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-3xl border-border/40 p-6">
          <h2 className="font-heading text-lg font-bold text-foreground mb-4">Revenue breakdown</h2>
          <dl className="space-y-3 text-sm">
            {[
              ["Memberships", d.breakdown.membershipCents, `${d.counts.memberPayments} payments · ${d.counts.activeMembers} active`],
              ["Nanny tiers", d.breakdown.tierCents, `${d.counts.tierPayments} paid · ${d.counts.premiumNannies} premium / ${d.counts.listedNannies} listed`],
              ["Booking fees (10%)", d.breakdown.bookingFeeCents, `${d.counts.bookingPayments} bookings paid`],
            ].map(([label, cents, sub]) => (
              <div key={label as string} className="flex items-start justify-between border-b border-border/20 pb-3 last:border-0">
                <div>
                  <p className="font-medium text-foreground">{label as string}</p>
                  <p className="text-xs text-muted-foreground">{sub as string}</p>
                </div>
                <span className="font-bold text-foreground whitespace-nowrap">{nzd(cents as number)}</span>
              </div>
            ))}
          </dl>
        </Card>

        <Card className="rounded-3xl border-border/40 p-6">
          <h2 className="font-heading text-lg font-bold text-foreground mb-4">Recent payments</h2>
          {d.recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">No payments yet.</p>
          ) : (
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm min-w-[380px]">
                <tbody>
                  {d.recent.map((p: any) => (
                    <tr key={p.id} className="border-b border-border/20 last:border-0">
                      <td className="py-2 px-2 text-muted-foreground whitespace-nowrap">{formatDate(p.date)}</td>
                      <td className="py-2 px-2"><Badge variant="outline" size="sm">{p.kind}</Badge></td>
                      <td className="py-2 px-2 text-foreground truncate max-w-[120px]">{p.who}</td>
                      <td className="py-2 px-2 text-right font-semibold text-foreground whitespace-nowrap">{nzd(p.amountCents)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
