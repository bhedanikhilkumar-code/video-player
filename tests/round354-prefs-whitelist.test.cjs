/* Round 354: every prefs.<key> written anywhere in the app must be restored by the
   loader whitelist (the big `saved.<key>` block) - otherwise the setting silently
   resets on the next open. Static guard so a future round cannot forget the loader. */
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

const written = new Set();
for (const m of src.matchAll(/prefs\.([A-Za-z_$][\w$]*)\s*=[^=]/g)) written.add(m[1]);

const loaded = new Set();
for (const m of src.matchAll(/saved\.([A-Za-z_$][\w$]*)/g)) loaded.add(m[1]);
// loader also restores keys listed as string arrays iterated over `saved[k]`
for (const m of src.matchAll(/\[((?:"[\w$]+"(?:,\s*)?)+)\]\.forEach\(function\s*\(\s*k\s*\)\s*\{[^}]*saved\[k\]/g)) {
  m[1].match(/"[\w$]+"/g).forEach((s) => loaded.add(s.slice(1, -1)));
}

const missing = [...written].filter((k) => !loaded.has(k));
if (missing.length) {
  console.error("prefs keys written but never restored by the loader:", missing.join(", "));
  process.exit(1);
}
console.log("Round 354 prefs whitelist: all " + written.size + " written prefs keys are restored by the loader.");
