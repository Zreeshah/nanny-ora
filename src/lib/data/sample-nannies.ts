// ============================================================
// NannyOra — Sample Data for Development
// ============================================================

import type { NannyProfilePublic } from "@/types";

export const sampleNannies: NannyProfilePublic[] = [
  {
    id: "nanny-001",
    userId: "user-001",
    name: "Sarah Mitchell",
    suburb: "Remuera",
    areasCovered: ["Remuera", "Newmarket", "Epsom", "Parnell"],
    yearsExperience: 8,
    careTypes: ["recurring_nanny", "casual_babysitting", "after_school"],
    qualifications: ["Diploma in ECE", "First Aid Certificate"],
    eceExperience: true,
    neurodiverseExperience: false,
    firstAidCurrent: true,
    driverLicence: true,
    hourlyRate: 35,
    bio: "Passionate early childhood educator with over 8 years of experience caring for children of all ages. I specialise in creating engaging, developmentally appropriate activities that support your child's growth and curiosity. Patient, warm, and reliable — I treat every family's home with the same care and respect I'd want for my own.",
    availabilitySummary: "Mon–Fri, some Saturdays",
    availability: ["weekday_morning", "weekday_afternoon", "weekend_morning"],
    specialistTags: ["ece_background", "first_aid", "baby_experience"],
    verificationLevel: "VERIFIED",
    profileImageUrl: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=face",
    createdAt: new Date("2024-06-01"),
  },
  {
    id: "nanny-002",
    userId: "user-002",
    name: "Emma Thompson",
    suburb: "Ponsonby",
    areasCovered: ["Ponsonby", "Grey Lynn", "Herne Bay", "Freemans Bay"],
    yearsExperience: 12,
    careTypes: ["recurring_nanny", "specialist_sensory"],
    qualifications: ["Bachelor of Teaching (ECE)", "Registered Teacher", "Sensory Processing Workshop Certificate"],
    eceExperience: true,
    neurodiverseExperience: true,
    firstAidCurrent: true,
    driverLicence: true,
    hourlyRate: 42,
    bio: "Registered teacher and experienced nanny with specialist training in sensory-aware and neurodiverse childcare. I provide calm, structured care environments where every child feels safe and supported. My background in ECE means I bring a strong understanding of child development, and I work closely with families to ensure consistency between home and care.",
    availabilitySummary: "Flexible schedule — contact for details",
    availability: ["weekday_morning", "weekday_afternoon", "weekday_evening", "flexible"],
    specialistTags: ["sensory_aware", "registered_teacher", "neurodiverse", "ece_background", "first_aid"],
    verificationLevel: "SPECIALIST",
    profileImageUrl: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=face",
    createdAt: new Date("2024-03-15"),
  },
  {
    id: "nanny-003",
    userId: "user-003",
    name: "Mia Johnson",
    suburb: "Devonport",
    areasCovered: ["Devonport", "Takapuna", "Birkenhead"],
    yearsExperience: 5,
    careTypes: ["after_school", "casual_babysitting", "weekend"],
    qualifications: ["First Aid Certificate", "Working with Children Check"],
    eceExperience: false,
    neurodiverseExperience: false,
    firstAidCurrent: true,
    driverLicence: true,
    hourlyRate: 30,
    bio: "Warm and caring nanny who loves outdoor activities and creative play. I'm based on the North Shore and enjoy spending time at local beaches and parks with the children I care for. First aid certified with experience caring for toddlers and preschool-aged children. Reliable and always on time!",
    availabilitySummary: "Weekday afternoons, weekends",
    availability: ["weekday_afternoon", "weekend_morning", "weekend_afternoon"],
    specialistTags: ["first_aid", "after_school_care"],
    verificationLevel: "PREMIUM_VETTED",
    profileImageUrl: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=face",
    createdAt: new Date("2024-08-20"),
  },
  {
    id: "nanny-004",
    userId: "user-004",
    name: "Aroha Williams",
    suburb: "Grey Lynn",
    areasCovered: ["Grey Lynn", "Ponsonby", "Mount Eden", "Kingsland"],
    yearsExperience: 10,
    careTypes: ["recurring_nanny", "specialist_sensory"],
    qualifications: ["Graduate Diploma in Special Education", "ECE Diploma", "First Aid Certificate"],
    eceExperience: true,
    neurodiverseExperience: true,
    firstAidCurrent: true,
    driverLicence: true,
    hourlyRate: 38,
    bio: "Early intervention specialist and experienced nanny providing patient, tailored care for children with diverse needs. I have a strong background in ECE and special education, with hands-on experience supporting children with autism, ADHD, and sensory processing differences. I believe every child deserves care that meets them where they are.",
    availabilitySummary: "Mon–Fri daytime",
    availability: ["weekday_morning", "weekday_afternoon"],
    specialistTags: ["early_intervention", "autism_support", "ece_background", "neurodiverse", "first_aid"],
    verificationLevel: "SPECIALIST",
    profileImageUrl: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=face",
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "nanny-005",
    userId: "user-005",
    name: "Lily Chen",
    suburb: "Epsom",
    areasCovered: ["Epsom", "Remuera", "Mount Eden", "Newmarket"],
    yearsExperience: 3,
    careTypes: ["casual_babysitting", "after_school", "weekend"],
    qualifications: ["First Aid Certificate"],
    eceExperience: false,
    neurodiverseExperience: false,
    firstAidCurrent: true,
    driverLicence: false,
    hourlyRate: 28,
    bio: "Friendly and energetic nanny with 3 years of experience. I love arts, crafts, and reading with children. Currently studying early childhood education part-time while nannying. I'm dependable, patient, and always bring a positive attitude. Happy to help with school pickups and after-school activities.",
    availabilitySummary: "Afternoons and weekends",
    availability: ["weekday_afternoon", "weekday_evening", "weekend_morning", "weekend_afternoon"],
    specialistTags: ["first_aid", "after_school_care"],
    verificationLevel: "VERIFIED",
    profileImageUrl: "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=face",
    createdAt: new Date("2024-09-05"),
  },
  {
    id: "nanny-006",
    userId: "user-006",
    name: "Grace Taylor",
    suburb: "Takapuna",
    areasCovered: ["Takapuna", "Devonport", "Milford", "Albany"],
    yearsExperience: 15,
    careTypes: ["recurring_nanny", "emergency_backup", "specialist_sensory"],
    qualifications: ["Bachelor of Education", "Registered Teacher", "Applied Behaviour Analysis (ABA) Certificate", "First Aid"],
    eceExperience: true,
    neurodiverseExperience: true,
    firstAidCurrent: true,
    driverLicence: true,
    hourlyRate: 48,
    bio: "With 15 years in education and childcare, I bring deep expertise in supporting children across all developmental stages. I hold a Bachelor of Education and ABA certification, with extensive experience working alongside occupational therapists and speech-language therapists. I offer structured, nurturing care with a focus on communication and social skills development.",
    availabilitySummary: "Weekdays — limited weekend availability",
    availability: ["weekday_morning", "weekday_afternoon"],
    specialistTags: ["sensory_aware", "autism_support", "adhd_support", "registered_teacher", "early_intervention", "first_aid"],
    verificationLevel: "SPECIALIST",
    profileImageUrl: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=face",
    createdAt: new Date("2023-11-01"),
  },
  {
    id: "nanny-007",
    userId: "user-007",
    name: "Jessica Adams",
    suburb: "Mount Eden",
    areasCovered: ["Mount Eden", "Epsom", "Kingsland", "Grey Lynn"],
    yearsExperience: 6,
    careTypes: ["recurring_nanny", "casual_babysitting"],
    qualifications: ["Diploma in ECE", "First Aid Certificate"],
    eceExperience: true,
    neurodiverseExperience: false,
    firstAidCurrent: true,
    driverLicence: true,
    hourlyRate: 33,
    bio: "Qualified ECE teacher turned full-time nanny. I bring centre-based experience into the home environment, offering enriching activities, routines, and lots of fun. I specialise in caring for babies and toddlers and love helping children reach developmental milestones in a relaxed, nurturing setting.",
    availabilitySummary: "Mon, Tue, Thu, Fri",
    availability: ["weekday_morning", "weekday_afternoon"],
    specialistTags: ["ece_background", "baby_experience", "first_aid"],
    verificationLevel: "VERIFIED",
    profileImageUrl: "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=face",
    createdAt: new Date("2024-04-18"),
  },
  {
    id: "nanny-008",
    userId: "user-008",
    name: "Olivia Scott",
    suburb: "Albany",
    areasCovered: ["Albany", "Takapuna", "North Shore"],
    yearsExperience: 4,
    careTypes: ["after_school", "casual_babysitting", "weekend", "emergency_backup"],
    qualifications: ["First Aid Certificate", "Police Vet"],
    eceExperience: false,
    neurodiverseExperience: false,
    firstAidCurrent: true,
    driverLicence: true,
    hourlyRate: 28,
    bio: "Reliable and fun nanny on the North Shore. I have four years of experience with school-aged children and love helping with homework, outdoor play, and cooking healthy snacks together. I'm also available for emergency backup care on short notice. Police vetted and first aid certified.",
    availabilitySummary: "After school, weekends, emergency backup",
    availability: ["weekday_afternoon", "weekday_evening", "weekend_morning", "weekend_afternoon", "flexible"],
    specialistTags: ["first_aid", "after_school_care"],
    verificationLevel: "LISTED",
    profileImageUrl: "https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=face",
    createdAt: new Date("2024-10-01"),
  },
  {
    id: "nanny-009",
    userId: "user-009",
    name: "Hannah Patel",
    suburb: "Newmarket",
    areasCovered: ["Newmarket", "Remuera", "Epsom", "Parnell"],
    yearsExperience: 7,
    careTypes: ["recurring_nanny", "casual_babysitting"],
    qualifications: ["Bachelor of ECE", "First Aid Certificate", "Te Reo Māori Basics"],
    eceExperience: true,
    neurodiverseExperience: false,
    firstAidCurrent: true,
    driverLicence: true,
    hourlyRate: 36,
    bio: "Experienced ECE-qualified nanny who brings a bicultural approach to childcare. I incorporate Te Reo Māori, waiata, and tikanga into everyday care in a natural and fun way. I'm passionate about nature-based learning and regularly take children to local parks, gardens, and nature trails.",
    availabilitySummary: "Mon–Thu full days",
    availability: ["weekday_morning", "weekday_afternoon"],
    specialistTags: ["ece_background", "first_aid", "baby_experience"],
    verificationLevel: "PREMIUM_VETTED",
    profileImageUrl: "https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=face",
    createdAt: new Date("2024-05-22"),
  },
  {
    id: "nanny-010",
    userId: "user-010",
    name: "Rachel Foster",
    suburb: "Henderson",
    areasCovered: ["Henderson", "Te Atatu", "Glen Eden", "New Lynn"],
    yearsExperience: 9,
    careTypes: ["recurring_nanny", "specialist_sensory", "after_school"],
    qualifications: ["Diploma in ECE", "ASD Support Certificate", "First Aid Certificate"],
    eceExperience: true,
    neurodiverseExperience: true,
    firstAidCurrent: true,
    driverLicence: true,
    hourlyRate: 35,
    bio: "West Auckland nanny with nearly a decade of experience, including specialist training in supporting children on the autism spectrum. I provide consistent, calm, and playful care that respects each child's individual pace and needs. I work well alongside families and support teams to ensure a cohesive approach.",
    availabilitySummary: "Mon–Fri, flexible hours",
    availability: ["weekday_morning", "weekday_afternoon", "weekday_evening", "flexible"],
    specialistTags: ["autism_support", "neurodiverse", "ece_background", "first_aid"],
    verificationLevel: "SPECIALIST",
    profileImageUrl: "https://images.pexels.com/photos/3727464/pexels-photo-3727464.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=face",
    createdAt: new Date("2024-02-14"),
  },
];

