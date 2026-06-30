import assert from "node:assert";
import { pickImages, SITE_IMAGES } from "./images";

// Deterministic: same seed -> identical pick (no hydration mismatch).
const a = pickImages({ tags: ["trust", "safety"], count: 3, seed: "trust-and-safety" });
const b = pickImages({ tags: ["trust", "safety"], count: 3, seed: "trust-and-safety" });
assert.deepEqual(a.map((i) => i.src), b.map((i) => i.src), "same seed must be stable");

// Intelligent: top results actually match the requested topic.
assert.ok(a[0].tags.includes("trust") || a[0].tags.includes("safety"), "top pick is on-topic");

// Different seeds diverge (randomness across pages).
const c = pickImages({ tags: ["trust", "safety"], count: 3, seed: "different-page" });
assert.notDeepEqual(a.map((i) => i.src), c.map((i) => i.src), "different seeds should differ");

// Suburb matching: Ponsonby seed+tag surfaces the Ponsonby photo first.
const pon = pickImages({ tags: ["suburb", "ponsonby"], count: 1, seed: "ponsonby" });
assert.ok(pon[0].src.includes("ponsonby"), "suburb tag surfaces matching suburb image");

// Always returns the requested count, even with no matches.
assert.equal(pickImages({ tags: ["nope"], count: 5, seed: "x" }).length, 5, "fills to count");
assert.equal(SITE_IMAGES.length, 34, "all images registered");

console.log("images.test.ts: ok");
