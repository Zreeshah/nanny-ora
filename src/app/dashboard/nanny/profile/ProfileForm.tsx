"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { SuburbAutocomplete } from "@/components/ui/SuburbAutocomplete";
import { AUCKLAND_SUBURBS_ALL } from "@/lib/suburbs";
import {
  CARE_TYPES,
  SPECIALIST_TAGS,
  AVAILABILITY_OPTIONS,
  LANGUAGE_TAGS,
  SAFETY_CHECKS,
  DOCUMENT_TYPE_LABELS,
  SAFETY_CHECK_STATUS_LABELS,
} from "@/lib/constants";
import type { DocumentType, SafetyCheckStatus } from "@/lib/constants";
import { updateNannyProfile, uploadNannyDocument, deleteNannyDocument, uploadProfilePhoto, setProRegApplicability } from "@/server/actions/nanny";
import {
  Check, Save, Loader2, Award, Heart, Shield,
  Upload, CheckCircle, Clock, XCircle, FileText,
  User, Briefcase, GraduationCap, Users, ShieldAlert,
  ClipboardCheck, AlertTriangle, Info, X, Plus, Trash2,
} from "lucide-react";

// Icons mapped to each safety check
const CHECK_ICONS: Record<string, React.ElementType> = {
  identityVerified: User,
  workHistoryVerified: Briefcase,
  proRegVerified: GraduationCap,
  refereeCheckStatus: Users,
  policeVetStatus: ShieldAlert,
  interviewStatus: ClipboardCheck,
  riskAssessmentStatus: AlertTriangle,
};

// Status badge styling
const STATUS_BADGE_STYLES: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
  NOT_STARTED: { bg: "bg-muted/50 border-border", text: "text-muted-foreground", icon: Clock },
  NOT_APPLICABLE: { bg: "bg-muted/50 border-border", text: "text-muted-foreground", icon: Check },
  SUBMITTED: { bg: "bg-amber-50 border-amber-200", text: "text-badge-premium", icon: Clock },
  VERIFIED: { bg: "bg-emerald-50 border-emerald-200", text: "text-badge-verified", icon: CheckCircle },
  REJECTED: { bg: "bg-red-50 border-red-200", text: "text-red-600", icon: XCircle },
};

interface DocumentData {
  id: string;
  documentType: string;
  fileName: string;
  fileUrl: string | null;
  reviewStatus: string;
  createdAt: string;
}

interface RefereeEntry {
  name: string;
  phone: string;
  email: string;
  relationship: string;
}

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
    languages: string[];
    availabilitySummary: string;
    profileImageUrl: string;
    refereeData: string[];
  };
  safetyChecks: Record<string, string>;
  documents: DocumentData[];
}

