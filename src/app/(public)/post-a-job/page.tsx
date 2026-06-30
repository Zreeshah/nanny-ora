"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Card } from "@/components/ui/Card";
import { AUCKLAND_SUBURBS, CARE_TYPES } from "@/lib/constants";
import { CheckCircle, Briefcase, Shield } from "lucide-react";
import { ImageBand } from "@/components/ui/ImageBand";

export default function PostAJobPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Basic client-side validation
    const newErrors: Record<string, string> = {};
    if (!data.title) newErrors.title = "Job title is required";
    if (!data.suburb) newErrors.suburb = "Please select a suburb";
    if (!data.careType) newErrors.careType = "Please select a care type";
    if (!data.daysRequired) newErrors.daysRequired = "Specify required days/times";
    if (!data.childCount) newErrors.childCount = "Required children count is needed";
    if (!data.childAges) newErrors.childAges = "Required ages of children are needed";
    if (!data.startDate) newErrors.startDate = "Specify job start date";
    if (!data.hourlyBudget) newErrors.hourlyBudget = "Specify hourly budget";
    if (!data.description) newErrors.description = "Provide a brief job description";
    if (!data.contactEmail) newErrors.contactEmail = "Provide a contact email";

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
    await new Promise((r) => setTimeout(r, 1200));
    setIsLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-badge-verified flex items-center justify-center mx-auto mb-6 border border-emerald-100">
          <CheckCircle className="w-8 h-8 stroke-[1.8]" />
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl text-foreground mb-4">Job posted!</h1>
        <p className="text-sm sm:text-base text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
          Your childcare job post is pending administrator review. Once verified, it will be published to our approved nanny network.
        </p>
        <Button variant="primary" size="lg" className="rounded-full font-semibold px-8" onClick={() => (window.location.href = "/find-a-nanny")}>
          Browse Auckland Nannies
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20">
          <Briefcase className="w-6 h-6 text-primary" />
        </div>
        <h1 className="font-heading text-3xl md:text-4xl text-foreground mb-2">Post a childcare job</h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
          Describe your family schedule and requirements to receive applications from verified Auckland nannies.
        </p>
      </div>

      <ImageBand
        tags={["find", "family", "hire", "care"]}
        seed="post-a-job"
        aspect="aspect-[16/6]"
        className="mb-8"
      />

      <Card className="rounded-3xl border-border/40 p-6 sm:p-8 bg-card shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Job Overview */}
          <div>
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 pb-2 border-b border-border/40">
              Job Overview
            </h2>
            <div className="space-y-4">
              <Input name="title" label="Job Title" required error={errors.title} placeholder="e.g. After-school nanny for two children" className="rounded-2xl" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  name="suburb"
                  label="Suburb"
                  required
                  error={errors.suburb}
                  options={AUCKLAND_SUBURBS.map((s) => ({ value: s, label: s }))}
                  placeholder="Select suburb"
                  className="rounded-2xl"
                />
                <Select
                  name="careType"
                  label="Care Type Required"
                  required
                  error={errors.careType}
                  options={CARE_TYPES.map((c) => ({ value: c.value, label: c.label }))}
                  placeholder="Select care type"
                  className="rounded-2xl"
                />
              </div>

              <Input name="daysRequired" label="Days / Hours Required" required error={errors.daysRequired} placeholder="e.g. Mon, Wed, Fri 3pm–6pm" className="rounded-2xl" />
            </div>
          </div>

          {/* Children & Budget */}
          <div className="border-t border-border/40 pt-6">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 pb-2 border-b border-border/40">
              Children & Budget
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input name="childCount" label="Number of Children" type="number" min={1} required error={errors.childCount} placeholder="e.g. 2" className="rounded-2xl" />
                <Input name="childAges" label="Children's Ages" required error={errors.childAges} placeholder="e.g. 4 and 7 years" className="rounded-2xl" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input name="startDate" label="Start Date" type="date" required error={errors.startDate} className="rounded-2xl" />
                <Input name="hourlyBudget" label="Hourly Budget (NZD)" type="number" min={20} required error={errors.hourlyBudget} placeholder="e.g. 32" className="rounded-2xl" helperText="Enter budget per hour" />
              </div>
            </div>
          </div>

          {/* Specialist Support Details */}
          <div className="border-t border-border/40 pt-6">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 pb-2 border-b border-border/40">
              Specialist Support
            </h2>
            <Textarea
              name="specialistSupport"
              label="Specialist requirements? (Optional)"
              placeholder="e.g. sensory-aware experience, autism support training, ECE background preferred..."
              helperText="Describe any specialist childcare needs for your family."
              className="min-h-[100px] rounded-2xl"
            />
          </div>

          {/* Job description */}
          <div className="border-t border-border/40 pt-6">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 pb-2 border-b border-border/40">
              Details
            </h2>
            <Textarea
              name="description"
              label="Job Description"
              required
              error={errors.description}
              placeholder="Tell nannies about the role, typical routines, food preparation requirements, and favorite activities..."
              className="min-h-[120px] rounded-2xl"
            />
          </div>

          {/* Contact Details */}
          <div className="border-t border-border/40 pt-6">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 pb-2 border-b border-border/40">
              Contact Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input name="contactEmail" label="Contact Email" type="email" required error={errors.contactEmail} placeholder="your@email.com" className="rounded-2xl" />
              <Input name="contactPhone" label="Contact Phone" type="tel" placeholder="021 123 4567" helperText="Optional — keeps private" className="rounded-2xl" />
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" variant="accent" size="lg" fullWidth isLoading={isLoading} className="rounded-full shadow-md shadow-accent/10">
              Post Childcare Job
            </Button>
            <div className="flex items-center justify-center gap-1.5 mt-4 text-[10px] text-muted-foreground text-center">
              <Shield className="w-3.5 h-3.5 text-primary" />
              <span>Jobs are reviewed by admin manually before being posted publicly.</span>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
