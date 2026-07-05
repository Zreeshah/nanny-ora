import assert from "node:assert";
import { toE164NZ } from "./normalise";

assert.equal(toE164NZ("0211234567"), "+64211234567");   // local mobile
assert.equal(toE164NZ("021 123 4567"), "+64211234567"); // with spaces
assert.equal(toE164NZ("+64 21 123 4567"), "+64211234567"); // already +64
assert.equal(toE164NZ("6421234567"), "+6421234567");    // country-coded, no +
assert.equal(toE164NZ("(09) 555-1234"), "+6495551234"); // landline — trunk 0 dropped
assert.equal(toE164NZ(""), null);
assert.equal(toE164NZ(null), null);

console.log("sms/normalise.test.ts: ok");
