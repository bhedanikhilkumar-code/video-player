/* Round 396: regression guards for two classes that bit earlier rounds.
   1) Duplicate keys across the global translation rows. Rounds 372/373 lost
      translations when a cleanup removed the wrong copy of a repeated row; a
      true duplicate (same English key merged twice into TR_MSG) silently
      shadows one entry and risks the same loss. This parses every
      Object.assign(TR_MSG, {...}) block with a string/comment/template-aware
      scan (placeholders like {n} contain braces, so a naive brace count
      miscounts), evaluates each object, and fails on any repeated key.
   2) Duplicate element ids in the static markup. Comments and script/style
      bodies are stripped first, so ids inside template strings (built at
      runtime) and ids mentioned in comments do not count. */
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

// 1) global translation rows must not repeat a key
const counts = new Map();
const re = /Object\.assign\(TR_MSG\s*,\s*\{/g;
let m, parsed = 0;
while ((m = re.exec(src))) {
  const start = m.index + m[0].length - 1;
  let depth = 0, state = null, esc = false, j = start;
  for (; j < src.length; j++) {
    const c = src[j];
    if (state) {
      if (esc) { esc = false; continue; }
      if (c === "\\") { esc = true; continue; }
      if (state === "line") { if (c === "\n") state = null; continue; }
      if (state === "block") { if (c === "*" && src[j + 1] === "/") { state = null; j++; } continue; }
      if (state === "tmpl") { if (c === "`") state = null; continue; }
      if (c === state) state = null;
      continue;
    }
    if (c === '"' || c === "'") { state = c; continue; }
    if (c === "`") { state = "tmpl"; continue; }
    if (c === "/" && src[j + 1] === "/") { state = "line"; j++; continue; }
    if (c === "/" && src[j + 1] === "*") { state = "block"; j++; continue; }
    if (c === "{") depth++;
    else if (c === "}") { depth--; if (!depth) break; }
  }
  const o = eval("(" + src.slice(start, j + 1) + ")");
  parsed++;
  for (const k of Object.keys(o)) counts.set(k, (counts.get(k) || 0) + 1);
}
assert.ok(parsed > 100, "expected to parse the many translation merge blocks, got " + parsed);
assert.ok(counts.size > 4000, "expected thousands of translation rows, got " + counts.size);
const dupKeys = [...counts.entries()].filter(([, v]) => v > 1).map(([k, v]) => v + "x " + JSON.stringify(k.slice(0, 60)));
assert.deepEqual(dupKeys, [], "duplicate global translation rows: " + dupKeys.join(", "));

// 2) static markup must not repeat an element id
const markup = src
  .replace(/<!--[\s\S]*?-->/g, "")
  .replace(/<script\b[\s\S]*?<\/script>/gi, "")
  .replace(/<style\b[\s\S]*?<\/style>/gi, "");
const idCount = new Map();
for (const im of markup.matchAll(/\sid="([^"]+)"/g)) idCount.set(im[1], (idCount.get(im[1]) || 0) + 1);
assert.ok(idCount.size > 500, "expected hundreds of static ids, got " + idCount.size);
const dupIds = [...idCount.entries()].filter(([, v]) => v > 1).map(([k, v]) => v + "x " + k);
assert.deepEqual(dupIds, [], "duplicate element ids in markup: " + dupIds.join(", "));

console.log("round396 OK: " + counts.size + " unique translation rows across " + parsed + " merge blocks, " + idCount.size + " unique static ids");