export function ProfileForm({ initialData, safetyChecks, documents: initialDocuments }: ProfileFormProps) {
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
  const [languages, setLanguages] = useState<string[]>(initialData.languages);
  const [availabilitySummary, setAvailabilitySummary] = useState(initialData.availabilitySummary);
  const [photoUrl, setPhotoUrl] = useState(initialData.profileImageUrl);
  const [photoUploading, setPhotoUploading] = useState(false);

  const handlePhotoChange = async (file: File | null) => {
    if (!file) return;
    setPhotoUploading(true);
    const res = await uploadProfilePhoto(file);
    setPhotoUploading(false);
    if (res.success && res.data?.url) {
      setPhotoUrl(res.data.url);
      toast("Profile photo updated!", "success");
    } else {
      toast(res.error || "Photo upload failed", "error");
    }
  };

  // Referee data
  const [referees, setReferees] = useState<RefereeEntry[]>(() => {
    try {
      const parsed = initialData.refereeData.length > 0
        ? (typeof initialData.refereeData === 'string' ? JSON.parse(initialData.refereeData as unknown as string) : initialData.refereeData)
        : [];
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : [{ name: "", phone: "", email: "", relationship: "" }];
    } catch {
      return [{ name: "", phone: "", email: "", relationship: "" }];
    }
  });

  // Documents
  const [documents, setDocuments] = useState<DocumentData[]>(initialDocuments);
  const [proRegStatus, setProRegStatus] = useState<string>(safetyChecks.proRegVerified || "NOT_STARTED");
  const [proRegBusy, setProRegBusy] = useState(false);

  const toggleProRegNA = async () => {
    if (proRegBusy) return;
    setProRegBusy(true);
    const next = proRegStatus !== "NOT_APPLICABLE";
    const res = await setProRegApplicability(next);
    setProRegBusy(false);
    if (res.success) setProRegStatus(res.data.status);
    else toast(res.error || "Could not update", "error");
  };
  const [uploadingType, setUploadingType] = useState<string | null>(null);

  const toggleItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    setList(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const handleRefereeChange = (index: number, field: keyof RefereeEntry, value: string) => {
    setReferees(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addReferee = () => {
    if (referees.length < 3) {
      setReferees(prev => [...prev, { name: "", phone: "", email: "", relationship: "" }]);
    }
  };

  const removeReferee = (index: number) => {
    if (referees.length > 1) {
      setReferees(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleFileUpload = async (documentType: string, file: File) => {
    setUploadingType(documentType);
    try {
      const result = await uploadNannyDocument(documentType, file);
      if (result.success) {
        // Add the new document to local state
        setDocuments(prev => [
          {
            id: result.data?.documentId || Date.now().toString(),
            documentType,
            fileName: file.name,
            fileUrl: result.data?.fileUrl || null,
            reviewStatus: "PENDING",
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);
        toast("Document uploaded successfully!", "success");
      } else {
        toast(result.error || "Failed to upload document", "error");
      }
    } catch {
      toast("Something went wrong uploading the document", "error");
    } finally {
      setUploadingType(null);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    startTransition(async () => {
      const result = await deleteNannyDocument(documentId);
      if (result.success) {
        setDocuments(prev => prev.filter(d => d.id !== documentId));
        toast("Document removed", "success");
      } else {
        toast(result.error || "Failed to remove document", "error");
      }
    });
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
        languages,
        availabilitySummary,
        refereeData: referees.filter(r => r.name.trim()) as any,
      });

      if (result.success) {
        toast("Profile updated successfully!", "success");
      } else {
        toast(result.error || "Failed to update profile", "error");
      }
    });
  };

  // Count verified checks
  const verifiedCount = Object.values(safetyChecks).filter(s => s === "VERIFIED").length;
  const totalChecks = SAFETY_CHECKS.length;

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* 1. Account Details */}
      <Card className="rounded-3xl border-border/40 p-6 space-y-4">
        <h2 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
          <ShieldCheckIcon className="w-5 h-5 text-primary" />
          Personal Details
        </h2>

        {/* Profile photo */}
        <div className="flex items-center gap-4">
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- fresh signed-ish URL with cache-bust; next/image caching fights the ?v= param
            <img src={photoUrl} alt="Profile photo" className="w-20 h-20 rounded-full object-cover ring-2 ring-primary/10" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xl">
              {name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <label className="inline-block">
              <span className={`px-4 py-2 rounded-full border border-border text-xs font-semibold cursor-pointer hover:bg-secondary/60 transition-colors ${photoUploading ? "opacity-50 pointer-events-none" : ""}`}>
                {photoUploading ? "Uploading…" : photoUrl ? "Replace photo" : "Upload photo"}
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                disabled={photoUploading}
                onChange={(e) => handlePhotoChange(e.target.files?.[0] ?? null)}
              />
            </label>
            <p className="text-[10px] text-muted-foreground mt-1.5">JPG, PNG or WebP, max 5MB. Shown on your public profile immediately.</p>
          </div>
        </div>

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
          <Input
            label="Home Suburb"
            value={suburb}
            onChange={(e) => setSuburb(e.target.value)}
            disabled={isPending}
            placeholder="Start typing…"
            list="auckland-suburbs"
          />
          <datalist id="auckland-suburbs">
            {AUCKLAND_SUBURBS_ALL.map((s) => <option key={s} value={s} />)}
          </datalist>
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

        {/* Service Areas — suburb autocomplete (free entry allowed) */}
        <SuburbAutocomplete
          label="Service Areas"
          placeholder="Start typing a suburb…"
          value={areasCovered}
          onChange={setAreasCovered}
          options={AUCKLAND_SUBURBS_ALL}
          disabled={isPending}
          helperText="Type a suburb, then tap it in the list — or press Enter — to add it as a tag. Repeat for each area you cover. Not listed? Type it and press Enter. Only tagged suburbs are saved."
        />

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

        {/* Languages */}
        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Languages
          </label>
          <div className="flex flex-wrap gap-2">
            {LANGUAGE_TAGS.map((tag) => {
              const active = languages.includes(tag.value);
              return (
                <button
                  key={tag.value}
                  type="button"
                  onClick={() => toggleItem(languages, setLanguages, tag.value)}
                  disabled={isPending}
                  className={`px-3 py-2 rounded-2xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    active
                      ? "bg-accent/10 text-accent border-accent/30 font-bold"
                      : "bg-card text-muted-foreground border-border hover:border-muted-foreground"
                  }`}
                >
                  {active && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                  {tag.short} {tag.label}
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

        <Input
          label="Availability summary"
          placeholder="e.g. Mon–Fri, 8am–3pm"
          value={availabilitySummary}
          onChange={(e) => setAvailabilitySummary(e.target.value)}
          helperText="One-line schedule shown on your public profile."
          disabled={isPending}
        />
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

      {/* 5. Safety & Vetting Checks */}
      <Card className="rounded-3xl border-border/40 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Safety & Vetting Checks
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-primary">{verifiedCount}/{totalChecks}</span>
            <div className="w-20 h-2 bg-muted/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-badge-verified rounded-full transition-all duration-500"
                style={{ width: `${(verifiedCount / totalChecks) * 100}%` }}
              />
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Upload your vetting documents below. Our admin team will review and verify each check. You can update documents at any time.
        </p>

        <div className="space-y-4">
          {SAFETY_CHECKS.map((check) => {
            const IconComponent = CHECK_ICONS[check.key] || Shield;
            const status = (check.key === "proRegVerified" ? proRegStatus : safetyChecks[check.key] || "NOT_STARTED") as SafetyCheckStatus;
            const statusStyle = STATUS_BADGE_STYLES[status] || STATUS_BADGE_STYLES.NOT_STARTED;
            const StatusIcon = statusStyle.icon;
            const checkDocuments = documents.filter(d => d.documentType === check.documentType);
            const isUploading = uploadingType === check.documentType;

            return (
              <div
                key={check.key}
                className={`rounded-2xl border overflow-hidden transition-all ${
                  status === "VERIFIED"
                    ? "border-emerald-200/60 bg-emerald-50/20"
                    : status === "REJECTED"
                    ? "border-red-200/60 bg-red-50/20"
                    : "border-border/60 bg-secondary/10"
                }`}
              >
                {/* Check header */}
                <div className="flex items-start gap-4 p-4 sm:p-5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    status === "VERIFIED"
                      ? "bg-emerald-100 border border-emerald-200"
                      : status === "REJECTED"
                      ? "bg-red-100 border border-red-200"
                      : "bg-primary/10 border border-primary/20"
                  }`}>
                    <IconComponent className={`w-5 h-5 ${
                      status === "VERIFIED" ? "text-badge-verified" : status === "REJECTED" ? "text-red-500" : "text-primary"
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          Check {check.number}
                        </span>
                        <h3 className="text-sm font-bold text-foreground leading-none">{check.title}</h3>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[9px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5 border flex items-center gap-1 flex-shrink-0 ${statusStyle.bg} ${statusStyle.text}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {SAFETY_CHECK_STATUS_LABELS[status]}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1.5">
                      {check.description}
                    </p>
                  </div>
                </div>

                {/* Professional Registration can be waived */}
                {check.key === "proRegVerified" && ["NOT_STARTED", "NOT_APPLICABLE"].includes(status) && (
                  <div className="px-4 sm:px-5 pb-3">
                    <button
                      type="button"
                      onClick={toggleProRegNA}
                      disabled={proRegBusy}
                      className={`flex items-center gap-2.5 w-full text-left p-3 rounded-xl border transition-all cursor-pointer text-xs font-semibold ${
                        status === "NOT_APPLICABLE" ? "border-primary bg-primary/5 text-primary" : "border-border bg-card hover:border-primary/30 text-muted-foreground"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                        status === "NOT_APPLICABLE" ? "bg-primary border-primary text-white" : "border-border bg-card"
                      }`}>
                        {status === "NOT_APPLICABLE" && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      Not applicable — I don&apos;t hold a professional registration
                    </button>
                  </div>
                )}

                {/* Document upload / display (checks 1-5) */}
                {check.nannyUploadable && check.documentType && !(check.key === "proRegVerified" && status === "NOT_APPLICABLE") && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-2">
                    {/* Existing documents */}
                    {checkDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className={`flex items-center justify-between p-3 rounded-xl border ${
                          doc.reviewStatus === "APPROVED"
                            ? "border-emerald-200/60 bg-emerald-50/40"
                            : doc.reviewStatus === "REJECTED"
                            ? "border-red-200/60 bg-red-50/40"
                            : "border-amber-200/60 bg-amber-50/40"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            doc.reviewStatus === "APPROVED"
                              ? "bg-emerald-100 border border-emerald-200"
                              : doc.reviewStatus === "REJECTED"
                              ? "bg-red-100 border border-red-200"
                              : "bg-amber-100 border border-amber-200"
                          }`}>
                            <FileText className={`w-4 h-4 ${
                              doc.reviewStatus === "APPROVED"
                                ? "text-badge-verified"
                                : doc.reviewStatus === "REJECTED"
                                ? "text-red-500"
                                : "text-badge-premium"
                            }`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-foreground truncate">{doc.fileName}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {doc.reviewStatus === "APPROVED" ? "✓ Approved" : doc.reviewStatus === "REJECTED" ? "✗ Rejected" : "⏳ Pending review"}
                            </p>
                          </div>
                        </div>
                        {doc.reviewStatus === "PENDING" && (
                          <button
                            type="button"
                            onClick={() => handleDeleteDocument(doc.id)}
                            disabled={isPending}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}

                    {/* Upload new document */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-dashed border-border/60 bg-white hover:border-primary/40 hover:bg-secondary/20 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white border border-border/40 flex items-center justify-center flex-shrink-0">
                          <Upload className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <span className="text-xs font-semibold text-muted-foreground">
                          {checkDocuments.length > 0 ? "Upload another document" : DOCUMENT_TYPE_LABELS[check.documentType as DocumentType]}
                        </span>
                      </div>
                      <label className="cursor-pointer flex-shrink-0">
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                          isUploading
                            ? "text-muted-foreground bg-muted border-border cursor-wait"
                            : "text-primary bg-white border-border hover:bg-primary hover:text-white hover:border-primary"
                        }`}>
                          {isUploading ? (
                            <span className="flex items-center gap-1.5">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Uploading...
                            </span>
                          ) : "Choose File"}
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          disabled={isUploading || isPending}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file && check.documentType) {
                              handleFileUpload(check.documentType, file);
                            }
                            e.target.value = "";
                          }}
                        />
                      </label>
                    </div>
                  </div>
                )}

                {/* Referee details (check #4) */}
                {check.key === "refereeCheckStatus" && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                    <div className="border-t border-border/30 pt-4">
                      <p className="text-xs font-bold text-foreground mb-3 uppercase tracking-wide flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-primary" />
                        Referee Contact Details
                      </p>
                      <p className="text-[10px] text-muted-foreground mb-4">
                        Provide at least one non-family referee. Our team will contact them directly.
                      </p>
                      {referees.map((referee, idx) => (
                        <div key={idx} className="relative bg-white rounded-xl border border-border/40 p-4 mb-3">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-primary">Referee {idx + 1}</span>
                            {referees.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeReferee(idx)}
                                disabled={isPending}
                                className="p-1 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Input
                              label="Full Name"
                              value={referee.name}
                              onChange={(e) => handleRefereeChange(idx, "name", e.target.value)}
                              placeholder="e.g. Jane Smith"
                              disabled={isPending}
                            />
                            <Input
                              label="Phone"
                              value={referee.phone}
                              onChange={(e) => handleRefereeChange(idx, "phone", e.target.value)}
                              placeholder="021 000 0000"
                              disabled={isPending}
                            />
                            <Input
                              label="Email"
                              type="email"
                              value={referee.email}
                              onChange={(e) => handleRefereeChange(idx, "email", e.target.value)}
                              placeholder="jane@example.com"
                              disabled={isPending}
                            />
                            <Input
                              label="Relationship"
                              value={referee.relationship}
                              onChange={(e) => handleRefereeChange(idx, "relationship", e.target.value)}
                              placeholder="e.g. Former Employer"
                              disabled={isPending}
                            />
                          </div>
                        </div>
                      ))}
                      {referees.length < 3 && (
                        <button
                          type="button"
                          onClick={addReferee}
                          disabled={isPending}
                          className="flex items-center gap-2 text-xs font-bold text-primary hover:text-primary-light transition-colors mt-2 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add another referee
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Admin-only checks (6-7) — informational */}
                {!check.nannyUploadable && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-secondary/30 border border-border/30">
                      <Info className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        This check is completed by the NannyOra admin team. You will be notified when it is scheduled and upon completion.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-[10px] text-muted-foreground leading-relaxed mt-2">
          Supported file types: PDF, PNG, JPG. Maximum file size: 10MB per upload. All documents are encrypted and only accessible by authorised admin reviewers.
        </p>
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

// Inline fallback icons to avoid import issues
function ShieldCheckIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

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
