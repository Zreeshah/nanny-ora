import assert from "node:assert";
import { escapeHtml } from "./escape";

// XSS guard: a referee/nanny name containing markup must not produce live HTML.
assert.equal(escapeHtml(`<script>alert(1)</script>`), "&lt;script&gt;alert(1)&lt;/script&gt;");
assert.equal(escapeHtml(`Tom & "Jerry" O'Neil`), "Tom &amp; &quot;Jerry&quot; O&#39;Neil");
assert.equal(escapeHtml("plain name"), "plain name");

console.log("escape.test.ts: ok");
