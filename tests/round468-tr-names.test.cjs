// Round 468 fix 1 audit: every What's-new (WNEW / __vpWnew283) and feature-finder (FEATS)
// name must have a TR_MSG translation row, or the card and finder fall back to English on
// Hindi and Gujarati (round 221 class of bug).
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

const trKeys = new Set();
for (const m of src.matchAll(/"((?:[^"\\]|\\.){2,120})":\s*\[\s*"/g)) trKeys.add(m[1]);

const names = new Set();
for (const m of src.matchAll(/__vpWnew283\(\s*"((?:[^"\\]|\\.)+)"/g)) names.add(m[1]);
for (const m of src.matchAll(/WNEW\.unshift\(\["((?:[^"\\]|\\.)+)"/g)) names.add(m[1]);
const wnew = src.match(/var WNEW = \[([\s\S]*?)\];/);
if (wnew) for (const m of wnew[1].matchAll(/\["((?:[^"\\]|\\.)+)"\s*,\s*"#/g)) names.add(m[1]);
const feats = src.match(/var FEATS = \[([\s\S]*?)\n\s*\];/);
if (feats) for (const m of feats[1].matchAll(/\["((?:[^"\\]|\\.)+)"\s*,\s*"[^"]*",\s*"#/g)) names.add(m[1]);

const missing = [...names].filter((n) => !trKeys.has(n));
if (missing.length) {
  console.error("names without a TR_MSG row:\n" + missing.map((n) => "  - " + n).join("\n"));
  process.exit(1);
}
console.log("round468-tr-names ok: " + names.size + " names all translated");
