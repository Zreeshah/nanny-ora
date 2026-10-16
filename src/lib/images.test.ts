import assert from "node:assert";
import { existsSync } from "node:fs";
import path from "node:path";
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

const realPlacement = pickImages({ tags: ["real-interactive-reading", "family"], count: 1, seed: "interview-guide" });
assert.ok(realPlacement[0].src.includes("caregiver-reading-interactive-book"), "real-care tag surfaces its assigned image");

// Always returns the requested count, even with no matches.
assert.equal(pickImages({ tags: ["nope"], count: 5, seed: "x" }).length, 5, "fills to count");
assert.equal(new Set(SITE_IMAGES.map((image) => image.src)).size, SITE_IMAGES.length, "image sources are unique");
assert.ok(SITE_IMAGES.every((image) => existsSync(path.join(process.cwd(), "public", image.src))), "all registered images exist");
assert.equal(SITE_IMAGES.filter((image) => image.tags.includes("real-care")).length, 15, "all real-care images registered");

console.log("images.test.ts: ok");
