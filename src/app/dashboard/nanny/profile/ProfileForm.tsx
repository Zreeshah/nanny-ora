"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import {
  AUCKLAND_SUBURBS,
  CARE_TYPES,
  SPECIALIST_TAGS,
  AVAILABILITY_OPTIONS,
} from "@/lib/constants";
import { updateNannyProfile } from "@/server/actions/nanny";
import { Check, Save, Loader2, Award, Info, ShieldCheck, Heart } from "lucide-react";

interface ProfileFormProps {
  initialData: {
    name: string;
    email: string;
    phone: string;
    suburb: string;
    areasCovered: string[];
    yearsExperience: number;
    careTypes: string[];
    qualifications: string;
    eceExperience: boolean;
    neurodiverseExperience: boolean;
    firstAidCurrent: boolean;
    driverLicence: boolean;
    hourlyRate: number;
    bio: string;
    availability: string[];
    specialistTags: string[];
  };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  // Core Fields
  const [name, setName] = useState(initialData.name);
  const [phone, setPhone] = useState(initialData.phone);
  const [suburb, setSuburb] = useState(initialData.suburb);
  const [yearsExperience, setYearsExperience] = useState(initialData.yearsExperience);
  const [hourlyRate, setHourlyRate] = useState(initialData.hourlyRate);
  const [qualifications, setQualifications] = useState(initialData.qualifications);
  const [bio, setBio] = useState(initialData.bio);

  // Flags
  const [eceExperience, setEceExperience] = useState(initialData.eceExperience);
  const [neurodiverseExperience, setNeurodiverseExperience] = useState(initialData.neurodiverseExperience);
  const [firstAidCurrent, setFirstAidCurrent] = useState(initialData.firstAidCurrent);
  const [driverLicence, setDriverLicence] = useState(initialData.driverLicence);

  // Arrays (Multi-Select tags/badges)
  const [areasCovered, setAreasCovered] = useState<string[]>(initialData.areasCovered);
  const [careTypes, setCareTypes] = useState<string[]>(initialData.careTypes);
  const [availability, setAvailability] = useState<string[]>(initialData.availability);
  const [specialistTags, setSpecialistTags] = useState<string[]>(initialData.specialistTags);

  const toggleItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    setList(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast("Name is required", "error");
      return;
    }
    if (bio.length < 20) {
      toast("Bio must be at least 20 characters long", "error");
      return;
    }
    if (hourlyRate < 20 || hourlyRate > 150) {
      toast("Hourly rate must be between $20 and $150/hr", "error");
      return;
    }

