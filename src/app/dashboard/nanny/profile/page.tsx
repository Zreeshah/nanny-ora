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

  type ProfileWithUser = Awaited<ReturnType<typeof getNannyProfile>>;
  type DatabaseUser = Awaited<ReturnType<typeof getUser>>;

  let profile: ProfileWithUser = null;
  let databaseUser: DatabaseUser = null;

  if (process.env.DATABASE_URL?.trim()) {
    try {
      profile = await getNannyProfile(session.user.id);

      if (!profile) {
        databaseUser = await getUser(session.user.id);
      }
    } catch (error) {
      // Demo accounts must remain usable when the configured database cannot
      // be reached.
      console.error("Unable to load nanny profile from the database:", error);
    }
  }

  // Fetch user details if profile row doesn't exist yet
  const user = profile?.user || databaseUser || {
    id: session.user.id,
    name: session.user.name || "Demo Nanny",
    email: session.user.email || "emma@nannyora.co.nz",
    phone: "",
    role: "NANNY",
  };

  // Parse stringified JSON arrays safely
  const parseJsonArray = (str: string | undefined | null): string[] => {
    if (!str) return [];
    try {
      return JSON.parse(str) || [];
    } catch {
      return [];
    }
  };

  const initialData = {
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    suburb: profile?.suburb || "",
    areasCovered: parseJsonArray(profile?.areasCovered),
    yearsExperience: profile?.yearsExperience || 0,
    careTypes: parseJsonArray(profile?.careTypes),
    qualifications: profile?.qualifications || "",
    eceExperience: profile?.eceExperience || false,
    neurodiverseExperience: profile?.neurodiverseExperience || false,
    firstAidCurrent: profile?.firstAidCurrent || false,
    driverLicence: profile?.driverLicence || false,
    hourlyRate: profile?.hourlyRate || 25,
    bio: profile?.bio || "",
    availability: parseJsonArray(profile?.availability),
    specialistTags: parseJsonArray(profile?.specialistTags),
    languages: parseJsonArray(profile?.languages),
    availabilitySummary: profile?.availabilitySummary || "",
    profileImageUrl: profile?.profileImageUrl || "",
    payoutPaypalEmail: profile?.payoutPaypalEmail || "",
    refereeData: parseJsonArray(profile?.refereeData),
  };

  // Safety check statuses
  const safetyChecks = {
    identityVerified: profile?.identityVerified || "NOT_STARTED",
    workHistoryVerified: profile?.workHistoryVerified || "NOT_STARTED",
    proRegVerified: profile?.proRegVerified || "NOT_STARTED",
    refereeCheckStatus: profile?.refereeCheckStatus || "NOT_STARTED",
    policeVetStatus: profile?.policeVetStatus || "NOT_STARTED",
    interviewStatus: profile?.interviewStatus || "NOT_STARTED",
    riskAssessmentStatus: profile?.riskAssessmentStatus || "NOT_STARTED",
  };

  // Documents
  const documents = (profile?.documents || []).map((doc) => ({
    id: doc.id,
    documentType: doc.documentType,
    fileName: doc.fileName,
    fileUrl: doc.fileUrl,
    reviewStatus: doc.reviewStatus,
    createdAt: doc.createdAt.toISOString(),
  }));

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground text-sm">
          Keep your professional details, credentials, and availability up to date for Auckland families.
        </p>
      </div>

      <ProfileForm
        initialData={initialData}
        safetyChecks={safetyChecks}
        documents={documents}
      />
    </div>
  );
}

function getNannyProfile(userId: string) {
  return prisma.nannyProfile.findUnique({
    where: { userId },
    include: {
      user: true,
      documents: true,
    },
  });
}

function getUser(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
  });
}
