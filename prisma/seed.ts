// ============================================================
// NannyOra — Database Seed Script
// Run with: npx tsx prisma/seed.ts
// ============================================================

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding NannyOra database...\n");

  // ============================================================
  // 1. Create Demo Users
  // ============================================================

  const password = await bcrypt.hash("demo1234", 10);

  // Admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@nannyora.co.nz" },
    update: {},
    create: {
      email: "admin@nannyora.co.nz",
      passwordHash: password,
      name: "NannyOra Admin",
      phone: "09 555 0100",
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin: admin@nannyora.co.nz / demo1234 (id: ${admin.id})`);

  // Nanny user — Emma Thompson (Specialist)
  const nannyUser = await prisma.user.upsert({
    where: { email: "emma@nannyora.co.nz" },
    update: {},
    create: {
      email: "emma@nannyora.co.nz",
      passwordHash: password,
      name: "Emma Thompson",
      phone: "021 555 0200",
      role: "NANNY",
    },
  });
  console.log(`✅ Nanny: emma@nannyora.co.nz / demo1234 (id: ${nannyUser.id})`);

  // Parent user
  const parentUser = await prisma.user.upsert({
    where: { email: "parent@nannyora.co.nz" },
    update: {},
    create: {
      email: "parent@nannyora.co.nz",
      passwordHash: password,
      name: "Sarah Kingston",
      phone: "021 555 0300",
      role: "PARENT",
    },
  });
  console.log(`✅ Parent: parent@nannyora.co.nz / demo1234 (id: ${parentUser.id})`);

  // ============================================================
  // 2. Create Nanny Profile for Emma
  // ============================================================

  const nannyProfile = await prisma.nannyProfile.upsert({
    where: { userId: nannyUser.id },
    update: {},
    create: {
      userId: nannyUser.id,
      suburb: "Ponsonby",
      areasCovered: JSON.stringify(["Ponsonby", "Grey Lynn", "Herne Bay", "Freemans Bay"]),
      yearsExperience: 12,
      careTypes: JSON.stringify(["recurring_nanny", "specialist_sensory"]),
      qualifications: JSON.stringify([
        "Bachelor of Teaching (ECE)",
        "Registered Teacher",
        "Sensory Processing Workshop Certificate",
      ]),
      eceExperience: true,
      neurodiverseExperience: true,
      firstAidCurrent: true,
      driverLicence: true,
      hourlyRate: 42,
      bio: "Registered teacher and experienced nanny with specialist training in sensory-aware and neurodiverse childcare. I provide calm, structured care environments where every child feels safe and supported. My background in ECE means I bring a strong understanding of child development, and I work closely with families to ensure consistency between home and care.",
      availabilitySummary: "Flexible schedule — contact for details",
      availability: JSON.stringify(["weekday_morning", "weekday_afternoon", "weekday_evening", "flexible"]),
      specialistTags: JSON.stringify(["sensory_aware", "registered_teacher", "neurodiverse", "ece_background", "first_aid"]),
      verificationLevel: "SPECIALIST",
      adminStatus: "APPROVED",
    },
  });
  console.log(`✅ Nanny profile created for Emma (id: ${nannyProfile.id})`);

  // ============================================================
  // 3. Create Parent Profile for Sarah
  // ============================================================

  const parentProfile = await prisma.parentProfile.upsert({
    where: { userId: parentUser.id },
    update: {},
    create: {
      userId: parentUser.id,
      suburb: "Remuera",
      childAgeRange: JSON.stringify(["3-5"]),
      careTypeNeeded: JSON.stringify(["recurring_nanny", "specialist_sensory"]),
      preferredDays: "Mon–Fri, 8am–3pm",
      startDate: "2025-03-01",
      specialistNeeds: "Looking for a nanny experienced with sensory processing needs.",
      notes: "Our daughter is 4 and has been diagnosed with SPD. We need someone calm and patient.",
    },
  });
  console.log(`✅ Parent profile created for Sarah (id: ${parentProfile.id})`);

  // ============================================================
  // 4. Create Sample Enquiries
  // ============================================================

  await prisma.enquiry.upsert({
    where: { id: "seed-enquiry-001" },
    update: {},
    create: {
      id: "seed-enquiry-001",
      parentId: parentUser.id,
      nannyId: nannyProfile.id,
      message: "Hi Emma, we're looking for a sensory-aware nanny for our 4-year-old daughter. Your profile looks perfect — would love to chat!",
      status: "NEW",
    },
  });
  console.log("✅ Sample enquiry created");

  // ============================================================
  // 5. Create Sample Job Posts
  // ============================================================

  await prisma.jobPost.upsert({
    where: { id: "seed-job-001" },
    update: {},
    create: {
      id: "seed-job-001",
      parentId: parentUser.id,
      title: "Sensory-aware nanny for 4-year-old in Remuera",
      suburb: "Remuera",
      careType: "specialist_sensory",
      daysRequired: "Mon–Fri, 8am–3pm",
      childCount: 1,
      childAges: "4 years",
      startDate: "2025-03-01",
      hourlyBudget: 40,
      specialistSupport: "Experience with sensory processing differences, calm and patient approach",
      description: "We're looking for a specialist nanny for our daughter who has sensory processing needs. She's bright, curious, and loves art and music. We need someone who can create a calm environment and work with her occupational therapist's recommendations.",
      status: "APPROVED",
      contactEmail: "parent@nannyora.co.nz",
      contactPhone: "021 555 0300",
    },
  });

  await prisma.jobPost.upsert({
    where: { id: "seed-job-002" },
    update: {},
    create: {
      id: "seed-job-002",
      parentId: parentUser.id,
      title: "After-school care for two boys in Remuera",
      suburb: "Remuera",
      careType: "after_school",
      daysRequired: "Mon, Wed, Fri 3pm–6pm",
      childCount: 2,
      childAges: "6 and 8 years",
      startDate: "2025-02-15",
      hourlyBudget: 32,
      description: "Need a reliable nanny for after-school pickup and care. Boys are active and love sports. Must have a driver licence for school pickup.",
      status: "PENDING",
      contactEmail: "parent@nannyora.co.nz",
    },
  });
  console.log("✅ Sample job posts created");

  // ============================================================
  // 6. Create Sample Nanny Documents
  // ============================================================

  await prisma.nannyDocument.upsert({
    where: { id: "seed-doc-001" },
    update: {},
    create: {
      id: "seed-doc-001",
      nannyProfileId: nannyProfile.id,
      documentType: "ID",
      fileName: "emma-id.pdf",
      reviewStatus: "APPROVED",
      reviewedAt: new Date(),
      reviewedBy: admin.id,
    },
  });

  await prisma.nannyDocument.upsert({
    where: { id: "seed-doc-002" },
    update: {},
    create: {
      id: "seed-doc-002",
      nannyProfileId: nannyProfile.id,
      documentType: "FIRST_AID_CERT",
      fileName: "emma-first-aid.pdf",
      reviewStatus: "APPROVED",
      reviewedAt: new Date(),
      reviewedBy: admin.id,
    },
  });

  await prisma.nannyDocument.upsert({
    where: { id: "seed-doc-003" },
    update: {},
    create: {
      id: "seed-doc-003",
      nannyProfileId: nannyProfile.id,
      documentType: "TEACHER_REGISTRATION",
      fileName: "emma-teacher-reg.pdf",
      reviewStatus: "PENDING",
    },
  });
  console.log("✅ Sample documents created");

  console.log("\n🎉 Seed complete!\n");
  console.log("╔═══════════════════════════════════════════════════╗");
  console.log("║  Demo Accounts                                   ║");
  console.log("╠═══════════════════════════════════════════════════╣");
  console.log("║  Admin:  admin@nannyora.co.nz  / demo1234        ║");
  console.log("║  Nanny:  emma@nannyora.co.nz   / demo1234        ║");
  console.log("║  Parent: parent@nannyora.co.nz / demo1234        ║");
  console.log("╚═══════════════════════════════════════════════════╝");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