    startTransition(async () => {
      const result = await updateNannyProfile({
        name,
        phone,
        suburb,
        yearsExperience,
        hourlyRate,
        qualifications,
        bio,
        eceExperience,
        neurodiverseExperience,
        firstAidCurrent,
        driverLicence,
        areasCovered,
        careTypes,
        availability,
        specialistTags,
      });

      if (result.success) {
        toast("Profile updated successfully!", "success");
      } else {
        toast(result.error || "Failed to update profile", "error");
      }
    });
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* 1. Account Details */}
      <Card className="rounded-3xl border-border/40 p-6 space-y-4">
        <h2 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" />
          Personal Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Emma Thompson"
            required
            disabled={isPending}
          />
          <Input
            label="Email Address (Login)"
            value={initialData.email}
            disabled
            placeholder="e.g. emma@nannyora.co.nz"
            helperText="Login email address cannot be changed."
          />
          <Input
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 021 555 1234"
            disabled={isPending}
          />
          <Select
            label="Home Suburb"
            value={suburb}
            onChange={(e) => setSuburb(e.target.value)}
            disabled={isPending}
            placeholder="Select your home suburb"
            options={AUCKLAND_SUBURBS.map((sub) => ({ value: sub, label: sub }))}
          />
        </div>
      </Card>

      {/* 2. Professional Details */}
      <Card className="rounded-3xl border-border/40 p-6 space-y-4">
        <h2 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
          <Award className="w-5 h-5 text-accent" />
          Professional Credentials & Rates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Years of Experience"
            type="number"
            value={yearsExperience}
            onChange={(e) => setYearsExperience(Number(e.target.value))}
            min={0}
            max={50}
            required
            disabled={isPending}
          />
          <Input
            label="Hourly Rate ($ NZD)"
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(Number(e.target.value))}
            min={20}
            max={150}
            required
            disabled={isPending}
            helperText="Minimum rate is $20/hr, maximum is $150/hr."
          />
        </div>
        <Input
          label="ECE or Specialist Qualifications (Comma separated or plain text)"
          value={qualifications}
          onChange={(e) => setQualifications(e.target.value)}
          placeholder="e.g. Bachelor of Teaching (ECE), First Aid Level 2"
          disabled={isPending}
        />

        {/* Binary Flags */}
        <div className="pt-2 border-t border-border/30">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Carer Vetting Checks</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: "ece", label: "ECE Qualification/Background", val: eceExperience, set: setEceExperience },
              { id: "neuro", label: "Neurodiverse Care Experience", val: neurodiverseExperience, set: setNeurodiverseExperience },
              { id: "firstaid", label: "Current First Aid Certificate", val: firstAidCurrent, set: setFirstAidCurrent },
              { id: "licence", label: "Full NZ Driver Licence", val: driverLicence, set: setDriverLicence },
            ].map(flag => (
              <label
                key={flag.id}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  flag.val
                    ? "border-primary bg-primary/[0.02] text-foreground font-semibold"
                    : "border-border hover:bg-muted/30 text-muted-foreground"
                }`}
              >
                <span className="text-sm">{flag.label}</span>
                <input
                  type="checkbox"
                  checked={flag.val}
                  onChange={(e) => flag.set(e.target.checked)}
                  className="w-4.5 h-4.5 accent-primary rounded border-border cursor-pointer"
                  disabled={isPending}
                />
              </label>
            ))}
          </div>
        </div>
      </Card>

      {/* 3. Areas Covered & Preferences */}
      <Card className="rounded-3xl border-border/40 p-6 space-y-4">
        <h2 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
          <MapPinIcon className="w-5 h-5 text-primary" />
          Areas Covered & Availability
        </h2>

        {/* Suburbs Multi-Select */}
        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Service Areas (Select all suburbs you cover)
          </label>
          <div className="flex flex-wrap gap-1.5 p-3 bg-muted/40 rounded-2xl border border-border/50 max-h-48 overflow-y-auto">
            {AUCKLAND_SUBURBS.map((sub) => {
              const active = areasCovered.includes(sub);
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => toggleItem(areasCovered, setAreasCovered, sub)}
                  disabled={isPending}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                    active
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:border-muted-foreground"
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        </div>

        {/* Care Types Multi-Select */}
        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Care Services Offered
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CARE_TYPES.map((type) => {
              const active = careTypes.includes(type.value);
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => toggleItem(careTypes, setCareTypes, type.value)}
                  disabled={isPending}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    active
                      ? "border-primary bg-primary/[0.02] text-foreground font-semibold"
                      : "border-border hover:bg-muted/30 text-muted-foreground"
                  }`}
                >
                  <span className="text-sm">{type.label}</span>
                  {active && <Check className="w-4 h-4 text-primary stroke-[2.5]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Specialist Tags */}
        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Specialist Expertise Toggles
          </label>
          <div className="flex flex-wrap gap-2">
            {SPECIALIST_TAGS.map((tag) => {
              const active = specialistTags.includes(tag.value);
              return (
                <button
                  key={tag.value}
                  type="button"
                  onClick={() => toggleItem(specialistTags, setSpecialistTags, tag.value)}
                  disabled={isPending}
                  className={`px-3 py-2 rounded-2xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    active
                      ? "bg-accent/10 text-accent border-accent/30 font-bold"
                      : "bg-card text-muted-foreground border-border hover:border-muted-foreground"
                  }`}
                >
                  {active && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                  {tag.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Availability */}
        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Availability Schedule
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {AVAILABILITY_OPTIONS.map((opt) => {
              const active = availability.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleItem(availability, setAvailability, opt.value)}
                  disabled={isPending}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    active
                      ? "border-primary bg-primary/[0.02] text-foreground font-semibold"
                      : "border-border hover:bg-muted/30 text-muted-foreground"
                  }`}
                >
                  <span className="text-xs">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* 4. Bio Section */}
      <Card className="rounded-3xl border-border/40 p-6 space-y-4">
        <h2 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
          <Heart className="w-5 h-5 text-accent" />
          Public Profile Bio
        </h2>
        <Textarea
          label="Professional Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Introduce yourself to families. Explain your experience, special training in sensory or neurodiverse care, and what kind of environment you provide..."
          rows={6}
          required
          disabled={isPending}
          helperText="Minimum 20 characters. This bio is shown on your public listing to parents."
        />
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="rounded-full px-8 shadow-md shadow-primary/10 font-bold"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving Profile...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Profile Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

// Inline fallback MapPin icon to avoid import issues
function MapPinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
