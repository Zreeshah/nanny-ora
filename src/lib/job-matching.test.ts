import assert from "node:assert";
import { nannyMatchesJob } from "./job-matching";

const job = {
  id: "job-1",
  suburb: "Wellington",
  careType: "recurring_nanny",
  hourlyBudget: 32,
};

const nanny = {
  id: "nanny-1",
  suburb: "Karori",
  areasCovered: JSON.stringify(["Wellington", "Kelburn"]),
  careTypes: JSON.stringify(["recurring_nanny", "after_school"]),
  hourlyRate: 30,
  adminStatus: "VERIFIED",
  placementStatus: "AVAILABLE",
};

assert.equal(nannyMatchesJob(nanny, job), true, "exact travel-area, care-type and budget match qualifies");
assert.equal(nannyMatchesJob({ ...nanny, hourlyRate: 33 }, job), false, "rate above the stated budget does not qualify");
assert.equal(nannyMatchesJob({ ...nanny, careTypes: JSON.stringify(["night_nanny"]) }, job), false, "different care type does not qualify");
assert.equal(nannyMatchesJob({ ...nanny, placementStatus: "PLACED" }, job), false, "unavailable nannies do not qualify");
assert.equal(nannyMatchesJob({ ...nanny, adminStatus: "SUBMITTED" }, job), false, "non-public nanny profiles do not qualify");
assert.equal(
  nannyMatchesJob({ ...nanny, suburb: "Mount Wellington", areasCovered: JSON.stringify(["East Auckland"]) }, job),
  false,
  "Mount Wellington must not match Wellington City",
);

console.log("job-matching.test.ts: ok");
