"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleFavourite } from "@/server/actions/engagement";
import { UpgradeModal } from "@/components/membership/UpgradeGate";

/** Heart toggle shown to logged-in families to save/unsave a nanny.
 *  Shortlisting is member-only: the server rejects free parents with
 *  upgradeRequired, and we surface the upgrade modal rather than a dead click. */
export function FavouriteButton({ nannyId, initial = false }: { nannyId: string; initial?: boolean }) {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;
  const [fav, setFav] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  // Sync when the saved-list hydrates after mount (before any user interaction).
  useEffect(() => { setFav(initial); }, [initial]);

  if (role !== "PARENT") return null; // only families save nannies

  const onClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    setBusy(true);
    const next = !fav;
    setFav(next); // optimistic
    const res = await toggleFavourite(nannyId);
    if (res.success && res.data) {
      setFav(res.data.favourited);
    } else {
      setFav(!next); // revert
      if (res.upgradeRequired) setUpgradeOpen(true);
    }
    setBusy(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        aria-label={fav ? "Remove from saved" : "Save nanny"}
        aria-pressed={fav}
        className="w-8 h-8 rounded-full flex items-center justify-center border border-border/40 bg-card hover:bg-secondary/60 transition-colors cursor-pointer"
      >
        <Heart className={cn("w-4 h-4 text-muted-foreground transition-colors", fav && "fill-rose-500 text-rose-500")} aria-hidden="true" />
      </button>
      <UpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        feature="shortlist nannies"
      />
    </>
  );
}
