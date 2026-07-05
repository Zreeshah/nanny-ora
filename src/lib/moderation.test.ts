import assert from "node:assert";
import { detectContactInfo } from "./moderation";

// Emails flagged
assert.equal(detectContactInfo("reach me at jane@example.com").email, true);
assert.equal(detectContactInfo("reach me at jane@example.com").flagged, true);
// Phones flagged (various separators)
assert.equal(detectContactInfo("call 021 123 4567").phone, true);
assert.equal(detectContactInfo("my number is +64 21 555 0100").phone, true);
assert.equal(detectContactInfo("(09) 555-1234").phone, true);
// Clean message not flagged
assert.equal(detectContactInfo("Hi, are you free Mondays for 2 kids?").flagged, false);
// Short digit runs (e.g. ages, counts) not flagged
assert.equal(detectContactInfo("I have 2 kids aged 4 and 7").flagged, false);

console.log("moderation.test.ts: ok");
