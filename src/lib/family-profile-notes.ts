/**
 * ParentProfile has a long-standing free-text notes field. Keep the storage
 * schema stable while allowing care-location details and general notes to be
 * managed independently. Plain-text notes from existing families remain
 * readable as general notes.
 */
const FAMILY_PROFILE_NOTES_FORMAT = "nannyora-family-profile-v1";

type FamilyProfileNotes = {
  careLocations: string;
  additionalNotes: string;
};

export function serialiseFamilyProfileNotes(
  careLocations = "",
  additionalNotes = "",
): string {
  return JSON.stringify({
    format: FAMILY_PROFILE_NOTES_FORMAT,
    careLocations: careLocations.trim(),
    additionalNotes: additionalNotes.trim(),
  });
}

export function parseFamilyProfileNotes(notes: string | null | undefined): FamilyProfileNotes {
  const fallback = { careLocations: "", additionalNotes: notes?.trim() || "" };
  if (!notes) return fallback;

  try {
    const value: unknown = JSON.parse(notes);
    if (!value || typeof value !== "object") return fallback;
    const record = value as Record<string, unknown>;
    if (record.format !== FAMILY_PROFILE_NOTES_FORMAT) return fallback;

    return {
      careLocations: typeof record.careLocations === "string" ? record.careLocations.trim() : "",
      additionalNotes: typeof record.additionalNotes === "string" ? record.additionalNotes.trim() : "",
    };
  } catch {
    return fallback;
  }
}
