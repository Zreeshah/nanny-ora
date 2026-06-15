"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  AUCKLAND_SUBURBS, CARE_TYPES, SPECIALIST_TAGS,
  AVAILABILITY_OPTIONS, DOCUMENT_TYPE_LABELS,
} from "@/lib/constants";
import { CheckCircle, Upload, Award, Shield, Check } from "lucide-react";

export default function ApplyAsNannyPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = 3;

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate submission
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    setSubmitted(true);
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

      {/* Step nodes tracker */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {[1, 2, 3].map((s) => (
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
              <div className={`w-12 h-0.5 ${s < step ? "bg-badge-verified" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="text-center text-xs font-bold text-foreground mb-6 uppercase tracking-wider">
        {step === 1 && "Step 1: Contact & Coverage"}
        {step === 2 && "Step 2: Experience & Specialties"}
        {step === 3 && "Step 3: Biography & Verifications"}
      </div>

      <Card className="rounded-3xl border-border/40 p-6 sm:p-8 bg-card shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* STEP 1: Personal info & Suburb coverage */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
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
          )}

          {/* STEP 2: Experience & Specialties */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
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
                <Button type="button" variant="primary" className="rounded-full px-6" onClick={() => setStep(3)}>Next: Documents</Button>
              </div>
            </div>
          )}

          {/* STEP 3: Biography & Document uploads */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
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

              {/* Document upload panels */}
              <div className="border-t border-border/40 pt-6">
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">
                  Verification Documents
                </h2>
                <p className="text-xs text-muted-foreground mb-4">
                  Please upload current credential files. Files are encrypted, strictly accessed by authorized admin checkers, and never exposed to the public.
                </p>

                <div className="space-y-3">
                  {Object.entries(DOCUMENT_TYPE_LABELS).map(([key, label]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-4 rounded-2xl border border-dashed border-border/60 hover:border-primary/40 bg-secondary/20 transition-all hover:bg-secondary/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white border border-border/40 flex items-center justify-center text-muted-foreground">
                          <Upload className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-foreground leading-none">{label}</span>
                      </div>
                      <label className="cursor-pointer">
                        <span className="text-xs font-bold text-primary bg-white px-3 py-1.5 rounded-full border border-border hover:bg-primary hover:text-white hover:border-primary transition-all">
                          Choose File
                        </span>
                        <input type="file" name={`doc_${key}`} className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                      </label>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground mt-3 leading-relaxed">
                  Supported extensions: PDF, PNG, JPG. Maximum file size: 10MB per upload.
                </p>
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="ghost" className="rounded-full" onClick={() => setStep(2)}>Back</Button>
                <Button type="submit" variant="accent" size="lg" isLoading={isLoading} className="rounded-full shadow-md shadow-accent/10 px-6">
                  Submit Application
                </Button>
              </div>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
}
