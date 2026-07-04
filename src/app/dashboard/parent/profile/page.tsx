"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card } from "@/components/ui/Card";
import { CARE_TYPES, CHILD_AGE_RANGES } from "@/lib/constants";
import { Users, Check } from "lucide-react";
import { getMyParentProfile, updateParentProfile } from "@/server/actions/parent";

export default function ParentProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [suburb, setSuburb] = useState("");
  const [ages, setAges] = useState<string[]>([]);
  const [careTypes, setCareTypes] = useState<string[]>([]);
  const [preferredDays, setPreferredDays] = useState("");
  const [startDate, setStartDate] = useState("");
  const [specialistNeeds, setSpecialistNeeds] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    getMyParentProfile()
      .then((res) => {
        if (res.success && res.data) {
          setSuburb(res.data.suburb);
          setAges(res.data.childAgeRange);
          setCareTypes(res.data.careTypeNeeded);
          setPreferredDays(res.data.preferredDays);
          setStartDate(res.data.startDate);
          setSpecialistNeeds(res.data.specialistNeeds);
          setNotes(res.data.notes);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggle = (list: string[], set: (v: string[]) => void, value: string) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!suburb) return setError("Please enter your suburb.");
    if (ages.length === 0) return setError("Select at least one child age range.");
    if (careTypes.length === 0) return setError("Select at least one care type.");
    setSaving(true);
    const res = await updateParentProfile({
      suburb,
      childAgeRange: ages,
      careTypeNeeded: careTypes,
      preferredDays,
      startDate: startDate || undefined,
      specialistNeeds,
      notes,
    });
    setSaving(false);
    if (!res.success) return setError(res.error || "Something went wrong.");
    router.push("/dashboard/parent");
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground py-10 text-center">Loading your profile…</p>;
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <span className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
          <Users className="w-5 h-5" />
        </span>
        <div>
          <h1 className="font-heading text-3xl text-foreground">Edit care requirements</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Keep your family profile current so we match you with the right nannies.</p>
        </div>
      </div>

      <Card className="rounded-3xl border-border/40 p-6 sm:p-8">
        <form onSubmit={handleSave} className="space-y-6">
          <Input label="Your Suburb" value={suburb} onChange={(e) => setSuburb(e.target.value)} required placeholder="e.g. Remuera" className="rounded-2xl" />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Child age ranges <span className="text-destructive">*</span></label>
            <div className="flex flex-wrap gap-2">
              {CHILD_AGE_RANGES.map((age) => {
                const active = ages.includes(age.value);
                return (
                  <button key={age.value} type="button" onClick={() => toggle(ages, setAges, age.value)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                      active ? "bg-primary/5 border-primary text-primary" : "bg-card border-border text-muted-foreground hover:border-primary/30"
                    }`}>
                    {active && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                    {age.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Care needed <span className="text-destructive">*</span></label>
            <div className="flex flex-wrap gap-2">
              {CARE_TYPES.map((ct) => {
                const active = careTypes.includes(ct.value);
                return (
                  <button key={ct.value} type="button" onClick={() => toggle(careTypes, setCareTypes, ct.value)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                      active ? "bg-primary/5 border-primary text-primary" : "bg-card border-border text-muted-foreground hover:border-primary/30"
                    }`}>
                    {active && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                    {ct.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Preferred Days / Times" value={preferredDays} onChange={(e) => setPreferredDays(e.target.value)} placeholder="e.g. Mon–Fri, 8am–3pm" className="rounded-2xl" />
            <Input label="Preferred Start Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="rounded-2xl" />
          </div>

          <Textarea label="Specialist needs" value={specialistNeeds} onChange={(e) => setSpecialistNeeds(e.target.value)} placeholder="e.g. sensory-aware training, autism/ADHD support..." className="min-h-[90px] rounded-2xl" />
          <Textarea label="Anything else?" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Family routines, preferences..." className="min-h-[90px] rounded-2xl" />

          {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

          <div className="flex gap-3">
            <Button type="submit" variant="primary" isLoading={saving} className="rounded-full px-8">Save changes</Button>
            <Button type="button" variant="ghost" className="rounded-full" onClick={() => router.push("/dashboard/parent")}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
