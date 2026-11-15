/* Round 373: every literal T("...") key in the scripts must have a row in the global
   translation table. Round 372 fix 1 ('Finish rate') and round 373 fix 1 ('Best day')
   were both cases where a dedup cleanup removed the GLOBAL row while a card kept its own
   LOCAL table - every caller of the global T() then silently fell back to English in
   Hindi and Gujarati. T() falls back to the key itself, so a missing row never throws;
   only a scan like this sees it. Language-neutral strings (punctuation, emoji) are
   allowlisted - they read the same in every language. */
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

const blocks = [...src.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
const all = blocks.join("\n");

// collect global translation keys: the TR_MSG literal, Object.assign(TR_MSG, {...}) merges
// and TR_MSG["key"] = [...] bracket rows (double- and single-quoted).
const keys = new Set();
const unescD = (s) => { try { return JSON.parse('"' + s + '"'); } catch (e) { return null; } };
const unescS = (s) => s.replace(/\\'/g, "'");
for (const m of all.matchAll(/TR_MSG\[\s*"((?:\\.|[^"])*)"\s*\]\s*=\s*\[/g)) { const k = unescD(m[1]); if (k !== null) keys.add(k); }
for (const m of all.matchAll(/TR_MSG\[\s*'((?:\\.|[^'])*)'\s*\]\s*=\s*\[/g)) keys.add(unescS(m[1]));
for (const m of all.matchAll(/Object\.assign\(TR_MSG,\s*(\{(?:[^{}]|\{[^{}]*\})*?\})\)/g)) {
  try { const o = eval("(" + m[1] + ")"); Object.keys(o).forEach((k) => keys.add(k)); } catch (e) {}
}
const li = all.indexOf("TR_MSG = {");
if (li >= 0) {
  let depth = 0, j = all.indexOf("{", li); const start = j;
  for (; j < all.length; j++) { if (all[j] === "{") depth++; else if (all[j] === "}") { depth--; if (!depth) break; } }
  try { const o = eval("(" + all.slice(start, j + 1) + ")"); Object.keys(o).forEach((k) => keys.add(k)); } catch (e) {}
}
if (keys.size < 4000) { console.error("FAIL: key extraction looks broken, only " + keys.size + " keys"); process.exit(1); }

// collect literal T("...") / T('...') calls
const used = new Set();
for (const m of all.matchAll(/[^A-Za-z0-9_.]T\(\s*"((?:\\.|[^"]){2,120})"\s*\)/g)) { const k = unescD(m[1]); if (k !== null) used.add(k); }
for (const m of all.matchAll(/[^A-Za-z0-9_.]T\(\s*'((?:\\.|[^']){2,120})'\s*\)/g)) used.add(unescS(m[1]));

// language-neutral strings: no letters in any script - same read in every language
const neutral = (s) => !/[\p{L}]/u.test(s);

const missing = [...used].filter((k) => !keys.has(k) && !neutral(k)).sort();
if (missing.length) {
  console.error("FAIL: " + missing.length + " T() keys have no translation row:");
  missing.forEach((k) => console.error(" - " + JSON.stringify(k)));
  process.exit(1);
}
console.log("Round 373 translation coverage: all " + used.size + " literal T() keys have a translation row (" + keys.size + " rows).");