/**
 * Get all sample nannies, optionally filtered.
 */
export function getSampleNannies(filters?: {
  suburb?: string;
  verifiedOnly?: boolean;
  specialistTag?: string;
  careType?: string;
  maxRate?: number;
  minRate?: number;
}): NannyProfilePublic[] {
  let results = [...sampleNannies];

  if (filters?.suburb) {
    results = results.filter(
      (n) => n.suburb.toLowerCase() === filters.suburb!.toLowerCase() ||
        n.areasCovered.some((a) => a.toLowerCase() === filters.suburb!.toLowerCase())
    );
  }

  if (filters?.verifiedOnly) {
    results = results.filter((n) => n.verificationLevel !== "LISTED");
  }

  if (filters?.specialistTag) {
    results = results.filter((n) =>
      (n.specialistTags as string[]).includes(filters.specialistTag!)
    );
  }

  if (filters?.careType) {
    results = results.filter((n) =>
      (n.careTypes as string[]).includes(filters.careType!)
    );
  }

  if (filters?.minRate) {
    results = results.filter((n) => n.hourlyRate >= filters.minRate!);
  }

  if (filters?.maxRate) {
    results = results.filter((n) => n.hourlyRate <= filters.maxRate!);
  }

  return results;
}

/**
 * Get a single sample nanny by ID.
 */
export function getSampleNannyById(id: string): NannyProfilePublic | undefined {
  return sampleNannies.find((n) => n.id === id);
}
