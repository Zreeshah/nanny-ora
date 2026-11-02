import assert from "node:assert/strict";
import { parseFamilyProfileNotes, serialiseFamilyProfileNotes } from "./family-profile-notes";

const stored = serialiseFamilyProfileNotes("Hobsonville home; Albany school pickup", "Child is usually ready by 3pm.");
assert.deepEqual(parseFamilyProfileNotes(stored), {
  careLocations: "Hobsonville home; Albany school pickup",
  additionalNotes: "Child is usually ready by 3pm.",
});

assert.deepEqual(parseFamilyProfileNotes("Existing family preference"), {
  careLocations: "",
  additionalNotes: "Existing family preference",
});

console.log("family-profile-notes.test.ts: ok");
