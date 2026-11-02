"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Card } from "@/components/ui/Card";
import { CARE_TYPES, CHILD_AGE_RANGES } from "@/lib/constants";
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Check, Heart, LockKeyhole, Shield } from "lucide-react";
import { ImageBand } from "@/components/ui/ImageBand";
import { registerParentWithFirstJob } from "@/server/actions/parent";
import type { FamilyOnboardingInput } from "@/lib/validations";

type Step = 1 | 2 | 3;

const STEPS: { number: Step; label: string }[] = [
  { number: 1, label: "Your account" },
  { number: 2, label: "Your care brief" },
  { number: 3, label: "The role" },
];

export default function RegisterFamilyPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedAges, setSelectedAges] = useState<string[]>([]);
  const [selectedCareTypes, setSelectedCareTypes] = useState<string[]>([]);

  const toggleAge = (value: string) => {
    setSelectedAges((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  };

  const toggleCareType = (value: string) => {
    setSelectedCareTypes((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  };

  function valueFor(name: string) {
    const form = formRef.current;
    if (!form) return "";
    return String(new FormData(form).get(name) ?? "").trim();
  }

  function validate(targetStep: Step) {
    const nextErrors: Record<string, string> = {};

    if (targetStep === 1) {
      const email = valueFor("email");
      if (!valueFor("name")) nextErrors.name = "Name is required";
      if (!email || !email.includes("@")) nextErrors.email = "Enter a valid email address";
      if (valueFor("phone").length < 6) nextErrors.phone = "Phone number is required";
      const password = valueFor("password");
      if (password.length < 6) nextErrors.password = "Password must be at least 6 characters";
      else if (password !== valueFor("confirmPassword")) nextErrors.confirmPassword = "Passwords do not match";
    }

    if (targetStep === 2) {
      if (!valueFor("suburb")) nextErrors.suburb = "Please add your suburb";
      if (selectedAges.length === 0) nextErrors.childAges = "Select at least one child age range";
      if (selectedCareTypes.length === 0) nextErrors.careTypes = "Select at least one type of care";
      if (!valueFor("primaryCareType")) nextErrors.primaryCareType = "Choose the primary care type for this role";
      else if (!selectedCareTypes.includes(valueFor("primaryCareType"))) nextErrors.primaryCareType = "Choose a primary care type you selected above";
      if (!valueFor("preferredDays")) nextErrors.preferredDays = "Describe the days and hours you need";
      if (!valueFor("startDate")) nextErrors.startDate = "Choose a preferred start date";
    }

    if (targetStep === 3) {
      if (valueFor("title").length < 5) nextErrors.title = "Add a short title for the role";
      if (!valueFor("childCount") || Number(valueFor("childCount")) < 1) nextErrors.childCount = "Enter the number of children";
      if (!valueFor("childAges")) nextErrors.jobChildAges = "Describe your children's ages";
      if (!valueFor("hourlyBudget") || Number(valueFor("hourlyBudget")) < 20) nextErrors.hourlyBudget = "Enter a budget of at least NZ$20/hour";
      if (valueFor("jobDescription").length < 20) nextErrors.jobDescription = "Tell nannies a little more about the role (at least 20 characters)";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const firstField = Object.keys(nextErrors)[0];
      requestAnimationFrame(() => document.getElementsByName(firstField)[0]?.focus());
      return false;
    }
    return true;
  }

  function nextStep() {
    if (!validate(step)) return;
    setErrors({});
    setStep((current) => Math.min(current + 1, 3) as Step);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate(3)) return;

    setIsLoading(true);
    setErrors({});
    const email = valueFor("email");
    const password = valueFor("password");
    const result = await registerParentWithFirstJob({
      name: valueFor("name"),
      email,
      phone: valueFor("phone"),
      password,
      suburb: valueFor("suburb"),
      childAgeRange: selectedAges,
      careTypeNeeded: selectedCareTypes,
      primaryCareType: valueFor("primaryCareType") as FamilyOnboardingInput["primaryCareType"],
      preferredDays: valueFor("preferredDays"),
      startDate: valueFor("startDate"),
      specialistNeeds: valueFor("specialistNeeds"),
      notes: valueFor("notes"),
      title: valueFor("title"),
      childCount: Number(valueFor("childCount")),
      childAges: valueFor("childAges"),
      hourlyBudget: Number(valueFor("hourlyBudget")),
      jobDescription: valueFor("jobDescription"),
    });

    if (!result.success) {
      setErrors({ form: result.error || "We could not create your account and care brief. Please try again." });
      setIsLoading(false);
      return;
    }

    const signInResult = await signIn("credentials", { email, password, redirect: false });
    if (signInResult?.error) {
      setErrors({ form: "Your account and care brief were saved. Please sign in to see your matches." });
      setIsLoading(false);
      return;
    }
    router.push("/dashboard/parent");
  }

  const primaryCareOptions = CARE_TYPES
    .filter((careType) => selectedCareTypes.includes(careType.value))
    .map((careType) => ({ value: careType.value, label: careType.label }));

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4 border border-accent/20">
          <Heart className="w-6 h-6 text-accent fill-accent" />
        </div>
        <h1 className="font-heading text-3xl md:text-4xl text-foreground mb-2">Find care for your family</h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">Create your account and your first care brief in one guided flow. We&apos;ll use it to identify suitable available nannies.</p>
      </div>

      <ImageBand tags={["real-family-activity", "family", "find", "book", "care"]} seed="register-family" aspect="aspect-[16/6]" className="mb-8" />

      <ol className="grid grid-cols-3 gap-2 mb-6" aria-label="Registration progress">
        {STEPS.map((item) => {
          const complete = step > item.number;
          const active = step === item.number;
          return <li key={item.number} className={`rounded-2xl border px-3 py-2.5 text-center transition-colors ${active ? "bg-primary text-primary-foreground border-primary" : complete ? "bg-primary/5 text-primary border-primary/20" : "bg-card text-muted-foreground border-border/50"}`}><span className="block text-[10px] font-bold uppercase tracking-wider">Step {item.number}</span><span className="block text-xs font-semibold mt-0.5">{item.label}</span></li>;
        })}
      </ol>

      <Card className="rounded-3xl border-border/40 p-6 sm:p-8 bg-card shadow-sm">
        <form ref={formRef} onSubmit={handleSubmit} noValidate>
          <section className={step === 1 ? "space-y-6" : "hidden"} aria-hidden={step !== 1}>
            <div><span className="text-[10px] font-bold uppercase tracking-wider text-accent">Step 1 of 3</span><h2 className="font-heading text-2xl text-foreground mt-1">Create your family account</h2><p className="text-sm text-muted-foreground mt-1">Your contact details stay with NannyOra and are not published in your job.</p></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input name="name" label="Your name" required error={errors.name} placeholder="e.g. Sarah" className="rounded-2xl" />
              <Input name="email" label="Email address" type="email" required error={errors.email} placeholder="sarah@email.com" className="rounded-2xl" />
              <Input name="phone" label="Phone number" type="tel" required error={errors.phone} placeholder="021 123 4567" className="rounded-2xl" />
              <div className="hidden sm:block" aria-hidden="true" />
              <Input name="password" label="Password" type="password" required error={errors.password} placeholder="At least 6 characters" className="rounded-2xl" />
              <Input name="confirmPassword" label="Confirm password" type="password" required error={errors.confirmPassword} placeholder="Re-enter password" className="rounded-2xl" />
            </div>
          </section>

          <section className={step === 2 ? "space-y-6" : "hidden"} aria-hidden={step !== 2}>
            <div><span className="text-[10px] font-bold uppercase tracking-wider text-accent">Step 2 of 3</span><h2 className="font-heading text-2xl text-foreground mt-1">Tell us about the care you need</h2><p className="text-sm text-muted-foreground mt-1">These details create your family profile and set the basis for your first care brief.</p></div>
            <div className="space-y-5">
              <Input name="suburb" label="Your suburb" required error={errors.suburb} placeholder="e.g. Remuera" className="rounded-2xl" />
              <div><label className="block text-xs font-bold text-foreground mb-2 uppercase tracking-wide">Child age ranges <span className="text-destructive">*</span></label><div className="flex flex-wrap gap-2">{CHILD_AGE_RANGES.map((age) => { const selected = selectedAges.includes(age.value); return <button type="button" key={age.value} onClick={() => toggleAge(age.value)} className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all text-xs font-semibold cursor-pointer min-h-[40px] ${selected ? "bg-primary/5 border-primary text-primary shadow-sm" : "bg-white border-border hover:border-primary/30 text-muted-foreground"}`}>{selected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}<span>{age.label}</span></button>; })}</div>{errors.childAges && <p className="text-xs text-destructive mt-1.5">{errors.childAges}</p>}</div>
              <div><label className="block text-xs font-bold text-foreground mb-2 uppercase tracking-wide">Care needed <span className="text-destructive">*</span></label><div className="flex flex-wrap gap-2">{CARE_TYPES.map((careType) => { const selected = selectedCareTypes.includes(careType.value); return <button type="button" key={careType.value} onClick={() => toggleCareType(careType.value)} className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all text-xs font-semibold cursor-pointer min-h-[40px] ${selected ? "bg-primary/5 border-primary text-primary shadow-sm" : "bg-white border-border hover:border-primary/30 text-muted-foreground"}`}>{selected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}<span>{careType.label}</span></button>; })}</div>{errors.careTypes && <p className="text-xs text-destructive mt-1.5">{errors.careTypes}</p>}</div>
              <Select name="primaryCareType" label="Primary care type for this job" required error={errors.primaryCareType} options={primaryCareOptions} placeholder={selectedCareTypes.length ? "Select your primary care type" : "Select care needed above first"} className="rounded-2xl" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><Input name="preferredDays" label="Days / hours needed" required error={errors.preferredDays} placeholder="e.g. Mon–Fri, 8am–3pm" className="rounded-2xl" /><Input name="startDate" label="Preferred start date" type="date" required error={errors.startDate} className="rounded-2xl" /></div>
              <Textarea name="specialistNeeds" label="Specialist requirements (optional)" placeholder="e.g. sensory-aware experience, ECE background, autism/ADHD support experience…" helperText="Describe the experience that would help your family; avoid sharing medical details you would not want in a job post." className="min-h-[100px] rounded-2xl" />
            </div>
          </section>

          <section className={step === 3 ? "space-y-6" : "hidden"} aria-hidden={step !== 3}>
            <div><span className="text-[10px] font-bold uppercase tracking-wider text-accent">Step 3 of 3</span><h2 className="font-heading text-2xl text-foreground mt-1">Create your first care brief</h2><p className="text-sm text-muted-foreground mt-1">NannyOra reviews this before it is shown to matching nannies. You can manage it from your dashboard after registration.</p></div>
            <div className="space-y-5">
              <Input name="title" label="Role title" required error={errors.title} placeholder="e.g. After-school nanny for two children" className="rounded-2xl" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><Input name="childCount" label="Number of children" type="number" min={1} required error={errors.childCount} placeholder="e.g. 2" className="rounded-2xl" /><Input name="childAges" label="Children's ages" required error={errors.jobChildAges} placeholder="e.g. 4 and 7 years" className="rounded-2xl" /></div>
              <Input name="hourlyBudget" label="Hourly budget (NZD)" type="number" min={20} required error={errors.hourlyBudget} placeholder="e.g. 32" helperText="Enter the maximum hourly rate you are comfortable considering." className="rounded-2xl" />
              <Textarea name="jobDescription" label="What would the role involve?" required error={errors.jobDescription} placeholder="Tell nannies about the routines, duties, interests and what would make the arrangement work well for your family…" className="min-h-[130px] rounded-2xl" />
              <Textarea name="notes" label="Anything else you would like NannyOra to know? (optional)" placeholder="Share any context for the NannyOra team. This is not required for the public job description." className="min-h-[90px] rounded-2xl" />
            </div>
            <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4 flex gap-3"><span className="w-9 h-9 rounded-xl bg-card text-primary flex items-center justify-center shrink-0"><LockKeyhole className="w-4 h-4" aria-hidden="true" /></span><p className="text-xs text-muted-foreground leading-relaxed">Your care brief is private while under review. We can show you public match previews, while membership unlocks full profiles and direct, on-platform contact.</p></div>
          </section>

          <div className="flex flex-col-reverse sm:flex-row gap-3 mt-8 pt-6 border-t border-border/40">
            {step > 1 && <Button type="button" variant="outline" size="md" onClick={() => { setErrors({}); setStep((current) => (current - 1) as Step); }} className="rounded-full sm:min-w-32"><ArrowLeft className="w-4 h-4 mr-1.5" />Back</Button>}
            {step < 3 ? <Button type="button" variant="accent" size="md" fullWidth onClick={nextStep} className="rounded-full">Continue <ArrowRight className="w-4 h-4 ml-1.5" /></Button> : <Button type="submit" variant="accent" size="lg" fullWidth isLoading={isLoading} className="rounded-full shadow-md shadow-accent/10"><BriefcaseBusiness className="w-4 h-4 mr-2" />Create account &amp; submit care brief</Button>}
          </div>
          {errors.form && <p className="mt-4 text-sm text-destructive text-center" role="alert">{errors.form}</p>}
          <div className="flex items-center justify-center gap-1.5 mt-4 text-[10px] text-muted-foreground text-center"><Shield className="w-3.5 h-3.5 text-primary" /><span>We keep your information secure and do not publish a job until it has been reviewed.</span></div>
        </form>
      </Card>
    </div>
  );
}
