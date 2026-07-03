"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Card } from "@/components/ui/Card";
import { CARE_TYPES, CHILD_AGE_RANGES } from "@/lib/constants";
import { CheckCircle, Heart, Shield, Check } from "lucide-react";
import { ImageBand } from "@/components/ui/ImageBand";

export default function RegisterFamilyPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Custom states for interactive checklist pills
  const [selectedAges, setSelectedAges] = useState<string[]>([]);
  const [selectedCareTypes, setSelectedCareTypes] = useState<string[]>([]);

  const handleToggleAge = (value: string) => {
    setSelectedAges(prev => 
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const handleToggleCareType = (value: string) => {
    setSelectedCareTypes(prev => 
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Basic client-side validation
    const newErrors: Record<string, string> = {};
    if (!data.name) newErrors.name = "Name is required";
    if (!data.email) newErrors.email = "Email is required";
    if (!data.phone) newErrors.phone = "Phone is required";
    if (!data.suburb) newErrors.suburb = "Please select a suburb";
    
    if (selectedAges.length === 0) {
      newErrors.childAges = "Select at least one child age range";
    }
    if (selectedCareTypes.length === 0) {
      newErrors.careTypes = "Select at least one type of care needed";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      
      // Auto-focus first error field
      const firstErrorKey = Object.keys(newErrors)[0];
      const element = document.getElementsByName(firstErrorKey)[0];
      if (element) {
        element.focus();
      }
      return;
    }

    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-badge-verified flex items-center justify-center mx-auto mb-6 border border-emerald-100">
          <CheckCircle className="w-8 h-8 stroke-[1.8]" />
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl text-foreground mb-4">
          Thanks for registering!
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
          Your profile has been created successfully. We&apos;ll notify you when matching Auckland nannies are available.
        </p>
        <Button variant="primary" size="lg" className="rounded-full" onClick={() => (window.location.href = "/find-a-nanny")}>
          Browse Auckland Nannies
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4 border border-accent/20">
          <Heart className="w-6 h-6 text-accent fill-accent" />
        </div>
        <h1 className="font-heading text-3xl md:text-4xl text-foreground mb-2">
          Find care for your family
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
          Tell us about your childcare requirements and let us match you with qualified local nannies.
        </p>
      </div>

      <ImageBand
        tags={["family", "find", "book", "care"]}
        seed="register-family"
        aspect="aspect-[16/6]"
        className="mb-8"
      />

      <Card className="rounded-3xl border-border/40 p-6 sm:p-8 bg-card shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Contact Details */}
          <div>
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 pb-2 border-b border-border/40">
              Your Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input name="name" label="Your Name" required error={errors.name} placeholder="e.g. Sarah" className="rounded-2xl" />
              <Input name="email" label="Email Address" type="email" required error={errors.email} placeholder="sarah@email.com" className="rounded-2xl" />
              <Input name="phone" label="Phone Number" type="tel" required error={errors.phone} placeholder="021 123 4567" className="rounded-2xl" />
              <Input name="suburb" label="Your Suburb" required placeholder="e.g. Remuera" error={errors.suburb} className="rounded-2xl" />
            </div>
          </div>

          {/* Care Requirements */}
          <div className="border-t border-border/40 pt-6">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 pb-2 border-b border-border/40">
              Care Requirements
            </h2>

            <div className="space-y-5">
              {/* Ages Selector Pills */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-2 uppercase tracking-wide">
                  Child Age Range <span className="text-destructive">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {CHILD_AGE_RANGES.map((age) => {
                    const isSelected = selectedAges.includes(age.value);
                    return (
                      <button
                        type="button"
                        key={age.value}
                        onClick={() => handleToggleAge(age.value)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all text-xs font-semibold cursor-pointer min-h-[40px] ${
                          isSelected
                            ? "bg-primary/5 border-primary text-primary font-bold shadow-sm"
                            : "bg-white border-border hover:border-primary/30 text-muted-foreground"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                        <span>{age.label}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.childAges && (
                  <p className="text-xs text-destructive mt-1.5">{errors.childAges}</p>
                )}
                {/* Hidden Inputs for Form Submit */}
                {selectedAges.map((age) => (
                  <input key={age} type="hidden" name="childAgeRange" value={age} />
                ))}
              </div>

              {/* Care Type Selector Pills */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-2 uppercase tracking-wide">
                  Type of Care Needed <span className="text-destructive">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {CARE_TYPES.map((ct) => {
                    const isSelected = selectedCareTypes.includes(ct.value);
                    return (
                      <button
                        type="button"
                        key={ct.value}
                        onClick={() => handleToggleCareType(ct.value)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all text-xs font-semibold cursor-pointer min-h-[40px] ${
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
                {errors.careTypes && (
                  <p className="text-xs text-destructive mt-1.5">{errors.careTypes}</p>
                )}
                {/* Hidden Inputs for Form Submit */}
                {selectedCareTypes.map((ct) => (
                  <input key={ct} type="hidden" name="careTypeNeeded" value={ct} />
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  name="preferredDays"
                  label="Preferred Days / Times"
                  placeholder="e.g. Mon–Fri, 8am–3pm"
                  required
                  className="rounded-2xl"
                />
                <Input
                  name="startDate"
                  label="Preferred Start Date"
                  type="date"
                  className="rounded-2xl"
                />
              </div>
            </div>
          </div>

          {/* Specialist Support Details */}
          <div className="border-t border-border/40 pt-6">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 pb-2 border-b border-border/40">
              Specialist Support
            </h2>
            <Textarea
              name="specialistNeeds"
              label="Do you require specialized care?"
              placeholder="e.g. sensory-aware training, autism/ADHD support, ECE qualified educator, registered teacher..."
              helperText="Optional — detail any specific needs so we can select appropriate nannies."
              className="min-h-[100px] rounded-2xl"
            />
          </div>

          {/* Additional details */}
          <div className="border-t border-border/40 pt-6">
            <Textarea
              name="notes"
              label="Anything else you'd like to share?"
              placeholder="Tell us about your family routines, favorite activities, or preferences..."
              className="min-h-[100px] rounded-2xl"
            />
          </div>

          <div className="pt-4">
            <Button type="submit" variant="accent" size="lg" fullWidth isLoading={isLoading} className="rounded-full shadow-md shadow-accent/10">
              Submit Registration
            </Button>
            <div className="flex items-center justify-center gap-1.5 mt-4 text-[10px] text-muted-foreground text-center">
              <Shield className="w-3.5 h-3.5 text-primary" />
              <span>Your information is kept secure and only shared with matched, approved nannies.</span>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
