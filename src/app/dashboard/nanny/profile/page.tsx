import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { ProfileForm } from "./ProfileForm";

export const metadata = {
  title: "My Profile — NannyOra Dashboard",
  description: "Edit your NannyOra carer profile and specifications.",
};

export default async function NannyProfilePage() {
  const session = await auth();
  
  if (!session?.user?.id || (session.user as any).role !== "NANNY") {
    redirect("/login");
  }

  // Fetch the nanny profile along with core user attributes
  const profile = await prisma.nannyProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      user: true,
    },
  });

  if (!profile) {
    // Fallback if user profile doesn't exist yet
    redirect("/dashboard/nanny");
  }

  // Parse stringified JSON arrays safely
  const parseJsonArray = (str: string): string[] => {
    try {
      return JSON.parse(str) || [];
    } catch {
      return [];
    }
  };

  const initialData = {
    name: profile.user.name,
    email: profile.user.email,
    phone: profile.user.phone || "",
    suburb: profile.suburb,
    areasCovered: parseJsonArray(profile.areasCovered),
    yearsExperience: profile.yearsExperience,
    careTypes: parseJsonArray(profile.careTypes),
    qualifications: profile.qualifications || "",
    eceExperience: profile.eceExperience,
    neurodiverseExperience: profile.neurodiverseExperience,
    firstAidCurrent: profile.firstAidCurrent,
    driverLicence: profile.driverLicence,
    hourlyRate: profile.hourlyRate,
    bio: profile.bio,
    availability: parseJsonArray(profile.availability),
    specialistTags: parseJsonArray(profile.specialistTags),
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground text-sm">
          Keep your professional details, credentials, and availability up to date for Auckland families.
        </p>
      </div>

      <ProfileForm initialData={initialData} />
    </div>
  );
}
