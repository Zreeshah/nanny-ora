"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { applyAsNanny } from "@/server/actions/nanny";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  AUCKLAND_SUBURBS, CARE_TYPES, SPECIALIST_TAGS,
  AVAILABILITY_OPTIONS, SAFETY_CHECKS, DOCUMENT_TYPE_LABELS,
} from "@/lib/constants";
import type { DocumentType } from "@/lib/constants";
import {
  CheckCircle, Upload, Award, Shield, Check, FileText,
  User, Briefcase, GraduationCap, Users, ShieldAlert,
  ClipboardCheck, AlertTriangle, Info, X, Plus, Trash2,
} from "lucide-react";
import { ImageBand } from "@/components/ui/ImageBand";

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

interface RefereeEntry {
  name: string;
  phone: string;
  email: string;
  relationship: string;
}

export default function ApplyAsNannyPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Stateful tracking for tag pills
  const [selectedSuburbs, setSelectedSuburbs] = useState<string[]>([]);
  const [selectedCareTypes, setSelectedCareTypes] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [selectedSpecialistTags, setSelectedSpecialistTags] = useState<string[]>([]);

  // Toggles for checkboxes
  const [eceExp, setEceExp] = useState(false);
  const [neuroExp, setNeuroExp] = useState(false);
  const [firstAid, setFirstAid] = useState(false);
  const [licence, setLicence] = useState(false);

  // Safety check documents
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File | null>>({});

  // Police vetting authorization (Children's Act 2014)
  const [policeVetAuthorized, setPoliceVetAuthorized] = useState(false);

  // Referee data (check #4)
  const [referees, setReferees] = useState<RefereeEntry[]>([
    { name: "", phone: "", email: "", relationship: "" },
  ]);

  const handleToggleSuburb = (suburb: string) => {
    setSelectedSuburbs(prev =>
      prev.includes(suburb) ? prev.filter(s => s !== suburb) : [...prev, suburb]
    );
  };

  const handleToggleCareType = (type: string) => {
    setSelectedCareTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleToggleAvailability = (option: string) => {
    setSelectedAvailability(prev =>
      prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
    );
  };

  const handleToggleSpecialistTag = (tag: string) => {
    setSelectedSpecialistTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleFileChange = (docType: string, file: File | null) => {
    setUploadedFiles(prev => ({ ...prev, [docType]: file }));
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

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // Extract input fields
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const suburb = formData.get("suburb") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const qualifications = formData.get("qualifications") as string;
    const bio = formData.get("bio") as string;
    const yearsExperience = Number(formData.get("yearsExperience"));
    const hourlyRate = Number(formData.get("hourlyRate"));
    
    // Binary flags (we read the state variables because form fields are not standard inputs in step 2)
    const eceExperience = eceExp;
    const neurodiverseExperience = neuroExp;
    const firstAidCurrent = firstAid;
    const driverLicence = licence;

    if (!name || !email || !phone || !suburb || !password) {
      toast("Please fill in all required contact details and choose a password.", "error");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast("Passwords do not match.", "error");
      setIsLoading(false);
      return;
    }

    if (selectedSuburbs.length === 0) {
      toast("Please select at least one suburb you cover.", "error");
      setIsLoading(false);
      return;
    }

    if (selectedCareTypes.length === 0) {
      toast("Please select at least one care type you provide.", "error");
      setIsLoading(false);
      return;
    }

    if (selectedAvailability.length === 0) {
      toast("Please select at least one weekly availability slot.", "error");
      setIsLoading(false);
      return;
    }

    if (!policeVetAuthorized) {
      toast("You must authorise the NZ Police vetting disclosure to submit your application.", "error");
      setIsLoading(false);
      return;
    }

    // Construct documents array — pass raw File objects to the server action,
    // which uploads them to Supabase Storage server-side using the service_role key.
    const documentsList: { documentType: string; file: File }[] = Object.entries(uploadedFiles)
      .filter(([_, file]) => !!file)
      .map(([type, file]) => ({ documentType: type, file: file! }));

    try {
      const result = await applyAsNanny({
        name,
        email,
        phone,
        suburb,
        areasCovered: selectedSuburbs,
        yearsExperience,
        careTypes: selectedCareTypes,
        qualifications,
        eceExperience,
        neurodiverseExperience,
        firstAidCurrent,
        driverLicence,
        hourlyRate,
        bio,
        availability: selectedAvailability,
        specialistTags: selectedSpecialistTags,
        refereeData: referees.filter(r => r.name.trim()),
        password,
        documents: documentsList,
        policeVetAuthorized,
      } as any);

      if (result.success) {
        setSubmitted(true);
      } else {
        toast(result.error || "Failed to submit application.", "error");
      }
    } catch (err) {
      console.error(err);
      toast("An error occurred during submission.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-badge-verified flex items-center justify-center mx-auto mb-6 border border-emerald-100">
          <CheckCircle className="w-8 h-8 stroke-[1.8]" />
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl text-foreground mb-4">Application received!</h1>
        <p className="text-sm sm:text-base text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
          Thank you for applying to NannyOra. Our administration team will review your credentials and get back to you shortly.
        </p>
        <Button variant="primary" size="lg" className="rounded-full" onClick={() => (window.location.href = "/")}>
          Back to Homepage
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Title */}
      <div className="text-center mb-10">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20">
          <Award className="w-6 h-6 text-primary" />
        </div>
        <h1 className="font-heading text-3xl md:text-4xl text-foreground mb-2">
          Apply as a nanny
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
          Join NannyOra and connect with Auckland families looking for specialist childcare.
        </p>
      </div>

      <ImageBand
        tags={["career", "jobs", "apply", "professional"]}
        seed="apply-as-nanny"
        aspect="aspect-[16/6]"
        className="mb-10"
      />

      {/* Step nodes tracker */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => s <= step && setStep(s)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer border ${
                s === step
                  ? "bg-primary border-primary text-white font-black scale-105 shadow-sm"
                  : s < step
                  ? "bg-badge-verified border-badge-verified text-white"
                  : "bg-white border-border text-muted-foreground"
              }`}
            >
              {s < step ? "✓" : s}
            </button>
            {s < totalSteps && (
              <div className={`w-8 sm:w-12 h-0.5 ${s < step ? "bg-badge-verified" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="text-center text-xs font-bold text-foreground mb-6 uppercase tracking-wider">
        {step === 1 && "Step 1: Contact & Coverage"}
        {step === 2 && "Step 2: Experience & Specialties"}
        {step === 3 && "Step 3: Safety & Vetting Checks"}
        {step === 4 && "Step 4: Biography & Final Review"}
      </div>

      <Card className="rounded-3xl border-border/40 p-6 sm:p-8 bg-card shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* STEP 1: Personal info & Suburb coverage */}
          <div className={step === 1 ? "space-y-6 animate-fade-in" : "hidden"}>
            <div>
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 pb-2 border-b border-border/40">
                Personal Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input name="name" label="Full Name" required placeholder="e.g. Sarah Mitchell" className="rounded-2xl" />
                <Input name="email" label="Email Address" type="email" required placeholder="sarah@email.com" className="rounded-2xl" />
                <Input name="phone" label="Phone Number" type="tel" required placeholder="021 123 4567" className="rounded-2xl" />
                <Select
                  name="suburb"
                  label="Home Suburb"
                  required
                  options={AUCKLAND_SUBURBS.map((s) => ({ value: s, label: s }))}
                  placeholder="Select suburb"
                  className="rounded-2xl"
                />
                <Input name="password" label="Choose Password" type="password" required placeholder="••••••••" className="rounded-2xl" />
                <Input name="confirmPassword" label="Confirm Password" type="password" required placeholder="••••••••" className="rounded-2xl" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-3 uppercase tracking-wide">
                Suburbs You Cover <span className="text-destructive">*</span>
              </label>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 bg-secondary/35 rounded-2xl border border-border/20">
                {AUCKLAND_SUBURBS.map((s) => {
                  const isSelected = selectedSuburbs.includes(s);
                  return (
                    <button
                      type="button"
                      key={s}
                      onClick={() => handleToggleSuburb(s)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border transition-all text-xs font-semibold cursor-pointer ${
                        isSelected
                          ? "bg-primary/5 border-primary text-primary font-bold shadow-sm"
                          : "bg-white border-border hover:border-primary/30 text-muted-foreground"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[2.5]" />}
                      <span>{s}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">
                Select all Auckland suburbs you are willing to travel to.
              </p>
              {/* Hidden Inputs */}
              {selectedSuburbs.map(s => (
                <input key={s} type="hidden" name="areasCovered" value={s} />
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <Button type="button" variant="primary" className="rounded-full px-6" onClick={() => setStep(2)}>
                Next: Experience Details
              </Button>
            </div>
          </div>

          {/* STEP 2: Experience & Specialties */}
          <div className={step === 2 ? "space-y-6 animate-fade-in" : "hidden"}>
            <div>
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 pb-2 border-b border-border/40">
                Experience & Skills
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  name="yearsExperience"
                  label="Years of Childcare Experience"
                  type="number"
                  min={0}
                  required
                  placeholder="e.g. 5"
                  className="rounded-2xl"
                />
                <Input
                  name="hourlyRate"
                  label="Hourly Rate (NZD)"
                  type="number"
                  min={20}
                  max={150}
                  required
                  placeholder="e.g. 35"
                  helperText="$20–$150 per hour"
                  className="rounded-2xl"
                />
              </div>
            </div>

            {/* Care Types Selection */}
            <div>
              <label className="block text-xs font-bold text-foreground mb-2.5 uppercase tracking-wide">
                Care Types You Provide <span className="text-destructive">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {CARE_TYPES.map((ct) => {
                  const isSelected = selectedCareTypes.includes(ct.value);
                  return (
                    <button
                      type="button"
                      key={ct.value}
                      onClick={() => handleToggleCareType(ct.value)}
                      className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-full border transition-all text-xs font-semibold cursor-pointer min-h-[40px] ${
                        isSelected
                          ? "bg-primary/5 border-primary text-primary font-bold shadow-sm"
                          : "bg-white border-border hover:border-primary/30 text-muted-foreground"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                      <span>{ct.label}</span>
                    </button>
                  );
                })}
              </div>
              {/* Hidden Inputs */}
              {selectedCareTypes.map(ct => (
                <input key={ct} type="hidden" name="careTypes" value={ct} />
              ))}
            </div>

            {/* Availability */}
            <div>
              <label className="block text-xs font-bold text-foreground mb-2.5 uppercase tracking-wide">
                Weekly Availability <span className="text-destructive">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABILITY_OPTIONS.map((a) => {
                  const isSelected = selectedAvailability.includes(a.value);
                  return (
                    <button
                      type="button"
                      key={a.value}
                      onClick={() => handleToggleAvailability(a.value)}
                      className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-full border transition-all text-xs font-semibold cursor-pointer min-h-[40px] ${
                        isSelected
                          ? "bg-primary/5 border-primary text-primary font-bold shadow-sm"
                          : "bg-white border-border hover:border-primary/30 text-muted-foreground"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                      <span>{a.label}</span>
                    </button>
                  );
                })}
              </div>
              {/* Hidden Inputs */}
              {selectedAvailability.map(a => (
                <input key={a} type="hidden" name="availability" value={a} />
              ))}
            </div>

            {/* Academic qualification input */}
            <Input name="qualifications" label="Qualifications" placeholder="e.g. Diploma in ECE, First Aid Certificate" helperText="Separate multiple credentials with commas" className="rounded-2xl" />

            {/* Toggle checklist items styled as clean grid rows */}
            <div>
              <label className="block text-xs font-bold text-foreground mb-2.5 uppercase tracking-wide">
                Certifications & Background checks
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { state: eceExp, setter: setEceExp, label: "I have ECE / Teaching experience", name: "eceExperience" },
                  { state: neuroExp, setter: setNeuroExp, label: "I have neurodiverse childcare experience", name: "neurodiverseExperience" },
                  { state: firstAid, setter: setFirstAid, label: "I possess a current First Aid certificate", name: "firstAidCurrent" },
                  { state: licence, setter: setLicence, label: "I hold a full clean driver licence", name: "driverLicence" },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.name}
                    onClick={() => item.setter(!item.state)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl border text-left transition-all text-xs font-semibold cursor-pointer ${
                      item.state
                        ? "bg-primary/5 border-primary text-primary shadow-sm"
                        : "bg-white border-border hover:border-primary/30 text-muted-foreground"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                      item.state ? "bg-primary border-primary text-white" : "border-border bg-white"
                    }`}>
                      {item.state && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span>{item.label}</span>
                    <input type="hidden" name={item.name} value={item.state ? "on" : "off"} />
                  </button>
                ))}
              </div>
            </div>

            {/* Specialist tags list */}
            <div>
              <label className="block text-xs font-bold text-foreground mb-2.5 uppercase tracking-wide">Specialist Tags</label>
              <div className="flex flex-wrap gap-2">
                {SPECIALIST_TAGS.map((tag) => {
                  const isSelected = selectedSpecialistTags.includes(tag.value);
                  return (
                    <button
                      type="button"
                      key={tag.value}
                      onClick={() => handleToggleSpecialistTag(tag.value)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                        isSelected
                          ? "bg-blue-100 border-blue-300 text-badge-specialist"
                          : "bg-white border-border hover:border-blue-200 text-muted-foreground"
                      }`}
                    >
                      <span>{tag.label}</span>
                    </button>
                  );
                })}
              </div>
              {/* Hidden Inputs */}
              {selectedSpecialistTags.map(t => (
                <input key={t} type="hidden" name="specialistTags" value={t} />
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <Button type="button" variant="ghost" className="rounded-full" onClick={() => setStep(1)}>Back</Button>
              <Button type="button" variant="primary" className="rounded-full px-6" onClick={() => setStep(3)}>Next: Safety Checks</Button>
            </div>
          </div>

          {/* STEP 3: Safety & Vetting Checks */}
          <div className={step === 3 ? "space-y-6 animate-fade-in" : "hidden"}>
            <div>
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2 pb-2 border-b border-border/40 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Safety & Vetting Checks
              </h2>
              <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                NannyOra requires all carers to complete 7 safety vetting checks aligned with NZ child safety standards. 
                Upload your documents below — our admin team will verify each one.
              </p>
            </div>

            {/* Checks 1–5: Nanny-uploadable */}
            <div className="space-y-4">
              {SAFETY_CHECKS.filter(c => c.nannyUploadable).map((check) => {
                const IconComponent = CHECK_ICONS[check.key] || Shield;
                const file = check.documentType ? uploadedFiles[check.documentType] : null;

                return (
                  <div
                    key={check.key}
                    className="rounded-2xl border border-border/60 bg-secondary/10 overflow-hidden transition-all hover:border-primary/30"
                  >
                    {/* Check header */}
                    <div className="flex items-start gap-4 p-4 sm:p-5">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            Check {check.number}
                          </span>
                          <h3 className="text-sm font-bold text-foreground leading-none">{check.title}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed mt-1.5">
                          {check.description}
                        </p>
                      </div>
                    </div>

                    {/* Upload area */}
                    {check.documentType && (
                      <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                        <div className={`flex items-center justify-between p-3.5 rounded-xl border border-dashed transition-all ${
                          file
                            ? "border-badge-verified/40 bg-emerald-50/50"
                            : "border-border/60 bg-white hover:border-primary/40 hover:bg-secondary/20"
                        }`}>
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            {file ? (
                              <>
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                                  <CheckCircle className="w-4 h-4 text-badge-verified" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-bold text-foreground truncate">{file.name}</p>
                                  <p className="text-[10px] text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleFileChange(check.documentType!, null)}
                                  className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <div className="w-8 h-8 rounded-lg bg-white border border-border/40 flex items-center justify-center flex-shrink-0">
                                  <Upload className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <span className="text-xs font-semibold text-muted-foreground">
                                  {DOCUMENT_TYPE_LABELS[check.documentType as DocumentType]}
                                </span>
                              </>
                            )}
                          </div>
                          {!file && (
                            <label className="cursor-pointer flex-shrink-0">
                              <span className="text-xs font-bold text-primary bg-white px-3 py-1.5 rounded-full border border-border hover:bg-primary hover:text-white hover:border-primary transition-all">
                                Choose File
                              </span>
                              <input
                                type="file"
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleFileChange(check.documentType!, e.target.files?.[0] || null)}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Referee-specific: structured fields */}
                    {check.key === "refereeCheckStatus" && (
                      <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-4">
                        <div className="border-t border-border/30 pt-4">
                          <p className="text-xs font-bold text-foreground mb-3 uppercase tracking-wide">
                            Referee Contact Details <span className="text-destructive">*</span>
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
                                  className="rounded-xl"
                                  required
                                />
                                <Input
                                  label="Phone"
                                  value={referee.phone}
                                  onChange={(e) => handleRefereeChange(idx, "phone", e.target.value)}
                                  placeholder="021 000 0000"
                                  className="rounded-xl"
                                  required
                                />
                                <Input
                                  label="Email"
                                  type="email"
                                  value={referee.email}
                                  onChange={(e) => handleRefereeChange(idx, "email", e.target.value)}
                                  placeholder="jane@example.com"
                                  className="rounded-xl"
                                  required
                                />
                                <Input
                                  label="Relationship"
                                  value={referee.relationship}
                                  onChange={(e) => handleRefereeChange(idx, "relationship", e.target.value)}
                                  placeholder="e.g. Former Employer"
                                  className="rounded-xl"
                                  required
                                />
                              </div>
                            </div>
                          ))}
                          {referees.length < 3 && (
                            <button
                              type="button"
                              onClick={addReferee}
                              className="flex items-center gap-2 text-xs font-bold text-primary hover:text-primary-light transition-colors mt-2 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              Add another referee
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Checks 6–7: Admin-only (informational) */}
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-4 h-4 text-primary" />
                <p className="text-xs font-bold text-foreground uppercase tracking-wide">Admin-completed checks</p>
              </div>
              <p className="text-[10px] text-muted-foreground mb-4 leading-relaxed">
                The following checks are completed by the NannyOra admin team after your application is received. You do not need to upload anything for these.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SAFETY_CHECKS.filter(c => !c.nannyUploadable).map((check) => {
                  const IconComponent = CHECK_ICONS[check.key] || Shield;
                  return (
                    <div
                      key={check.key}
                      className="flex items-start gap-3 p-4 rounded-2xl bg-secondary/30 border border-border/30"
                    >
                      <div className="w-9 h-9 rounded-xl bg-muted/60 flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-4.5 h-4.5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
                            Check {check.number}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-foreground">{check.title}</h4>
                        <p className="text-[10px] text-muted-foreground leading-relaxed mt-1">
                          {check.description}
                        </p>
                        <Badge variant="outline" className="mt-2 text-[9px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5 border-border text-muted-foreground">
                          Completed by admin
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="text-[10px] text-muted-foreground mt-3 leading-relaxed">
              Supported file types: PDF, PNG, JPG. Maximum file size: 10MB per upload. All documents are encrypted and only accessible by authorised admin reviewers.
            </p>

            <div className="flex justify-between pt-4">
              <Button type="button" variant="ghost" className="rounded-full" onClick={() => setStep(2)}>Back</Button>
              <Button type="button" variant="primary" className="rounded-full px-6" onClick={() => setStep(4)}>Next: Biography</Button>
            </div>
          </div>

          {/* STEP 4: Biography & Final Review */}
          <div className={step === 4 ? "space-y-6 animate-fade-in" : "hidden"}>
            <div>
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 pb-2 border-b border-border/40">
                Carer Biography
              </h2>
              <Textarea
                name="bio"
                label="About You"
                required
                placeholder="Tell families about your childhood training, care philosophy, and activities you enjoy leading..."
                helperText="Provide at least 20 characters. This bio represents you on your public search profile."
                className="min-h-[120px] rounded-2xl"
              />
            </div>

            {/* Summary of uploaded checks */}
            <div className="border-t border-border/40 pt-6">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Vetting Summary
              </h2>
              <p className="text-xs text-muted-foreground mb-4">
                Overview of your safety check submissions. You can update documents later from your profile dashboard.
              </p>
              <div className="space-y-2">
                {SAFETY_CHECKS.map((check) => {
                  const hasFile = check.documentType ? !!uploadedFiles[check.documentType] : false;
                  const hasReferee = check.key === "refereeCheckStatus" && referees.some(r => r.name.trim() && r.phone.trim());
                  const isSubmitted = hasFile || hasReferee;
                  const isAdminOnly = !check.nannyUploadable;

                  return (
                    <div
                      key={check.key}
                      className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 border border-border/30"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] font-bold text-primary/70 w-5">{check.number}.</span>
                        <span className="text-xs font-semibold text-foreground">{check.title}</span>
                      </div>
                      {isAdminOnly ? (
                        <Badge variant="outline" className="text-[9px] rounded-full px-2 py-0.5 font-bold text-muted-foreground border-border">
                          Admin
                        </Badge>
                      ) : isSubmitted ? (
                        <div className="flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-badge-verified" />
                          <span className="text-[10px] font-bold text-badge-verified">Attached</span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-semibold text-muted-foreground">Not uploaded</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Police Vetting Authorization Agreement */}
            <div className="border-t border-border/40 pt-6">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-primary" />
                Police Vetting Authorization
              </h2>
              <div className={`rounded-2xl border p-4 transition-all ${
                policeVetAuthorized
                  ? "border-primary bg-primary/[0.02]"
                  : "border-border bg-secondary/20"
              }`}>
                <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
                  I authorise disclosure by New Zealand Police of any information held about me to NannyOra for the purpose of a safety check under the Children's Act 2014. I understand that while the Criminal Records (Clean Slate) Act 2004 allows certain convictions to be concealed in standard contexts, section 19(1)(ba) of that Act provides an exception for individuals working with children or vulnerable communities. Consequently, all relevant criminal history and police information will be disclosed.
                </p>
                <button
                  type="button"
                  onClick={() => setPoliceVetAuthorized(!policeVetAuthorized)}
                  className={`flex items-start gap-3 w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    policeVetAuthorized
                      ? "border-primary bg-primary/5"
                      : "border-border bg-white hover:border-primary/30"
                  }`}
                >
                  <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    policeVetAuthorized ? "bg-primary border-primary text-white" : "border-border bg-white"
                  }`}>
                    {policeVetAuthorized && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className="text-xs font-bold text-foreground">
                    I have read and authorise the above Police vetting disclosure agreement <span className="text-destructive">*</span>
                  </span>
                </button>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button type="button" variant="ghost" className="rounded-full" onClick={() => setStep(3)}>Back</Button>
              <Button type="submit" variant="accent" size="lg" isLoading={isLoading} className="rounded-full shadow-md shadow-accent/10 px-6">
                Submit Application
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
